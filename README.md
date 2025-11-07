# GitHub Language Analysis Platform

Data analysis + interactive visualization platform for GitHub language statistics. It combines reproducible Jupyter notebooks with a modern Vite + React dashboard.

## Overview
- Notebooks live under `notebooks/` and read from `data/raw/`, writing outputs to `data/derived/` and `public/visualizations/`.
- The React dashboard (in `src/`) loads derived `.csv` files and embeds Plotly-generated HTML visualizations.
- Run notebooks in order (00 → 06) to regenerate data and visuals consumed by the app.

## Project Structure
```
GitHub-Language-Capstone/
├─ notebooks/
│  ├─ 00_master_index.ipynb
│  ├─ 01_data_exploration.ipynb
│  ├─ 02_language_comparison.ipynb
│  ├─ 03_correlation_analysis.ipynb
│  ├─ 04_advanced_visualizations.ipynb
│  ├─ 04a_3d_visualizations.ipynb
│  └─ 05_calculated_fields_and_derived_tables.ipynb
├─ data/
│  ├─ raw/
│  │  └─ repositories_enriched.csv
│  └─ derived/
│     ├─ language_comparison_summary.csv
│     ├─ segment_summary.csv
│     └─ top_growth_repos.csv
├─ public/
│  └─ visualizations/
│     ├─ language_hierarchy_sunburst.html
│     ├─ treemap_top_repos.html
│     ├─ parallel_coordinates_top100.html
│     ├─ enhanced_3d_language_analysis.html
│     └─ animated_language_evolution.html
├─ src/
│  ├─ pages/Dashboard.tsx
│  ├─ components/
│  └─ data/
│     ├─ analysisData.ts
│     └─ languages.ts
├─ package.json
└─ README.md
```

## Data Flow
1. Input dataset: `data/raw/repositories_enriched.csv`.
2. Notebooks produce:
     - Derived CSVs in `data/derived/` (e.g., `language_comparison_summary.csv`, `segment_summary.csv`, `top_growth_repos.csv`).
     - Interactive HTML visuals in `public/visualizations/` (e.g., sunburst, treemap, 3D plots).
3. The React app imports derived CSVs and embeds the HTML files via iframes.

## Setup (Windows PowerShell)

### Python environment (for notebooks)
Recommended: conda env with Python 3.10–3.11.

```powershell
# Create and activate an environment
conda create -n gh-lang python=3.11 -y
conda activate gh-lang

# Install core packages
pip install pandas numpy scipy matplotlib seaborn plotly scikit-learn jupyter jupyterlab
```

### Node.js (for React dashboard)
```powershell
npm install
npm run dev
```
Open http://localhost:5173

## Notebook Workflow
Run in order; each relies on previous outputs.

1.  `00_master_index.ipynb` — Project hub, scope, scoring methodology, run-order guidance.
2.  `01_data_exploration.ipynb` — Load `../data/raw/repositories_enriched.csv`, profiling and data quality.
3.  `02_language_comparison.ipynb` — Rankings, ANOVA, radar charts; exports `../data/derived/language_comparison_summary.csv`.
4.  `03_correlation_analysis.ipynb` — Global and per-language correlations; consumes raw/derived data and prints insights.
5.  `04_advanced_visualizations.ipynb` — Plotly visuals to `../public/visualizations/`.
6.  `04a_3d_visualizations.ipynb` — Advanced 3D/animated visuals to `../public/visualizations/`.
7.  `05_calculated_fields_and_derived_tables.ipynb` — Feature engineering + derived tables in `../data/derived/`.
8.  `06_calculation_documentation.ipynb` — Data dictionary for engineered fields.

Tip: All paths assume the notebook CWD is `notebooks/`. Use relative paths like `../data/raw/...` and `../public/visualizations/...`.

## Regenerating Derived Data
1. Ensure `data/raw/repositories_enriched.csv` exists.
2. Run notebooks 01 → 05 to refresh derived CSVs and visuals.
3. Confirm outputs:
     - CSVs in `data/derived/` (consumed by charts and components).
     - HTML files in `public/visualizations/` (embedded in the dashboard).

## Running the Dashboard
```powershell
npm install
npm run dev
```
Then open http://localhost:5173. The dashboard reads from `data/derived/` and embeds visuals from `public/visualizations/`.

Build/preview:
```powershell
npm run build
npm run preview
```

## Key Visualizations
- 3D/scatter + animated timelines (Plotly) for multi-dimensional trends.
- Treemaps & sunbursts for hierarchy exploration.
- Radar charts for language strengths/weaknesses.
- Correlation heatmaps for metric relationships.

## Recent Updates
- Directory reorg: notebooks moved to `notebooks/`; data split into `data/raw` and `data/derived`; visuals centralized in `public/visualizations/`.
- Enterprise Readiness scoring adjusted: from “all-governance-required” to averaged compliance for realistic rates.
- Notebooks updated to new paths; exports standardized.

## Troubleshooting
- File not found in notebooks:
    - Verify notebook is running from `notebooks/` and paths use `../data/...` and `../public/...`.
- Missing numeric columns for correlation:
    - Confirm the chosen dataset contains numeric fields; ensure preprocessing cells ran.
- Frontend shows empty charts:
    - Ensure derived CSVs exist in `data/derived/` and visuals exist in `public/visualizations/`. Re-run the relevant notebooks.
- Port conflicts on dev server:
    - Set an alternate port: `set PORT=5174` then `npm run dev`.

## Notes
- Primary dataset: `data/raw/repositories_enriched.csv`.
- Core derived files: `data/derived/language_comparison_summary.csv`, `data/derived/segment_summary.csv`, `data/derived/top_growth_repos.csv`.
- Visuals embedded from `public/visualizations/`.

