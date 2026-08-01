# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Three coupled parts:

1. **Jupyter notebooks** (`notebooks/`) — Python/pandas analysis that reads `data/raw/repositories_enriched.csv`, computes language-level metrics (popularity/activity/health/enterprise-readiness scores), and writes derived CSVs to `data/derived/` plus interactive Plotly HTML files to `public/visualizations/`. **Note:** the per-repo score columns already exist in `data/raw/repositories_enriched.csv` — the notebooks only aggregate/analyze them, they don't compute them from scratch. The formulas were reverse-engineered (see below) while building the live pipeline.
2. **A live data pipeline** (`api/refresh-repos.ts`) — a Vercel serverless function, run on a schedule via Vercel Cron (see `vercel.json`), that fetches the current top ~100 repos per language from the GitHub REST API, recomputes the same scores live, and commits the result to `public/live-dataset.json`. This is what makes the dashboard "live" — see **Live data pipeline** below before touching scoring logic.
3. **React dashboard** (`src/`) — a Vite + TypeScript + Tailwind SPA. All dashboard components read data through `useAnalysisData()` (`src/contexts/AnalysisDataContext.tsx`), which fetches `/live-dataset.json` at runtime. **There is no static-snapshot fallback.** If the fetch fails or the file doesn't exist yet (e.g. before the first cron run, or `GITHUB_TOKEN` isn't configured), `<LiveDataGate>` (wrapping `Home`/`Dashboard` in `App.tsx`) shows an explicit loading spinner or error+retry screen instead of rendering the app with stale/placeholder numbers. **Never import from `@/data/analysisData` directly in a component** — always go through `useAnalysisData()`. `src/data/analysisData.ts` is kept only as (a) the TypeScript shape those transformed types are derived from, and (b) the source of static branding metadata (language colors/icons) in `transformLiveDataset.ts` — none of its numeric data is read at runtime anymore.

`src/data/languages.ts` is dead code — nothing imports it. Don't assume it's wired to anything (an earlier version of this file incorrectly claimed `EnterpriseReadiness` used it).

The notebook pipeline (`data/derived/*.csv`) and the live JSON pipeline are separate and don't interact — the notebooks still only feed the pre-rendered Plotly HTML in `public/visualizations/` (embedded via `<iframe>` in `Visualizations3D.tsx`).

## Commands

```bash
npm install              # install deps
npm run dev               # Vite dev server at http://localhost:5173
npm run build               # tsc -b (typecheck src/) + vite build -> dist/
npm run preview               # serve the production build locally
npx tsc --noEmit           # typecheck src/ only, no build output
npm run typecheck:api        # typecheck api/ (NOT covered by `npm run build` — separate tsconfig, separate build)
```

There is no lint script and no test runner configured. `npm run build` and `npm run typecheck:api` passing clean are the only automated correctness checks in this repo — run both before considering a change done, since they check disjoint parts of the codebase (`tsconfig.json` only includes `src/`).

For the notebooks: Python env with pandas, numpy, scipy, matplotlib, seaborn, plotly, scikit-learn, jupyter/jupyterlab. Run sequentially (00 → 06) from inside `notebooks/` (relative paths `../data/...`, `../public/...`).

## Live data pipeline (`api/`)

