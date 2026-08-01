import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import type { LiveDataset } from "@/types/liveDataset";
import { transformLiveDataset, type TransformedAnalysisData } from "@/lib/transformLiveDataset";

type AnalysisDataState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ready"; data: TransformedAnalysisData; generatedAt: string; totalRepoCount: number };

interface AnalysisDataContextValue {
  state: AnalysisDataState;
  retry: () => void;
}

const AnalysisDataContext = createContext<AnalysisDataContextValue | null>(null);

const FETCH_TIMEOUT_MS = 15000;

async function fetchLiveDataset(): Promise<LiveDataset> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
  let res: Response;
  try {
    res = await fetch("/live-dataset.json", { cache: "no-store", signal: controller.signal });
  } catch (error) {
    throw new Error(error instanceof DOMException && error.name === "AbortError" ? "Live data request timed out." : "Live data request failed.");
  } finally {
    clearTimeout(timeoutId);
  }
  if (!res.ok) {
    throw new Error(`Live data request failed (status ${res.status}).`);
  }
  // Before the first successful refresh, the file doesn't exist yet — the SPA's
  // catch-all rewrite serves index.html with a 200 status instead of a real 404,
  // so a content-type check (not res.ok) is what actually catches this case.
  const contentType = res.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    throw new Error("The live data pipeline hasn't published a dataset yet.");
  }
  let dataset: LiveDataset;
  try {
    dataset = (await res.json()) as LiveDataset;
  } catch {
    throw new Error("The live data pipeline returned an unreadable response.");
  }
  if (!Array.isArray(dataset.languages) || dataset.languages.length === 0) {
    throw new Error("The live dataset has no language data yet.");
  }
  return dataset;
}

/**
 * Single source of truth for live analysis data. There is no static-snapshot
 * fallback: if the live dataset can't be fetched, callers see an explicit
 * error state (via useAnalysisDataStatus / LiveDataGate) rather than stale
 * placeholder numbers.
 */
export function AnalysisDataProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AnalysisDataState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setState({ status: "loading" });

    fetchLiveDataset()
      .then((dataset) => {
        if (cancelled) return;
        setState({
          status: "ready",
          data: transformLiveDataset(dataset),
          generatedAt: dataset.generatedAt,
          totalRepoCount: dataset.repositories.length
        });
      })
      .catch((error: unknown) => {
        if (cancelled) return;
        setState({ status: "error", message: error instanceof Error ? error.message : "Failed to load live data." });
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return <AnalysisDataContext.Provider value={{ state, retry }}>{children}</AnalysisDataContext.Provider>;
}

function useAnalysisDataContext(): AnalysisDataContextValue {
  const ctx = useContext(AnalysisDataContext);
  if (!ctx) throw new Error("useAnalysisData(Status) must be used within an AnalysisDataProvider");
  return ctx;
}

/** For the loading/error gate — never throws regardless of state. */
export function useAnalysisDataStatus(): { status: AnalysisDataState["status"]; error: string | null; retry: () => void } {
  const { state, retry } = useAnalysisDataContext();
  return { status: state.status, error: state.status === "error" ? state.message : null, retry };
}

/**
 * For dashboard content. Only ever called once <LiveDataGate> has confirmed
 * status is "ready", so this never has to handle loading/error itself.
 */
export function useAnalysisData(): TransformedAnalysisData & { generatedAt: string; totalRepoCount: number } {
  const { state } = useAnalysisDataContext();
  if (state.status !== "ready") {
    throw new Error("useAnalysisData() called before live data was ready — render this tree inside <LiveDataGate>.");
  }
  return { ...state.data, generatedAt: state.generatedAt, totalRepoCount: state.totalRepoCount };
}
