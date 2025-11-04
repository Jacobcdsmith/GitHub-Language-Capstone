# GitHub Language Analysis - Copilot Instructions

This project is a data analysis and visualization platform for GitHub language statistics, composed of two main parts: a series of Jupyter Notebooks for data analysis and a React-based interactive dashboard.

## Project Overview

*   **Jupyter Notebooks (`*.ipynb`):** These are used for data exploration, analysis, and generating visualizations. The workflow starts with `00_master_index.ipynb` and proceeds sequentially. The primary dataset is `repositories_enriched.csv`.
*   **React Frontend (`src/**/*.tsx`):** A web application that provides an interactive dashboard to visualize the data from the notebooks. The main component is `Dashboard.tsx`, which orchestrates the different views.

## Technology Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling and development server
- **Tailwind CSS** for styling
- **Wouter** for routing
- **Lucide React** for icons
- **Sonner** for toast notifications

### Data Analysis
- **Python 3** with Jupyter Notebooks
- **pandas** for data manipulation
- **plotly** for interactive visualizations
- **seaborn** and **matplotlib** for static visualizations
- **scipy** for statistical analysis
- **scikit-learn** for advanced analytics

## Key Files and Structure

### React Application
*   `src/main.tsx`: Application entry point
*   `src/App.tsx`: Main app component with routing setup
*   `src/pages/Dashboard.tsx`: Main dashboard orchestrating all visualizations
*   `src/pages/Home.tsx`: Landing page
*   `src/components/`: UI components organized by feature
    *   `dashboard/`: Dashboard-specific components
    *   `ui/`: Reusable UI components
    *   `ErrorBoundary.tsx`: Error handling wrapper
    *   `ThemeToggle.tsx`: Theme switching component
*   `src/data/`: Data files and type definitions
    *   `analysisData.ts`: Processed analysis data for visualizations
    *   `languages.ts`: Language configurations and metadata
*   `src/contexts/`: React context providers for shared state

### Data Analysis
*   `00_master_index.ipynb`: Master index and project guide (START HERE)
*   `01_data_exploration.ipynb`: Initial data exploration and quality checks
*   `02_language_comparison.ipynb`: Language comparison and ranking analysis
*   `03_correlation_analysis.ipynb`: Correlation and relationship analysis
*   `04_advanced_visualizations.ipynb`: Advanced and interactive visualizations
*   `05_calculated_fields_and_derived_tables.ipynb`: Placeholder (currently empty)
*   `06_calculation_documentation.ipynb`: Documentation of metrics and calculations
*   `repositories_enriched.csv`: Primary dataset with all repository data
*   `language_comparison_summary.csv`: Generated summary for frontend
*   `top_growth_repos.csv`: Generated growth data for frontend

## Build, Test, and Development Commands

### React Frontend

#### Install Dependencies
```bash
npm install
```

#### Development Server
```bash
npm run dev
```
- Starts Vite dev server on `http://localhost:5173`
- Hot module replacement enabled
- TypeScript checking in watch mode

#### Build for Production
```bash
npm run build
```
- Runs TypeScript compiler (`tsc -b`)
- Builds optimized production bundle with Vite
- Output directory: `dist/`
- **IMPORTANT:** Always run build before finalizing changes to ensure no TypeScript errors

#### Preview Production Build
```bash
npm run preview
```

#### Type Checking
```bash
npx tsc --noEmit
```
- Performs type checking without emitting files
- Use this to validate TypeScript before committing

### Python Notebooks

#### Install Required Packages
```bash
pip install pandas numpy matplotlib seaborn plotly scipy scikit-learn jupyter
```

#### Run Jupyter
```bash
jupyter notebook
```

#### Notebook Execution Order
Run notebooks sequentially in numerical order:
1. `00_master_index.ipynb` (orientation)
2. `01_data_exploration.ipynb` (data understanding)
3. `02_language_comparison.ipynb` (language rankings)
4. `03_correlation_analysis.ipynb` (relationships)
5. `04_advanced_visualizations.ipynb` (publication visuals)
6. `06_calculation_documentation.ipynb` (metrics documentation)

Note: `05_calculated_fields_and_derived_tables.ipynb` is currently a placeholder.

## Developer Workflow Guidelines

### Working with React Components

1. **Component Organization:** 
   - Place feature-specific components in `src/components/dashboard/`
   - Place reusable UI components in `src/components/ui/`
   - Use functional components with TypeScript
   - Follow existing naming conventions (PascalCase for components)

2. **TypeScript Standards:**
   - Use strict TypeScript (`strict: true` in tsconfig.json)
   - Define interfaces for all props and complex data structures
   - Avoid `any` type; use proper typing or `unknown` with type guards
   - Use type inference where possible to reduce verbosity

3. **Styling:**
   - Use Tailwind CSS utility classes
   - Follow existing color scheme and spacing patterns
   - Responsive design: mobile-first approach
   - Dark mode support via theme context

