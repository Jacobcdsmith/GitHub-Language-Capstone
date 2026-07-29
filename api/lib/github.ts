const GITHUB_API = "https://api.github.com";

function authHeaders(): Record<string, string> {
  const token = process.env.GITHUB_TOKEN;
  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

async function githubFetch(url: string, attempt = 0): Promise<Response> {
  const res = await fetch(url, { headers: authHeaders() });
  if ((res.status === 403 || res.status === 429) && attempt < 3) {
    const retryAfter = Number(res.headers.get("retry-after")) || 2 ** attempt * 1.5;
    await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
    return githubFetch(url, attempt + 1);
  }
  return res;
}

/** Reads the total-count approximation off a paginated endpoint's Link header, using per_page=1. */
async function countViaLinkHeader(url: string): Promise<number> {
  const res = await githubFetch(`${url}${url.includes("?") ? "&" : "?"}per_page=1`);
  if (!res.ok) return 0;
  const link = res.headers.get("link");
  if (!link) {
    const body = (await res.json()) as unknown[];
    return Array.isArray(body) ? body.length : 0;
  }
  const lastMatch = link.match(/[?&]page=(\d+)>;\s*rel="last"/);
  return lastMatch ? Number(lastMatch[1]) : 1;
}

export interface SearchRepoItem {
  full_name: string;
  name: string;
  owner: { login: string };
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  open_issues_count: number;
  license: { spdx_id: string; name: string } | null;
  pushed_at: string;
  html_url: string;
}

export async function searchTopReposByLanguage(language: string, perPage = 100): Promise<SearchRepoItem[]> {
  const q = encodeURIComponent(`language:${language}`);
  const url = `${GITHUB_API}/search/repositories?q=${q}&sort=stars&order=desc&per_page=${perPage}`;
  const res = await githubFetch(url);
  if (!res.ok) {
    throw new Error(`GitHub search failed for language=${language}: ${res.status}`);
  }
  const json = (await res.json()) as { items: SearchRepoItem[] };
  return json.items;
}

export interface CommunityProfile {
  hasReadme: boolean;
  hasLicense: boolean;
  hasContributing: boolean;
  hasCodeOfConduct: boolean;
  hasIssueTemplate: boolean;
  hasSecurity: boolean;
}

export async function getCommunityProfile(owner: string, repo: string): Promise<CommunityProfile> {
  const res = await githubFetch(`${GITHUB_API}/repos/${owner}/${repo}/community/profile`);
  if (!res.ok) {
    return { hasReadme: false, hasLicense: false, hasContributing: false, hasCodeOfConduct: false, hasIssueTemplate: false, hasSecurity: false };
  }
  const json = (await res.json()) as { files?: Record<string, unknown> };
  const files = json.files ?? {};
  return {
    hasReadme: Boolean(files.readme),
    hasLicense: Boolean(files.license),
    hasContributing: Boolean(files.contributing),
    hasCodeOfConduct: Boolean(files.code_of_conduct),
    hasIssueTemplate: Boolean(files.issue_template),
    hasSecurity: Boolean(files.security)
  };
}

export async function getContributorsCount(owner: string, repo: string): Promise<number> {
  return countViaLinkHeader(`${GITHUB_API}/repos/${owner}/${repo}/contributors?anon=true`);
}

export async function getCommitsCountSince(owner: string, repo: string, sinceDaysAgo: number): Promise<number> {
  const since = new Date(Date.now() - sinceDaysAgo * 24 * 60 * 60 * 1000).toISOString();
  return countViaLinkHeader(`${GITHUB_API}/repos/${owner}/${repo}/commits?since=${since}`);
}

/** Runs async tasks with bounded concurrency to stay well under GitHub's secondary rate limits. */
export async function runWithConcurrency<T, R>(items: T[], concurrency: number, worker: (item: T, index: number) => Promise<R>): Promise<R[]> {
  const results: R[] = new Array(items.length);
  let cursor = 0;

  async function runNext(): Promise<void> {
    const index = cursor++;
    if (index >= items.length) return;
    results[index] = await worker(items[index], index);
    return runNext();
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => runNext()));
  return results;
}

export async function getRepoContentSha(owner: string, repo: string, path: string, branch: string): Promise<string | undefined> {
  const res = await githubFetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`);
  if (!res.ok) return undefined;
  const json = (await res.json()) as { sha?: string };
  return json.sha;
}

export async function putRepoContent(owner: string, repo: string, path: string, branch: string, content: string, message: string): Promise<void> {
  const sha = await getRepoContentSha(owner, repo, path, branch);
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
    method: "PUT",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf-8").toString("base64"),
      branch,
      sha
    })
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to write ${path}: ${res.status} ${text}`);
  }
}
