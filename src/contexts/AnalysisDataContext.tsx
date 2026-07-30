import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { LiveDataset } from "@/types/liveDataset";
import { transformLiveDataset, type TransformedAnalysisData } from "@/lib/transformLiveDataset";
import { languageData, topRepositories, correlationData, segmentData, healthIndicators } from "@/data/analysisData";

const STATIC_DATA: TransformedAnalysisData = { languageData, topRepositories, correlationData, segmentData, healthIndicators };

interface AnalysisDataValue extends TransformedAnalysisData {
  isLive: boolean;
  generatedAt: string | null;
  totalRepoCount: number;
}

const AnalysisDataContext = createContext<AnalysisDataValue>({
  ...STATIC_DATA,
  isLive: false,
  generatedAt: null,
  totalRepoCount: 1200
});

export function AnalysisDataProvider({ children }: { children: ReactNode }) {
  const [value, setValue] = useState<AnalysisDataValue>({
    ...STATIC_DATA,
    isLive: false,
    generatedAt: null,
    totalRepoCount: 1200
  });

  useEffect(() => {
    let cancelled = false;

    fetch("/live-dataset.json", { cache: "no-store" })
      .then((res) => (res.ok ? (res.json() as Promise<LiveDataset>) : Promise.reject(new Error(`status ${res.status}`))))
      .then((dataset) => {
        if (cancelled) return;
        const transformed = transformLiveDataset(dataset);
        setValue({
          ...transformed,
          isLive: true,
          generatedAt: dataset.generatedAt,
          totalRepoCount: dataset.repositories.length
        });
      })
      .catch(() => {
        // No live dataset yet (first deploy before the refresh job has run) or fetch failed.
        // Falling back to the static snapshot keeps this identical to pre-live-data behavior.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return <AnalysisDataContext.Provider value={value}>{children}</AnalysisDataContext.Provider>;
}

export function useAnalysisData(): AnalysisDataValue {
  return useContext(AnalysisDataContext);
}
