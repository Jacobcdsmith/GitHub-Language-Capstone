import { useEffect, useState } from "react";
import { fetchLiveRepoStats, GithubApiError, invalidateRepoCache, type LiveRepoStats } from "@/lib/githubApi";

interface UseLiveRepoStatsResult {
  data: LiveRepoStats | null;
  loading: boolean;
  error: string | null;
  rateLimited: boolean;
  refetch: () => void;
}

/**
 * Lazily fetches live stats for a single repo from the GitHub REST API.
 * Pass `null` to skip fetching (e.g. while a row is collapsed) so we only
 * spend requests against the unauthenticated rate limit when needed.
 */
export function useLiveRepoStats(fullName: string | null): UseLiveRepoStatsResult {
  const [data, setData] = useState<LiveRepoStats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rateLimited, setRateLimited] = useState(false);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    if (!fullName) {
      setData(null);
      setError(null);
      setRateLimited(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setRateLimited(false);

    fetchLiveRepoStats(fullName)
      .then((stats) => {
        if (!cancelled) setData(stats);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to fetch live data");
        setRateLimited(err instanceof GithubApiError && err.rateLimited);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [fullName, nonce]);

  const refetch = () => {
    if (fullName) invalidateRepoCache(fullName);
    setNonce((n) => n + 1);
  };

  return { data, loading, error, rateLimited, refetch };
}
