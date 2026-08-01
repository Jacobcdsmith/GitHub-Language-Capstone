import { useEffect, useState } from "react";
import type { HistoryEntry, LiveHistory } from "@/types/liveDataset";

interface UseHistoryResult {
  history: LiveHistory | null;
  loading: boolean;
  error: string | null;
}

function isValidHistoryEntry(entry: unknown): entry is HistoryEntry {
  if (typeof entry !== "object" || entry === null) return false;
  const e = entry as Record<string, unknown>;
  if (typeof e.date !== "string" || typeof e.generatedAt !== "string") return false;
  if (!Array.isArray(e.languages)) return false;
  return e.languages.every((l) => {
    if (typeof l !== "object" || l === null) return false;
    const lang = l as Record<string, unknown>;
    return (
      typeof lang.language === "string" &&
      typeof lang.overallScore === "number" &&
      typeof lang.popularityScore === "number" &&
      typeof lang.activityScore === "number" &&
      typeof lang.healthScore === "number"
    );
  });
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
        if (!Array.isArray(data) || !data.every(isValidHistoryEntry)) {
          throw new Error("History data is malformed");
        }
        setHistory(data);
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