`api/refresh-repos.ts` runs daily via Vercel Cron (`vercel.json`'s `crons`), and can also be triggered manually (`GET /api/refresh-repos?secret=$REFRESH_SECRET`). For each of the 12 languages it:
1. Fetches the top 100 repos by stars via GitHub's Search API (`api/lib/github.ts`) — cheap, one call per language.
2. Computes `popularityScore` and `recencyScore` for all 100 (only needs fields already in the search response).
3. Deep-enriches the top 25 (by stars) with contributor count, commit windows (30/90/365d), community-profile health files (readme/license/contributing/code-of-conduct/issue-template/security), open pull request count, and release recency — this is 7 extra API calls per repo, so it's capped at 25/language (300 total, `GLOBAL_ENRICH_CONCURRENCY = 12` gated *globally* across all languages, not per-language, since 12 × 7 ≈ 84 stays under GitHub's ~100 concurrent secondary rate limit) to stay within GitHub's rate limit and the function's execution time. `activityScore`/`healthScore`/`overallScore`/`growthSignal`/`openPullRequests`/`daysSinceLastRelease` only exist for this enriched subset; language-level averages for those fields (`avgOpenPullRequests`, `pctWithRecentRelease`, etc.) are means over the 25-sample, not the full 100. Open PR counts come from the REST `pulls` endpoint (Link-header counting, same trick as commits/contributors) rather than the Search API, which has its own much stricter 30 req/min secondary rate limit that hundreds of per-repo calls would blow through.
4. Writes the result to `public/live-dataset.json` via the GitHub Contents API (commits directly to `main`), which triggers a normal Vercel redeploy.
5. Best-effort appends a compact daily language-score snapshot to `public/history.json` (deduped by calendar date — a same-day re-run replaces that day's entry rather than duplicating it — and trimmed to the last 90 entries). A failure here doesn't fail the refresh (`historyUpdated: false` in the response); it's what `TrendChart.tsx` on the Overview page reads to plot score-over-time lines. `useHistory()` (`src/hooks/useHistory.ts`) fetches it independently of `AnalysisDataContext`/`LiveDataGate` with its own small loading/empty state, since a trend chart is a nice-to-have and shouldn't block the rest of the dashboard while history accumulates.

**Scoring formulas** (`api/lib/scoring.ts`) were reverse-engineered from `data/raw/repositories_enriched.csv` by solving for the exact linear weights (verified to <1e-13 error across all 1200 rows) — they are not approximations:
- `recencyScore = max(0, 100 * (1 - daysSincePush/365))`
- `popularityScore = 0.35*starsNorm + 0.35*watchersNorm + 0.30*forksNorm` (each `*Norm` is max-scaled to 0-100 within the language's fetched sample)
- `activityScore = 0.4*commits30dNorm + 0.3*contributorsNorm + 0.3*recencyScore`
- `healthScore = 20 * count(hasReadme, hasLicense, hasContributing, hasCodeOfConduct, hasIssueTemplate)` — the raw CSV's health score clearly sums five 20-point boolean flags, but only four are present as raw columns; `hasIssueTemplate` (from GitHub's community-profile endpoint) substitutes for the unrecoverable fifth.
- `overallScore = 0.4*popularityScore + 0.35*activityScore + 0.25*healthScore`

**Required Vercel environment variables** (Project Settings → Environment Variables) for the pipeline to run at all:
- `GITHUB_TOKEN` — a token with public repo read access, used both to call the GitHub API (5000 req/hr authenticated, vs 60 unauthenticated) and to commit `public/live-dataset.json` back via the Contents API (needs `contents: write` on this repo).
- `CRON_SECRET` — Vercel automatically sends `Authorization: Bearer $CRON_SECRET` on cron-triggered requests when this is set; the function checks it and rejects unauthenticated calls.
- `REFRESH_SECRET` — a separate secret for manually triggering a refresh via `?secret=...`, without exposing the cron secret.

Without `GITHUB_TOKEN` set, `/api/refresh-repos` returns 500 and `public/live-dataset.json` never gets created — since there's no static fallback, the dashboard shows the `<LiveDataGate>` error screen ("Live data unavailable") instead of the app, which is expected, not a bug. This is a deliberate product decision (no static/placeholder data, ever) — don't "fix" it by reintroducing a fallback without checking with the user first.

**Known trade-off**: persisting the dataset (and now history) as committed files rather than a database means every refresh is one or two real git commits to `main`, each triggering a full Vercel rebuild. This was a deliberate choice to avoid requiring the user to provision a KV/Blob store; revisit if commit-noise or rebuild frequency becomes a problem.

## Architecture

**Routing**: `src/App.tsx` sets up `wouter` routes — `/` (`Home.tsx`), `/dashboard` (`Dashboard.tsx`), catch-all `NotFound.tsx`. `ThemeProvider` (dark by default, switchable) and `ErrorBoundary` wrap the whole app.

**Dashboard shell**: `App.tsx` wraps both routes (`/` → `Home`, `/dashboard` → `Dashboard`) in `AnalysisDataProvider` + `LiveDataGate` (in that order) — the Gate blocks rendering of `Home`/`Dashboard` until live data is `"ready"`, showing a loading spinner or an error+retry screen otherwise. `NotFound`/`/404` are deliberately **not** wrapped in the Gate, since a broken link shouldn't be blocked behind a live-data fetch. `Dashboard.tsx` itself just holds `activeSection` state and swaps in one of the section components (`Overview`, `LanguageExplorer`, `CorrelationAnalysis`, `EnterpriseReadiness`, `RepositoryExplorer`, `Visualizations3D`, `HowToUse`) from `src/components/dashboard/`. There is no routing per section; adding a new dashboard tab means adding an entry to the `navigation` array and a `case` in `renderSection()`.

**Data flow**: `AnalysisDataContext.tsx` exposes two hooks reading the same underlying `{status: "loading" | "error" | "ready", ...}` state: `useAnalysisDataStatus()` (used only by `LiveDataGate`) and `useAnalysisData()` (used by every dashboard component). `useAnalysisData()` throws if called while status isn't `"ready"` — safe in practice because `LiveDataGate` guarantees children never mount until then, so leaf components never need their own loading/error branches for the main dataset. It returns `languageData`, `topRepositories`, `correlationData`, `segmentData`, `healthIndicators`, `generatedAt`, `totalRepoCount` — fetched from `/live-dataset.json` (shape: `src/types/liveDataset.ts`) and reshaped by `src/lib/transformLiveDataset.ts` into the type shapes originally exported by `src/data/analysisData.ts` (still the type source via `typeof`, extended with a few live-only fields like `avgOpenPullRequests`/`pctWithRecentRelease` and `openPullRequests`/`hasReleases`/`daysSinceLastRelease` that don't exist in the static file). **When you add a new field to the live dataset that a component needs, extend the intersection type in `transformLiveDataset.ts` rather than adding it to `analysisData.ts`** — that file is a fossil now, not a place to keep growing.

