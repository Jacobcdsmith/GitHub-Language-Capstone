/**
 * @deprecated This file is not actively used by the application.
 * Please use src/data/analysisData.ts instead for all data needs.
 * This file is maintained for backward compatibility and reference only.
 * 
 * Key differences from analysisData.ts:
 * - Different popularity score normalization (0-30 vs 0-100)
 * - Missing fields: avgForks, avgCommits, enterpriseReadiness, growthSignal
 * - Additional fields: totalStars, totalForks, rank
 */

export interface LanguageData {
  name: string;
  icon: string;
  color: string;
  overallScore: number;
  popularityScore: number;
  activityScore: number;
  healthScore: number;
  totalStars: number;
  totalForks: number;
  avgStars: number;
  avgContributors: number;
  rank: number;
}

export const languagesData: LanguageData[] = [
  {
    name: "Rust",
    icon: "🦀",
    color: "#CE422B",
    overallScore: 49.4,
    popularityScore: 27.1,
    activityScore: 61.6,
    healthScore: 68.0,
    totalStars: 3500000,
    totalForks: 580000,
    avgStars: 34618,
    avgContributors: 258,
    rank: 1
  },
  {
    name: "TypeScript",
    icon: "📘",
    color: "#3178C6",
    overallScore: 48.3,
    popularityScore: 24.8,
    activityScore: 69.4,
    healthScore: 70.4,
    totalStars: 6900000,
    totalForks: 1100000,
    avgStars: 68602,
    avgContributors: 311,
    rank: 2
  },
  {
    name: "Go",
    icon: "🐹",
    color: "#00ADD8",
    overallScore: 46.9,
    popularityScore: 23.0,
    activityScore: 58.9,
    healthScore: 68.4,
    totalStars: 4200000,
    totalForks: 720000,
    avgStars: 41850,
    avgContributors: 198,
    rank: 3
  },
  {
    name: "C++",
    icon: "⚙️",
    color: "#00599C",
    overallScore: 44.1,
    popularityScore: 21.5,
    activityScore: 54.2,
    healthScore: 71.8,
    totalStars: 3800000,
    totalForks: 650000,
    avgStars: 37920,
    avgContributors: 176,
    rank: 4
  },
  {
    name: "Python",
    icon: "🐍",
    color: "#3776AB",
    overallScore: 43.5,
    popularityScore: 28.4,
    activityScore: 52.1,
    healthScore: 65.2,
    totalStars: 7800000,
    totalForks: 1300000,
    avgStars: 78107,
    avgContributors: 215,
    rank: 5
  },
  {
    name: "JavaScript",
    icon: "💛",
    color: "#F7DF1E",
    overallScore: 40.2,
    popularityScore: 22.8,
    activityScore: 48.6,
    healthScore: 70.8,
    totalStars: 5600000,
    totalForks: 950000,
    avgStars: 55840,
    avgContributors: 189,
    rank: 6
  },
  {
    name: "Java",
    icon: "☕",
    color: "#007396",
    overallScore: 39.8,
    popularityScore: 20.2,
    activityScore: 47.3,
    healthScore: 66.5,
    totalStars: 4100000,
    totalForks: 710000,
    avgStars: 40650,
    avgContributors: 165,
    rank: 7
  },
  {
    name: "Swift",
    icon: "🍎",
    color: "#FA7343",
    overallScore: 37.4,
    popularityScore: 26.6,
    activityScore: 29.1,
    healthScore: 64.8,
    totalStars: 3200000,
    totalForks: 520000,
    avgStars: 31840,
    avgContributors: 142,
    rank: 8
  },
  {
    name: "C#",
    icon: "🎯",
    color: "#239120",
    overallScore: 36.8,
    popularityScore: 19.8,
    activityScore: 42.5,
    healthScore: 62.3,
    totalStars: 3600000,
    totalForks: 610000,
    avgStars: 35920,
    avgContributors: 156,
    rank: 9
  },
  {
    name: "Kotlin",
    icon: "🔷",
    color: "#7F52FF",
    overallScore: 35.2,
    popularityScore: 18.5,
    activityScore: 36.6,
    healthScore: 61.7,
    totalStars: 2900000,
    totalForks: 480000,
    avgStars: 28750,
    avgContributors: 134,
    rank: 10
  },
  {
    name: "PHP",
    icon: "🐘",
    color: "#777BB4",
    overallScore: 33.1,
    popularityScore: 17.2,
    activityScore: 34.8,
    healthScore: 58.9,
    totalStars: 2600000,
    totalForks: 450000,
    avgStars: 25840,
    avgContributors: 128,
    rank: 11
  },
  {
    name: "Ruby",
    icon: "💎",
    color: "#CC342D",
    overallScore: 32.8,
    popularityScore: 16.8,
    activityScore: 33.2,
    healthScore: 59.4,
    totalStars: 2500000,
    totalForks: 420000,
    avgStars: 24920,
    avgContributors: 121,
    rank: 12
  }
];

export const getLanguageByName = (name: string): LanguageData | undefined => {
  return languagesData.find(lang => lang.name.toLowerCase() === name.toLowerCase());
};

export const getTopLanguages = (count: number = 5): LanguageData[] => {
  return languagesData.slice(0, count);
};

export const getTotalStats = () => {
  return {
    totalRepos: 1200,
    totalStars: languagesData.reduce((sum, lang) => sum + lang.totalStars, 0),
    totalForks: languagesData.reduce((sum, lang) => sum + lang.totalForks, 0),
    languagesCount: languagesData.length
  };
};

