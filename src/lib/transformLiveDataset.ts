import type { LiveDataset } from "@/types/liveDataset";
import { languageData as staticLanguageData, topRepositories as staticTopRepositories, correlationData as staticCorrelationData, segmentData as staticSegmentData, healthIndicators as staticHealthIndicators } from "@/data/analysisData";

type LanguageData = typeof staticLanguageData[number];
type Repository = (typeof staticTopRepositories)[number];
type Segment = (typeof staticSegmentData)[number];
type HealthIndicator = (typeof staticHealthIndicators)[number];

// Branding is cosmetic and not derivable from the GitHub API, so it stays static.
const LANGUAGE_META: Record<string, { color: string; icon: string }> = Object.fromEntries(
  staticLanguageData.map((lang) => [lang.name, { color: lang.color, icon: lang.icon }])
);

const SEGMENT_DEFINITIONS: { segment: string; languages: string[] }[] = staticSegmentData.map((s) => ({
  segment: s.segment,
  languages: s.languages
}));

export interface TransformedAnalysisData {
  languageData: LanguageData[];
  topRepositories: Repository[];
  correlationData: typeof staticCorrelationData;
  segmentData: Segment[];
  healthIndicators: HealthIndicator[];
}

export function transformLiveDataset(dataset: LiveDataset): TransformedAnalysisData {
  const languageData: LanguageData[] = dataset.languages.map((l) => {
    const meta = LANGUAGE_META[l.language] ?? { color: "#8b949e", icon: "🔤" };
    return {
      name: l.language,
      overallScore: l.overallScore,
      popularityScore: l.popularityScore,
      activityScore: l.activityScore,
      healthScore: l.healthScore,
      avgStars: l.avgStars,
      avgForks: l.avgForks,
      avgContributors: l.avgContributors,
      avgCommits: l.avgCommits365d,
      enterpriseReadiness: Math.round(l.enterpriseReadyPct),
      growthSignal: l.growthSignal,
      color: meta.color,
      icon: meta.icon
    };
  });

  const topRepositories: Repository[] = dataset.repositories
    .filter((r): r is typeof r & { enriched: NonNullable<typeof r.enriched> } => Boolean(r.enriched))
    .map((r) => ({
      name: r.fullName,
      language: r.language,
      stars: r.stars,
      forks: r.forks,
      contributors: r.enriched.contributorsCount,
      growth: r.enriched.growthSignal
    }));

  const segmentData: Segment[] = SEGMENT_DEFINITIONS.map(({ segment, languages }) => {
    const members = languageData.filter((l) => languages.includes(l.name));
    const avgScore = members.length ? members.reduce((sum, l) => sum + l.overallScore, 0) / members.length : 0;
    const repos = dataset.languages.filter((l) => languages.includes(l.language)).reduce((sum, l) => sum + l.repoCount, 0);
    return { segment, languages, avgScore: Number(avgScore.toFixed(2)), repos };
  });

  return {
    languageData,
    topRepositories,
    correlationData: dataset.correlations,
    segmentData,
    healthIndicators: dataset.healthIndicators
  };
}
