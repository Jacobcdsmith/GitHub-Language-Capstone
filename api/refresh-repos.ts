import type { IncomingMessage, ServerResponse } from "http";
import { timingSafeEqual } from "crypto";
import {
  searchTopReposByLanguage,
  getCommunityProfile,
  getContributorsCount,
  getCommitsCountSince,
  getOpenPullRequestCount,
  getLatestReleaseInfo,
  runWithConcurrency,
  putRepoContent,
  getRepoFile,
  type SearchRepoItem
} from "./lib/github.js";
import {
  maxScale,
  recencyScore,
  popularityScore,
  activityScore,
  healthScore,
  overallScore,
  maturityScore,
  complianceScore,
  isEnterpriseReady,
  growthSignal,
  pearsonCorrelation
} from "./lib/scoring.js";
import type { LiveDataset, LiveRepoRecord, LiveLanguageSummary, LiveHealthIndicator, HistoryEntry } from "../src/types/liveDataset";

// Must match the language names used in src/data/analysisData.ts.
const LANGUAGES = ["Rust", "TypeScript", "Go", "C++", "Python", "JavaScript", "Ruby", "Java", "Kotlin", "PHP", "Swift", "C#"];

const REPOS_PER_LANGUAGE = 100;
const ENRICHED_PER_LANGUAGE = 25;
// Each enrichRepo call fires 7 concurrent GitHub requests, so this must be bounded
// globally (across all 12 languages), not per-language, to stay under GitHub's ~100
// concurrent secondary rate limit: 12 * 7 = 84, leaving headroom.
const GLOBAL_ENRICH_CONCURRENCY = 12;
const RECENT_RELEASE_WINDOW_DAYS = 180;
const OUTPUT_PATH = "public/live-dataset.json";
const HISTORY_PATH = "public/history.json";
const HISTORY_MAX_ENTRIES = 90;
const OUTPUT_BRANCH = "main";
const REPO_OWNER = "Jacobcdsmith";
const REPO_NAME = "GitHub-Language-Capstone";

async function updateHistory(languages: LiveLanguageSummary[], generatedAt: string): Promise<void> {
  const todayDate = generatedAt.slice(0, 10);

  let history: HistoryEntry[] = [];
  const existingFile = await getRepoFile(REPO_OWNER, REPO_NAME, HISTORY_PATH, OUTPUT_BRANCH);
  if (existingFile) {
    try {
      const parsed = JSON.parse(existingFile.content);
      if (Array.isArray(parsed)) history = parsed;
    } catch {
      history = [];
    }
  }

  const newEntry: HistoryEntry = {
    date: todayDate,
    generatedAt,
    languages: languages.map((l) => ({
      language: l.language,
      overallScore: l.overallScore,
      popularityScore: l.popularityScore,
      activityScore: l.activityScore,
      healthScore: l.healthScore
    }))
  };

  // Dedupe by calendar date (not just today's) in case older entries were ever
  // duplicated — a same-day re-run replaces that day's entry rather than
  // duplicating it.
  const byDate = new Map(history.map((h) => [h.date, h]));
  byDate.set(todayDate, newEntry);
  const updated = [...byDate.values()]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-HISTORY_MAX_ENTRIES);

  await putRepoContent(REPO_OWNER, REPO_NAME, HISTORY_PATH, OUTPUT_BRANCH, JSON.stringify(updated, null, 2), `chore(data): update history (${todayDate})`);
}

function daysSince(iso: string): number {
  return Math.max(0, (Date.now() - new Date(iso).getTime()) / (24 * 60 * 60 * 1000));
}

interface EnrichedFields {
  contributorsCount: number;
  commits30d: number;
  commits90d: number;
  commits365d: number;
  hasReadme: boolean;
  hasLicense: boolean;
  hasContributing: boolean;
  hasCodeOfConduct: boolean;
  hasIssueTemplate: boolean;
  hasSecurity: boolean;
  openPullRequests: number;
  hasReleases: boolean;
  daysSinceLastRelease: number | null;
}

