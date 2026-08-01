import { useEffect, useState } from "react";
import type { LiveHistory } from "@/types/liveDataset";

interface UseHistoryResult {
  history: LiveHistory | null;
  loading: boolean;
  error: string | null;
}

/**
 * Independent of AnalysisDataContext/LiveDataGate on purpose: the trend chart
 * is a nice-to-have, not core dashboard content, so it gets its own small
 * loading/error UI instead of blocking the whole app if history.json isn't
 * available yet (e.g. the pipeline hasn't accumulated multiple days of data).
 */
export function useHistory(): UseHistoryResult {
  const [history, setHistory] = useState<LiveHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch("/history.json", { cache: "no-store" })
      .then((res) => {
        if (!res.ok) throw new Error(`status ${res.status}`);
        const contentType = res.headers.get("content-type") ?? "";
        if (!contentType.includes("application/json")) throw new Error("History not published yet");
        return res.json() as Promise<LiveHistory>;
      })
      .then((data) => {
        if (cancelled) return;
        setHistory(Array.isArray(data) ? data : []);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load history");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { history, loading, error };
}
