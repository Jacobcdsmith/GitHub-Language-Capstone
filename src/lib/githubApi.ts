export interface LiveRepoStats {
  stars: number;
  forks: number;
  openIssues: number;
  watchers: number;
  updatedAt: string;
}

export class GithubApiError extends Error {
  rateLimited: boolean;

  constructor(message: string, rateLimited = false) {
    super(message);
    this.name = "GithubApiError";
    this.rateLimited = rateLimited;
  }
}

const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { data: LiveRepoStats; fetchedAt: number }>();

export function invalidateRepoCache(fullName: string): void {
  cache.delete(fullName);
}

export async function fetchLiveRepoStats(fullName: string): Promise<LiveRepoStats> {
  const cached = cache.get(fullName);
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.data;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  let response: Response;
  try {
    response = await fetch(`https://api.github.com/repos/${fullName}`, {
      headers: { Accept: "application/vnd.github+json" },
      signal: controller.signal
    });
  } catch (error) {
    throw error instanceof Error && error.name === "AbortError" ? new GithubApiError("GitHub API request timed out") : error;
  } finally {
    clearTimeout(timeoutId);
  }

  if (!response.ok) {
    const rateLimited = response.status === 403 || response.status === 429;
    throw new GithubApiError(
      rateLimited ? "GitHub API rate limit exceeded" : `GitHub API error (${response.status})`,
      rateLimited
    );
  }

  const json = await response.json();
  const data: LiveRepoStats = {
    stars: json.stargazers_count,
    forks: json.forks_count,
    openIssues: json.open_issues_count,
    watchers: json.subscribers_count,
    updatedAt: json.updated_at
  };

  cache.set(fullName, { data, fetchedAt: Date.now() });
  return data;
}
