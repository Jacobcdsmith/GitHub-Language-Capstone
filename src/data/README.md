# Data Directory

This directory contains all static data used throughout the GitHub Language Analytics Dashboard.

## 📁 Files

### `analysisData.ts` - Primary Data Source ✅

**Status**: Active - Used by all components

**Exports**:
- `languageData: LanguageInfo[]` - Statistics for 12 programming languages
- `topRepositories: RepositoryInfo[]` - Top 10 GitHub repositories
- `correlationData: CorrelationStats` - Statistical correlation metrics
- `segmentData: SegmentInfo[]` - Language segments and categories
- `healthIndicators: HealthIndicator[]` - Health indicator impacts

**Usage**: Import from this file for all data needs
```typescript
import { languageData, correlationData } from '@/data/analysisData';
```

### `languages.ts` - Legacy Data Source ⚠️

**Status**: Deprecated - Not actively used

**Note**: This file exists for backward compatibility only. New code should use `analysisData.ts`.

### `constants.ts` - Application Constants ✅

**Status**: Active

**Exports**:
- Score thresholds
- Display limits
- Animation durations
- Color palette
- Statistical thresholds

**Usage**: Use constants instead of magic numbers
```typescript
import { SCORE_THRESHOLDS, DISPLAY_LIMITS } from '@/data/constants';
```

## 📊 Data Structures

### LanguageInfo

```typescript
interface LanguageInfo {
  name: string;              // e.g., "Rust", "TypeScript"
  overallScore: number;      // Overall score (0-50 scale)
  popularityScore: number;   // Popularity metric (0-100)
  activityScore: number;     // Activity metric (0-100)
  healthScore: number;       // Health metric (0-100)
  avgStars: number;          // Average stars per repository
  avgForks: number;          // Average forks per repository
  avgContributors: number;   // Average contributors per repo
  avgCommits: number;        // Average commits per repository
  enterpriseReadiness: number; // Enterprise features score (0-40)
  growthSignal: number;      // Growth indicator (0-1)
  color: string;             // Hex color code (e.g., "#CE422B")
  icon: string;              // Emoji icon (e.g., "🦀")
}
```

**12 Languages Analyzed**:
1. Rust (49.40 score)
2. TypeScript (48.33)
3. Go (46.92)
4. C++ (44.12)
5. Python (43.49)
6. JavaScript (43.31)
7. Ruby (42.40)
8. Java (41.45)
9. Kotlin (38.49)
10. PHP (38.20)
11. Swift (37.43)
12. C# (36.78)

### RepositoryInfo

```typescript
interface RepositoryInfo {
  name: string;              // Repository name (e.g., "microsoft/vscode")
  language: string;          // Primary language
  stars: number;             // GitHub stars count
  forks: number;             // GitHub forks count
  contributors: number;      // Number of contributors
  growth: number;            // Growth signal (0-1)
}
```

### CorrelationStats

```typescript
interface CorrelationStats {
  activityVsOverall: { r: number; rSquared: number };
  popularityVsOverall: { r: number; rSquared: number };
  healthVsOverall: { r: number; rSquared: number };
}
```

**Current Values**:
- Activity vs Overall: r = 0.85, R² = 0.72
- Health vs Overall: r = 0.68, R² = 0.46
- Popularity vs Overall: r = 0.57, R² = 0.33

### SegmentInfo

```typescript
interface SegmentInfo {
  segment: string;           // Segment name
  languages: string[];       // Languages in segment
  avgScore: number;          // Average score for segment
  repos: number;             // Number of repositories
}
```