4. **State Management:**
   - Use React hooks (useState, useEffect, useContext)
   - Context providers in `src/contexts/` for global state
   - Keep component state local when possible

### Working with Data

1. **Data Files:**
   - Primary data: `repositories_enriched.csv` (832KB, 1200+ repositories)
   - Generated summaries should be lightweight for web delivery
   - Place new CSV exports in root directory
   - Update `src/data/analysisData.ts` when adding new visualizations

2. **Data Flow:**
   - Notebooks generate CSV files → Import in `src/data/*.ts` → Components consume via imports
   - When adding new metrics, generate summary CSV from notebooks first
   - Keep data files small for web performance (aggregate/filter as needed)

3. **Adding New Visualizations:**
   - Generate data in notebooks (preferably in `04_advanced_visualizations.ipynb`)
   - Export to CSV with clear column names
   - Create TypeScript interfaces for the data structure
   - Import and use in React components
   - Add to `Dashboard.tsx` orchestration

### Notebook Development

1. **Cell Execution:**
   - Always run cells sequentially top-to-bottom
   - Restart kernel and run all cells before finalizing changes
   - Check for any errors or warnings

2. **Code Quality:**
   - Add markdown cells to explain analysis steps
   - Comment complex calculations
   - Use descriptive variable names
   - Format code consistently

3. **Visualizations:**
   - Static plots: Use matplotlib/seaborn, save as PNG
   - Interactive plots: Use plotly, save as HTML
   - Ensure plots have clear titles, labels, and legends
   - Use consistent color schemes

## Code Style and Best Practices

### TypeScript/React
- Use ES6+ features (arrow functions, destructuring, template literals)
- Prefer `const` over `let`, avoid `var`
- Use optional chaining (`?.`) and nullish coalescing (`??`)
- Keep functions small and single-purpose
- Extract complex logic into custom hooks
- Add JSDoc comments for complex functions
- Use semantic HTML elements

### Python
- Follow PEP 8 style guidelines
- Use meaningful variable names
- Add docstrings to functions
- Prefer pandas operations over loops
- Use type hints where beneficial
- Keep cells focused on single concepts

## Common Tasks

### Adding a New Language Metric
1. Update calculation in relevant notebook (likely `02_language_comparison.ipynb`)
2. Export updated summary CSV
3. Update TypeScript interface in `src/data/analysisData.ts`
4. Update component consuming the data
5. Test visualization in browser
6. Run `npm run build` to verify no errors

### Adding a New Visualization Component
1. Create component file in `src/components/dashboard/`
2. Define TypeScript props interface
3. Import and use data from `src/data/`
4. Add to `Dashboard.tsx` layout
5. Test responsiveness and dark mode
6. Run `npm run build` to verify

### Updating Dataset
1. Update `repositories_enriched.csv` with new data
2. Re-run notebooks in order to regenerate derived files
3. Verify no breaking changes in data structure
4. Update TypeScript types if schema changed
5. Test all visualizations

## Important Notes

### What NOT to Do
- **Don't** modify TypeScript config files without discussion (strict mode is intentional)
- **Don't** add new dependencies without checking bundle size impact
- **Don't** commit `node_modules/`, `dist/`, or notebook checkpoints
- **Don't** break sequential notebook execution order
- **Don't** modify existing CSV data structure without updating all consumers
- **Don't** disable TypeScript strict checks to "fix" errors

### What to Always Do
- **Always** run `npm run build` before finalizing React changes
- **Always** test notebooks in sequential order after changes
- **Always** check that new visualizations work in both light and dark modes
- **Always** verify responsive design on different screen sizes
- **Always** use existing color schemes and design patterns
- **Always** add appropriate error handling for data loading
- **Always** update this file if adding major new patterns or conventions

## Deployment

### Platforms
- **Netlify**: Frontend deployment (configured in `netlify.toml`)
- **Vercel**: Alternative frontend deployment (configured in `vercel.json`)

### Build Configuration
- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 20.x (specified in deployment configs)

## Getting Help

- **README.md**: Comprehensive Jupyter notebook guide
- **00_master_index.ipynb**: Project overview and dataset documentation
- **NOTEBOOK_SUMMARY.md**: Quick reference for notebook contents
- **Documentation in code**: Check inline comments and JSDoc
- **Git history**: Review past changes for context

## Data Flow Summary

```
repositories_enriched.csv (primary data)
    ↓
Jupyter Notebooks (analysis & processing)
    ↓
Generated CSV files (language_comparison_summary.csv, etc.)
    ↓
src/data/*.ts (TypeScript imports)
    ↓
React Components (visualization)
    ↓
Dashboard (user interface)
```

When working on this project, remember that changes to notebooks may require updates to the React app, and vice versa. Always consider the complete data pipeline.
