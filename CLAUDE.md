# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Two coupled parts that share a one-way data pipeline:

1. **Jupyter notebooks** (`notebooks/`) — Python/pandas analysis that reads `data/raw/repositories_enriched.csv`, computes language-level metrics (popularity/activity/health/enterprise-readiness scores), and writes derived CSVs to `data/derived/` plus interactive Plotly HTML files to `public/visualizations/`.
2. **React dashboard** (`src/`) — a Vite + TypeScript + Tailwind SPA that presents this analysis. **Important:** despite what the README/`.github/copilot-instructions.md` describe, the dashboard does **not** currently import the derived CSVs at runtime. All figures shown in the UI (`src/data/analysisData.ts`, `src/data/languages.ts`) are hand-copied static snapshots of what the notebooks produced. The only place CSVs/HTML from the pipeline are actually consumed is via `<iframe>` embeds of the pre-rendered Plotly HTML files in `public/visualizations/` (see `Visualizations3D.tsx`).

Treat the notebook pipeline and the dashboard's static data files as decoupled: regenerating `data/derived/*.csv` does **not** automatically flow into the UI. Updating a metric shown in the dashboard means manually editing the corresponding constant in `src/data/analysisData.ts` or `src/data/languages.ts`.

## Commands

```bash
npm install          # install deps
npm run dev           # Vite dev server at http://localhost:5173
npm run build          # tsc -b (typecheck) + vite build -> dist/
npm run preview          # serve the production build locally
npx tsc --noEmit       # typecheck only, no build output
```

There is no lint script and no test runner configured (no ESLint/Vitest/Jest in `package.json`). `npm run build` running clean (TypeScript strict mode, `tsc -b`) is the only automated correctness check in this repo — always run it before considering frontend work done.

For the notebooks: they require a Python env with pandas, numpy, scipy, matplotlib, seaborn, plotly, scikit-learn, jupyter/jupyterlab. They must be run sequentially (00 → 06) from inside `notebooks/` since each one loads outputs from the previous and uses relative paths (`../data/...`, `../public/...`). `05_calculated_fields_and_derived_tables.ipynb` covers feature engineering into `data/derived/`; `06_calculation_documentation.ipynb` documents the engineered fields — it does not produce new data.

## Architecture

**Routing**: `src/App.tsx` sets up `wouter` routes — `/` (`Home.tsx`), `/dashboard` (`Dashboard.tsx`), catch-all `NotFound.tsx`. `ThemeProvider` (dark by default, switchable) and `ErrorBoundary` wrap the whole app.

**Dashboard shell**: `src/pages/Dashboard.tsx` is a single-page app-within-the-app — it holds `activeSection` state and swaps in one of the section components (`Overview`, `LanguageExplorer`, `CorrelationAnalysis`, `EnterpriseReadiness`, `RepositoryExplorer`, `Visualizations3D`, `HowToUse`) from `src/components/dashboard/`. There is no routing per section; adding a new dashboard tab means adding an entry to the `navigation` array and a `case` in `renderSection()`.

**Data sources** (`src/data/`):
- `analysisData.ts` — `languageData` (per-language scores/metrics), `topRepositories` (curated flagship repos per language, `name` is `"owner/repo"`), `correlationData`, `segmentData`, `healthIndicators`. Consumed by `LanguageExplorer`, `RepositoryExplorer`, `CorrelationAnalysis`, `Overview`.
- `languages.ts` — a second, overlapping `languagesData` shape (different field names/values than `analysisData.ts`'s `languageData`) used by `EnterpriseReadiness`/other components. These two files are **not** kept in sync automatically — when updating a language's numbers, check whether both files need the edit.

**Styling**: Tailwind CSS with CSS custom properties for theme colors (`var(--bg-primary)`, `var(--text-primary)`, etc., defined in `src/index.css` and driven by `ThemeContext`). Some older components (e.g. `LanguageExplorer.tsx`) still hardcode GitHub-dark hex colors (`#161b22`, `#8b949e`, ...) instead of the theme variables — match whichever convention the file you're editing already uses rather than mixing both.

**Path alias**: `@/*` → `src/*` (configured in both `tsconfig.json` and `vite.config.ts`).

**Deployment**: static build (`dist/`) deployable to either Netlify (`netlify.toml`, Node 18) or Vercel (`vercel.json`); `@vercel/analytics` is wired into `App.tsx` regardless of which platform serves it.
