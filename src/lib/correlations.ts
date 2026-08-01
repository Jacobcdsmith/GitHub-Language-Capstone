import type { LiveCorrelations } from "@/types/liveDataset";

export interface RankedCorrelation {
  label: "Activity" | "Popularity" | "Health";
  r: number;
}

/** Ranks the three overall-score correlations strongest-to-weakest by |r| direction (descending r). */
export function rankCorrelations(correlationData: Pick<LiveCorrelations, "activityVsOverall" | "popularityVsOverall" | "healthVsOverall">): RankedCorrelation[] {
  const ranked: RankedCorrelation[] = [
    { label: "Activity", r: correlationData.activityVsOverall.r },
    { label: "Popularity", r: correlationData.popularityVsOverall.r },
    { label: "Health", r: correlationData.healthVsOverall.r }
  ];
  return ranked.sort((a, b) => b.r - a.r);
}