**Historical trends**: `useHistory()` (`src/hooks/useHistory.ts`) independently fetches `/history.json` (shape: `HistoryEntry[]` in `src/types/liveDataset.ts`) with its own loading/empty state, feeding `TrendChart.tsx` (a hand-rolled SVG line chart, no charting library) on the Overview page. This is intentionally decoupled from `AnalysisDataContext`/`LiveDataGate` — a missing or thin history file degrades gracefully to "not enough history yet" without blocking the rest of the dashboard.

`RepositoryExplorer.tsx` additionally has a per-repo "expand to fetch live stats" feature (`src/hooks/useLiveRepoStats.ts`, `src/lib/githubApi.ts`) that hits the GitHub REST API directly from the browser for real-time numbers on whichever repo a user expands — this is independent of and complements the bulk pipeline above (it's fresher but per-repo-on-demand rather than periodic-and-bulk).

**Styling**: Tailwind CSS with CSS custom properties for theme colors (`var(--bg-primary)`, `var(--text-primary)`, etc., defined in `src/index.css` and driven by `ThemeContext`). Some older components (e.g. `LanguageExplorer.tsx`) still hardcode GitHub-dark hex colors (`#161b22`, `#8b949e`, ...) instead of the theme variables — match whichever convention the file you're editing already uses rather than mixing both.

**Path alias**: `@/*` → `src/*` (configured in both `tsconfig.json` and `vite.config.ts`). `api/` does **not** have this alias — it uses relative imports (it's built separately by Vercel, not by Vite).

**Deployment**: static build (`dist/`) + serverless functions (`api/`), deployed on Vercel (`vercel.json`) — this is the actively-deployed target (see the `crons` config, which is Vercel-specific). `netlify.toml` also exists for Netlify but the live-data pipeline (`api/*.ts`, `vercel.json` crons) is Vercel-only and won't run there. `@vercel/analytics` is wired into `App.tsx`.
