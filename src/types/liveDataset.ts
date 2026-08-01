/**
 * Wire format written by api/refresh-repos.ts to public/live-dataset.json and
 * read by the dashboard at runtime. Kept as a types-only module so it can be
 * imported from both the Vite client build and the Vercel serverless
 * function build without pulling in any runtime code.
 */

export interface LiveRepoRecord {
  fullName: string;
  language: string;
  description: string | null;
  stars: number;
  forks: number;
  openIssues: number;
  license: string | null;
  pushedAt: string;
  url: string;
  popularityScore: number;
  recencyScore: number;
  enriched?: {
    contributorsCount: number;
    commits30d: number;
    commits90d: number;
    commits365d: number;
    activityScore: number;
    healthScore: number;
    overallScore: number;
    maturityScore: number;
    growthSignal: number;
    complianceScore: number;
    enterpriseReady: boolean;
    hasReadme: boolean;
    hasLicense: boolean;
    hasContributing: boolean;
    hasCodeOfConduct: boolean;
    hasIssueTemplate: boolean;
    hasSecurity: boolean;
    openPullRequests: number;
    hasReleases: boolean;
    daysSinceLastRelease: number | null;
  };
}

export interface LiveLanguageSummary {
  language: string;
  repoCount: number;
  enrichedSampleSize: number;
  totalStars: number;
  totalForks: number;
  avgStars: number;
  avgForks: number;
  avgContributors: number;
  avgCommits365d: number;
  avgOpenPullRequests: number;
  pctWithRecentRelease: number;
  popularityScore: number;
  activityScore: number;
  healthScore: number;
  overallScore: number;
  enterpriseReadyPct: number;
  growthSignal: number;
}

export interface LiveScoreCorrelation {
  r: number;
  rSquared: number;
}

export interface LiveCorrelations {
  activityVsOverall: LiveScoreCorrelation;
  popularityVsOverall: LiveScoreCorrelation;
  healthVsOverall: LiveScoreCorrelation;
  activityVsHealth: LiveScoreCorrelation;
  activityVsPopularity: LiveScoreCorrelation;
  healthVsPopularity: LiveScoreCorrelation;
}

export interface LiveHealthIndicator {
  indicator: string;
  impact: number;
  description: string;
}

export interface LiveDataset {
  generatedAt: string;
  methodology: {
    reposPerLanguage: number;
    enrichedPerLanguage: number;
    notes: string;
  };
  languages: LiveLanguageSummary[];
  repositories: LiveRepoRecord[];
  correlations: LiveCorrelations;
  healthIndicators: LiveHealthIndicator[];
}

/**
 * Wire format for public/history.json — a bounded rolling window of daily
 * language-score snapshots, appended to (not overwritten) by each refresh so
 * the dashboard can show trend lines. One entry per calendar day; a same-day
 * re-run replaces that day's entry rather than duplicating it.
 */
export interface HistoryLanguageEntry {
  language: string;
  overallScore: number;
  popularityScore: number;
  activityScore: number;
  healthScore: number;
}

export interface HistoryEntry {
  date: string;
  generatedAt: string;
  languages: HistoryLanguageEntry[];
}

export type LiveHistory = HistoryEntry[];