async function enrichRepo(item: SearchRepoItem): Promise<EnrichedFields> {
  const [profile, contributorsCount, commits30d, commits90d, commits365d, openPullRequests, releaseInfo] = await Promise.all([
    getCommunityProfile(item.owner.login, item.name),
    getContributorsCount(item.owner.login, item.name),
    getCommitsCountSince(item.owner.login, item.name, 30),
    getCommitsCountSince(item.owner.login, item.name, 90),
    getCommitsCountSince(item.owner.login, item.name, 365),
    getOpenPullRequestCount(item.owner.login, item.name),
    getLatestReleaseInfo(item.owner.login, item.name)
  ]);
  return {
    contributorsCount,
    commits30d,
    commits90d,
    commits365d,
    hasReadme: profile.hasReadme,
    hasLicense: profile.hasLicense || Boolean(item.license),
    hasContributing: profile.hasContributing,
    hasCodeOfConduct: profile.hasCodeOfConduct,
    hasIssueTemplate: profile.hasIssueTemplate,
    hasSecurity: profile.hasSecurity,
    openPullRequests,
    hasReleases: releaseInfo.hasReleases,
    daysSinceLastRelease: releaseInfo.daysSinceLastRelease
  };
}

interface LanguageItems {
  language: string;
  items: SearchRepoItem[];
}

async function fetchLanguageItems(language: string): Promise<LanguageItems> {
  const items = await searchTopReposByLanguage(language, REPOS_PER_LANGUAGE);
  return { language, items };
}

function assembleLanguageRecords(language: string, items: SearchRepoItem[], enrichedFields: EnrichedFields[]): { language: string; repos: LiveRepoRecord[] } {
  const starsNorm = maxScale(items.map((i) => i.stargazers_count));
  const forksNorm = maxScale(items.map((i) => i.forks_count));
  const watchersNorm = maxScale(items.map((i) => i.watchers_count));

  const commits30Norm = maxScale(enrichedFields.map((e) => e.commits30d));
  const contributorsNorm = maxScale(enrichedFields.map((e) => e.contributorsCount));

  const repos: LiveRepoRecord[] = items.map((item, index) => {
    const days = daysSince(item.pushed_at);
    const recency = recencyScore(days);
    const popularity = popularityScore(starsNorm[index], forksNorm[index], watchersNorm[index]);

    const enrichedIndex = index < ENRICHED_PER_LANGUAGE ? index : -1;
    const enrichedField = enrichedIndex >= 0 ? enrichedFields[enrichedIndex] : undefined;

    let enriched: LiveRepoRecord["enriched"];
    if (enrichedField) {
      const activity = activityScore(commits30Norm[enrichedIndex], contributorsNorm[enrichedIndex], recency);
      const health = healthScore(enrichedField);
      const overall = overallScore(popularity, activity, health);
      enriched = {
        contributorsCount: enrichedField.contributorsCount,
        commits30d: enrichedField.commits30d,
        commits90d: enrichedField.commits90d,
        commits365d: enrichedField.commits365d,
        activityScore: activity,
        healthScore: health,
        overallScore: overall,
        maturityScore: maturityScore(health, activity, popularity),
        growthSignal: growthSignal(enrichedField.commits30d, enrichedField.commits90d, enrichedField.commits365d, recency),
        complianceScore: complianceScore(enrichedField),
        enterpriseReady: isEnterpriseReady(enrichedField),
        hasReadme: enrichedField.hasReadme,
        hasLicense: enrichedField.hasLicense,
        hasContributing: enrichedField.hasContributing,
        hasCodeOfConduct: enrichedField.hasCodeOfConduct,
        hasIssueTemplate: enrichedField.hasIssueTemplate,
        hasSecurity: enrichedField.hasSecurity,
        openPullRequests: enrichedField.openPullRequests,
        hasReleases: enrichedField.hasReleases,
        daysSinceLastRelease: enrichedField.daysSinceLastRelease
      };
    }

    return {
      fullName: item.full_name,
      language,
      description: item.description,
      stars: item.stargazers_count,
      forks: item.forks_count,
      openIssues: item.open_issues_count,
      license: item.license?.spdx_id ?? null,
      pushedAt: item.pushed_at,
      url: item.html_url,
      popularityScore: popularity,
      recencyScore: recency,
      enriched
    };
  });

  return { language, repos };
}