**5 Segments**:
1. High Performance (Rust, C++, Go)
2. Web Development (TypeScript, JavaScript)
3. Enterprise (Java, C#)
4. Scripting (Python, Ruby, PHP)
5. Mobile (Swift, Kotlin)

### HealthIndicator

```typescript
interface HealthIndicator {
  indicator: string;         // Indicator name
  impact: number;            // Impact score (0-15)
  description: string;       // Description
}
```

**6 Health Indicators**:
1. License (11.88 impact)
2. Contributing Guidelines (12.70)
3. Code of Conduct (12.70)
4. Issue Templates (8.45)
5. Security Policy (9.23)
6. Documentation (10.12)

## 📈 Score Methodology

### Overall Score (0-50 scale)

Weighted composite of three dimensions:
- **Popularity** (40% weight): Stars, forks, watchers
- **Activity** (35% weight): Commits, contributors, recent activity
- **Health** (25% weight): Documentation, governance, best practices

### Normalization

All dimensional scores are normalized to 0-100 scale:
- Popularity: Based on relative stars/forks within dataset
- Activity: Based on commit frequency and contributor count
- Health: Based on presence of documentation and governance files

## 🔄 Data Update Process

When updating data from Jupyter notebooks:

1. **Export from Notebooks**
   ```bash
   # Run notebooks to generate updated CSV files
   jupyter notebook 01_data_exploration.ipynb
   ```

2. **Update TypeScript Data**
   - Manually transcribe or script the conversion
   - Ensure all fields are populated
   - Maintain proper TypeScript types

3. **Validate Data**
   ```bash
   # Check for TypeScript errors
   npm run build
   ```

4. **Test in Application**
   ```bash
   # Start dev server and verify
   npm run dev
   ```

5. **Commit Changes**
   ```bash
   git add src/data/analysisData.ts
   git commit -m "Update language data from latest analysis"
   ```

## 🎨 Color Palette

Each language has a designated color:
- Rust: `#CE422B` (Rust orange)
- TypeScript: `#3178C6` (TS blue)
- Go: `#00ADD8` (Go cyan)
- C++: `#00599C` (C++ blue)
- Python: `#3776AB` (Python blue)
- JavaScript: `#F7DF1E` (JS yellow)
- Ruby: `#CC342D` (Ruby red)
- Java: `#007396` (Java blue)
- Kotlin: `#7F52FF` (Kotlin purple)
- PHP: `#777BB4` (PHP purple)
- Swift: `#FA7343` (Swift orange)
- C#: `#239120` (C# green)

## 📝 Best Practices

### When Adding New Data

1. ✅ Add TypeScript interface first
2. ✅ Use proper type annotations
3. ✅ Maintain consistent formatting
4. ✅ Update this README
5. ✅ Test with components

### When Using Data

1. ✅ Import from `analysisData.ts`
2. ✅ Use TypeScript types for safety
3. ✅ Use constants from `constants.ts`
4. ✅ Don't modify imported data
5. ✅ Add error handling for edge cases

### Data Immutability

All exported data is treated as immutable. If you need to modify data:

```typescript
// ✅ Good - Create a copy
const sortedLanguages = [...languageData].sort(...);

// ❌ Bad - Direct mutation
languageData.sort(...); // Don't do this
```

## 🐛 Troubleshooting

### TypeScript Errors

**Issue**: "Property X does not exist on type Y"
**Solution**: Check that you're using the correct interface and all fields are defined

### Missing Data

**Issue**: Component shows undefined values
**Solution**: Verify you're importing from `analysisData.ts`, not `languages.ts`

### Stale Data

**Issue**: Data doesn't reflect latest analysis
**Solution**: Update `analysisData.ts` from latest notebook exports

## 📚 Related Documentation

- [Main README](../../README.md) - Project overview
- [Notebook Summary](../../NOTEBOOK_SUMMARY.md) - Analysis methodology
- [Code Analysis Report](../../CODE_ANALYSIS_REPORT.md) - Code quality review
- [Data Consistency Analysis](../../DATA_CONSISTENCY_ANALYSIS.md) - Data structure review

## 🔍 Data Sources

All data is derived from:
1. GitHub API (repository metadata)
2. Jupyter notebook analysis (calculated scores)
3. Manual curation (colors, icons, descriptions)

**Last Updated**: November 2025  
**Data Coverage**: 1,200 repositories across 12 languages  
**Analysis Period**: 2013-2025