function summarizeLanguage(language: string, repos: LiveRepoRecord[]): LiveLanguageSummary {
  const enriched = repos.filter((r) => r.enriched);
  const mean = (values: number[]) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0);

  return {
    language,
    repoCount: repos.length,
    enrichedSampleSize: enriched.length,
    totalStars: repos.reduce((sum, r) => sum + r.stars, 0),
    totalForks: repos.reduce((sum, r) => sum + r.forks, 0),
    avgStars: Math.round(mean(repos.map((r) => r.stars))),
    avgForks: Math.round(mean(repos.map((r) => r.forks))),
    avgContributors: Math.round(mean(enriched.map((r) => r.enriched!.contributorsCount))),
    avgCommits365d: Math.round(mean(enriched.map((r) => r.enriched!.commits365d))),
    avgOpenPullRequests: Math.round(mean(enriched.map((r) => r.enriched!.openPullRequests))),
    pctWithRecentRelease: Number(
      ((enriched.filter((r) => r.enriched!.hasReleases && (r.enriched!.daysSinceLastRelease ?? Infinity) <= RECENT_RELEASE_WINDOW_DAYS).length / (enriched.length || 1)) * 100).toFixed(1)
    ),
    popularityScore: Number(mean(repos.map((r) => r.popularityScore)).toFixed(2)),
    activityScore: Number(mean(enriched.map((r) => r.enriched!.activityScore)).toFixed(2)),
    healthScore: Number(mean(enriched.map((r) => r.enriched!.healthScore)).toFixed(2)),
    overallScore: Number(mean(enriched.map((r) => r.enriched!.overallScore)).toFixed(2)),
    enterpriseReadyPct: Number(((enriched.filter((r) => r.enriched!.enterpriseReady).length / (enriched.length || 1)) * 100).toFixed(1)),
    growthSignal: Number(mean(enriched.map((r) => r.enriched!.growthSignal)).toFixed(2))
  };
}

function computeHealthIndicators(allEnriched: LiveRepoRecord[]): LiveHealthIndicator[] {
  const definitions: { indicator: string; description: string; predicate: (r: LiveRepoRecord) => boolean }[] = [
    { indicator: "License", description: "Presence of open source license", predicate: (r) => r.enriched!.hasLicense },
    { indicator: "Contributing Guidelines", description: "CONTRIBUTING.md file present", predicate: (r) => r.enriched!.hasContributing },
    { indicator: "Code of Conduct", description: "CODE_OF_CONDUCT.md file present", predicate: (r) => r.enriched!.hasCodeOfConduct },
    { indicator: "Issue Templates", description: "GitHub issue templates configured", predicate: (r) => r.enriched!.hasIssueTemplate },
    { indicator: "Security Policy", description: "SECURITY.md file present", predicate: (r) => r.enriched!.hasSecurity },
    { indicator: "Documentation", description: "README file present", predicate: (r) => r.enriched!.hasReadme }
  ];

  // Score-difference impact: mean overallScore with the indicator present minus without.
  const impacts = definitions.map(({ indicator, description, predicate }) => {
    const withIt = allEnriched.filter(predicate).map((r) => r.enriched!.overallScore);
    const withoutIt = allEnriched.filter((r) => !predicate(r)).map((r) => r.enriched!.overallScore);
    const mean = (values: number[]) => (values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0);
    const diff = withIt.length && withoutIt.length ? mean(withIt) - mean(withoutIt) : 0;
    return { indicator, description, diff: Math.max(0, diff) };
  });

  const totalDiff = impacts.reduce((sum, i) => sum + i.diff, 0) || 1;
  return impacts.map(({ indicator, description, diff }) => ({
    indicator,
    description,
    impact: Number(((diff / totalDiff) * 100).toFixed(2))
  }));
}

function secretsMatch(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

function isAuthorized(req: IncomingMessage): boolean {
  const cronSecret = process.env.CRON_SECRET;
  const refreshSecret = process.env.REFRESH_SECRET;
  const authHeader = req.headers.authorization;
  const url = new URL(req.url ?? "/", "http://localhost");
  const querySecret = url.searchParams.get("secret");

  if (cronSecret && authHeader && secretsMatch(authHeader, `Bearer ${cronSecret}`)) return true;
  if (refreshSecret && querySecret && secretsMatch(querySecret, refreshSecret)) return true;
  return false;
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  if (!isAuthorized(req)) {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: "Unauthorized" }));
    return;
  }

  if (!process.env.GITHUB_TOKEN) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: "GITHUB_TOKEN is not configured" }));
    return;
  }

  try {
    const perLanguageItems = await Promise.all(LANGUAGES.map(fetchLanguageItems));

    interface EnrichmentTask {
      language: string;
      item: SearchRepoItem;
    }
    const enrichmentTasks: EnrichmentTask[] = perLanguageItems.flatMap(({ language, items }) =>
      items.slice(0, ENRICHED_PER_LANGUAGE).map((item) => ({ language, item }))
    );

    const enrichedResults = await runWithConcurrency(enrichmentTasks, GLOBAL_ENRICH_CONCURRENCY, (task) => enrichRepo(task.item));

    let cursor = 0;
    const perLanguage = perLanguageItems.map(({ language, items }) => {
      const sampleSize = Math.min(ENRICHED_PER_LANGUAGE, items.length);
      const enrichedFields = enrichedResults.slice(cursor, cursor + sampleSize);
      cursor += sampleSize;
      return assembleLanguageRecords(language, items, enrichedFields);
    });

    const allRepos = perLanguage.flatMap((l) => l.repos);
    const languages = perLanguage.map((l) => summarizeLanguage(l.language, l.repos));

    const allEnriched = allRepos.filter((r) => r.enriched);
    const correlations = {
      activityVsOverall: buildCorrelation(
        allEnriched.map((r) => r.enriched!.activityScore),
        allEnriched.map((r) => r.enriched!.overallScore)
      ),
      popularityVsOverall: buildCorrelation(
        allEnriched.map((r) => r.popularityScore),
        allEnriched.map((r) => r.enriched!.overallScore)
      ),
      healthVsOverall: buildCorrelation(
        allEnriched.map((r) => r.enriched!.healthScore),
        allEnriched.map((r) => r.enriched!.overallScore)
      ),
      activityVsHealth: buildCorrelation(
        allEnriched.map((r) => r.enriched!.activityScore),
        allEnriched.map((r) => r.enriched!.healthScore)
      ),
      activityVsPopularity: buildCorrelation(
        allEnriched.map((r) => r.enriched!.activityScore),
        allEnriched.map((r) => r.popularityScore)
      ),
      healthVsPopularity: buildCorrelation(
        allEnriched.map((r) => r.enriched!.healthScore),
        allEnriched.map((r) => r.popularityScore)
      )
    };

    const dataset: LiveDataset = {
      generatedAt: new Date().toISOString(),
      methodology: {
        reposPerLanguage: REPOS_PER_LANGUAGE,
        enrichedPerLanguage: ENRICHED_PER_LANGUAGE,
        notes:
          "Popularity/recency are computed live across all fetched repos per language. " +
          "Activity/health/overall/growth/open-PR/release-recency scores require extra per-repo " +
          "GitHub API calls (contributors, commit windows, community profile, pulls, releases) and " +
          `are computed for the top ${ENRICHED_PER_LANGUAGE} most-starred repos per language to stay ` +
          "within API limits; language-level averages for those fields are means over that sample."
      },
      languages,
      repositories: allRepos,
      correlations,
      healthIndicators: computeHealthIndicators(allEnriched)
    };

    await putRepoContent(
      REPO_OWNER,
      REPO_NAME,
      OUTPUT_PATH,
      OUTPUT_BRANCH,
      JSON.stringify(dataset, null, 2),
      `chore(data): refresh live dataset (${dataset.generatedAt})`
    );

    // Best-effort: the trend chart is a nice-to-have, so a history-write failure
    // shouldn't turn a successful primary refresh into a 500.
    let historyUpdated = true;
    try {
      await updateHistory(languages, dataset.generatedAt);
    } catch {
      historyUpdated = false;
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(
      JSON.stringify({
        ok: true,
        generatedAt: dataset.generatedAt,
        repoCount: allRepos.length,
        enrichedCount: allEnriched.length,
        historyUpdated
      })
    );
  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }));
  }
}

function buildCorrelation(xs: number[], ys: number[]) {
  const r = Number(pearsonCorrelation(xs, ys).toFixed(3));
  return { r, rSquared: Number((r * r).toFixed(3)) };
}
