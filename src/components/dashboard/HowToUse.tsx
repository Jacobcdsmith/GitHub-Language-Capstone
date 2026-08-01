import { BookOpen, BarChart3, TrendingUp, Shield, Info } from "lucide-react";
import { useAnalysisData } from "@/contexts/AnalysisDataContext";
import { formatRelativeTime } from "@/lib/formatRelativeTime";

export default function HowToUse() {
  const { languageData, correlationData, generatedAt, totalRepoCount } = useAnalysisData();
  const topLanguage = languageData.reduce((max, lang) => (lang.overallScore > max.overallScore ? lang : max), languageData[0]);
  const mostPopularLanguage = languageData.reduce((max, lang) => (lang.avgStars > max.avgStars ? lang : max), languageData[0]);
  const rankedCorrelations = [
    { label: "Activity", target: "Overall Success", r: correlationData.activityVsOverall.r },
    { label: "Health", target: "Overall Success", r: correlationData.healthVsOverall.r },
    { label: "Popularity", target: "Overall Success", r: correlationData.popularityVsOverall.r }
  ].sort((a, b) => b.r - a.r);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">How to Use This Dashboard</h2>
        <p className="text-[#8b949e]">
          Understanding the metrics, visualizations, and methodology behind the analysis
        </p>
      </div>

      {/* Quick Start Guide */}
      <div className="bg-gradient-to-br from-[#161b22] to-[#1a1f2e] border-2 border-[#58a6ff] p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="w-6 h-6 text-[#58a6ff]" />
          <h3 className="text-2xl font-bold text-white">Quick Start Guide</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0d1117] p-4 rounded">
            <div className="font-semibold text-white mb-2">1. Explore Languages</div>
            <p className="text-sm text-[#8b949e]">
              Use the Language Explorer to search, filter, and compare programming languages. Toggle between single and multi-select modes for different comparison views.
            </p>
          </div>
          <div className="bg-[#0d1117] p-4 rounded">
            <div className="font-semibold text-white mb-2">2. View 3D Visualizations</div>
            <p className="text-sm text-[#8b949e]">
              Navigate to 3D Visualizations to interact with advanced charts. Rotate, zoom, and hover over data points for detailed information.
            </p>
          </div>
          <div className="bg-[#0d1117] p-4 rounded">
            <div className="font-semibold text-white mb-2">3. Analyze Correlations</div>
            <p className="text-sm text-[#8b949e]">
              Check the Correlation Analysis section to understand relationships between metrics like popularity, activity, and health scores.
            </p>
          </div>
          <div className="bg-[#0d1117] p-4 rounded">
            <div className="font-semibold text-white mb-2">4. Assess Enterprise Readiness</div>
            <p className="text-sm text-[#8b949e]">
              Review health indicators including license compliance, documentation quality, and code of conduct presence.
            </p>
          </div>
        </div>
      </div>

      {/* Understanding Scores */}
      <div className="bg-[#161b22] border border-[#21262d] p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-6 h-6 text-[#3fb950]" />
          <h3 className="text-2xl font-bold text-white">Understanding Scores</h3>
        </div>
        <div className="space-y-4">
          <div className="border-l-4 border-[#58a6ff] pl-4">
            <h4 className="font-bold text-white mb-2">Popularity Score (0-100)</h4>
            <p className="text-sm text-[#c9d1d9] mb-2">
              Measures the widespread adoption and community interest in a language based on repository stars and forks.
            </p>
            <div className="bg-[#0d1117] p-3 rounded text-xs font-mono text-[#8b949e]">
              <div className="mb-1">Formula: Normalized average of (Stars + Forks)</div>
              <div>Note: Raw popularity follows a power-law distribution. Python's average stars (5,200) are 5.2× higher than Swift (1,000).</div>
            </div>
          </div>

          <div className="border-l-4 border-[#3fb950] pl-4">
            <h4 className="font-bold text-white mb-2">Activity Score (0-100)</h4>
            <p className="text-sm text-[#c9d1d9] mb-2">
              Reflects ongoing development activity through contributor engagement and commit frequency.
            </p>
            <div className="bg-[#0d1117] p-3 rounded text-xs font-mono text-[#8b949e]">
              <div className="mb-1">Formula: Weighted average of Contributors (60%) + Activity Metric (40%)</div>
              <div>Activity Metric = (Avg Contributors × 0.6) + (Normalized Commits × 0.4)</div>
            </div>
          </div>

          <div className="border-l-4 border-[#bc8cff] pl-4">
            <h4 className="font-bold text-white mb-2">Health Score (0-100)</h4>
            <p className="text-sm text-[#c9d1d9] mb-2">
              Evaluates project sustainability through documentation, licensing, and community guidelines.
            </p>
            <div className="bg-[#0d1117] p-3 rounded text-xs font-mono text-[#8b949e]">
              <div className="mb-1">Components (each worth points):</div>
              <div>• Has License: +35 points</div>
              <div>• Has Contributing Guidelines: +33 points</div>
              <div>• Has Code of Conduct: +32 points</div>
              <div>Total possible: 100 points</div>
            </div>
          </div>

          <div className="border-l-4 border-[#f0883e] pl-4">
            <h4 className="font-bold text-white mb-2">Overall Score (0-100)</h4>
            <p className="text-sm text-[#c9d1d9] mb-2">
              Composite metric combining all three dimensions with equal weighting.
            </p>
            <div className="bg-[#0d1117] p-3 rounded text-xs font-mono text-[#8b949e]">
              <div>Formula: (Popularity + Activity + Health) / 3</div>
            </div>
          </div>

          <div className="border-l-4 border-[#ff6b6b] pl-4">
            <h4 className="font-bold text-white mb-2">Enterprise Readiness (0-100%)</h4>
            <p className="text-sm text-[#c9d1d9] mb-2">
              Measures governance maturity and compliance readiness across four critical dimensions.
            </p>
            <div className="bg-[#0d1117] p-3 rounded text-xs font-mono text-[#8b949e]">
              <div className="mb-1">Formula: Compliance Score × 100</div>
              <div className="mb-2">Compliance Score = Average of:</div>
              <div>• Has License (0 or 1)</div>
              <div>• Has Contributing Guidelines (0 or 1)</div>
              <div>• Has Code of Conduct (0 or 1)</div>
              <div>• Has Security Policy (0 or 1)</div>
              <div className="mt-2 pt-2 border-t border-[#21262d] text-[#c9d1d9]">
                Example: TypeScript with 3/4 elements = 0.75 × 100 = 75%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Normalization Methodology */}
      <div className="bg-[#161b22] border border-[#21262d] p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-[#ffd700]" />
          <h3 className="text-2xl font-bold text-white">Normalization & Scaling</h3>
        </div>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-white mb-2">Why Normalize?</h4>
            <p className="text-sm text-[#c9d1d9] mb-3">
              Raw GitHub metrics follow extreme power-law distributions where popular languages dominate. 
              Normalization allows fair comparison across all languages by scaling values to a 0-100 range.
            </p>
          </div>

          <div className="bg-[#0d1117] p-4 rounded">
            <h4 className="font-semibold text-white mb-2">Min-Max Normalization</h4>
            <div className="text-xs font-mono text-[#8b949e] space-y-2">
              <div>normalized_value = ((value - min) / (max - min)) × 100</div>
              <div className="mt-3 pt-3 border-t border-[#21262d]">
                <div className="text-[#c9d1d9] mb-1">Example: Python Stars</div>
                <div>Raw average: 5,200 stars</div>
                <div>Min (Swift): 1,000 stars</div>
                <div>Max (Python): 5,200 stars</div>
                <div>Normalized: ((5200 - 1000) / (5200 - 1000)) × 100 = 100</div>
              </div>
            </div>
          </div>

          <div className="bg-[#0d1117] p-4 rounded">
            <h4 className="font-semibold text-white mb-2">Handling Outliers</h4>
            <p className="text-sm text-[#c9d1d9]">
              Extreme outliers are capped at the 95th percentile to prevent skewing. This ensures that 
              exceptionally popular repositories don't distort the overall language scores.
            </p>
          </div>
        </div>
      </div>

      {/* Interpreting Visualizations */}
      <div className="bg-[#161b22] border border-[#21262d] p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Info className="w-6 h-6 text-[#bc8cff]" />
          <h3 className="text-2xl font-bold text-white">Interpreting Visualizations</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-[#0d1117] p-4 rounded">
            <h4 className="font-semibold text-white mb-2">Radar Charts</h4>
            <p className="text-sm text-[#c9d1d9] mb-2">
              Show multi-dimensional profiles. Larger area = stronger overall performance. 
              Look for balanced shapes vs. spiky patterns.
            </p>
            <div className="text-xs text-[#8b949e]">
              Balanced: Rust, TypeScript | Spiky: Python (high popularity, lower health)
            </div>
          </div>

          <div className="bg-[#0d1117] p-4 rounded">
            <h4 className="font-semibold text-white mb-2">3D Scatter Plots</h4>
            <p className="text-sm text-[#c9d1d9] mb-2">
              Reveal clustering patterns across three dimensions. Points close together have similar characteristics.
            </p>
            <div className="text-xs text-[#8b949e]">
              Modern cluster: Rust, TypeScript, Go | Legacy cluster: Java, C++
            </div>
          </div>

          <div className="bg-[#0d1117] p-4 rounded">
            <h4 className="font-semibold text-white mb-2">Correlation Matrices</h4>
            <p className="text-sm text-[#c9d1d9] mb-2">
              Values range from -1 to +1. Closer to ±1 = stronger relationship. 
              Color intensity indicates strength.
            </p>
            <div className="text-xs text-[#8b949e]">
              Strongest correlation (r={rankedCorrelations[0].r}): {rankedCorrelations[0].label} ↔ {rankedCorrelations[0].target}
            </div>
          </div>

          <div className="bg-[#0d1117] p-4 rounded">
            <h4 className="font-semibold text-white mb-2">Sunburst Diagrams</h4>
            <p className="text-sm text-[#c9d1d9] mb-2">
              Hierarchical view showing language segments and their relative sizes. 
              Outer rings represent subcategories.
            </p>
            <div className="text-xs text-[#8b949e]">
              Click segments to drill down into detailed breakdowns
            </div>
          </div>
        </div>
      </div>

      {/* Correlation Importance */}
      <div className="bg-[#161b22] border border-[#21262d] p-6 rounded-lg">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-[#f0883e]" />
          <h3 className="text-2xl font-bold text-white">Why Correlations Matter</h3>
        </div>
        <div className="space-y-3">
          <div className="bg-[#0d1117] p-4 rounded border-l-4 border-[#3fb950]">
            <div className="font-semibold text-white mb-1">{rankedCorrelations[0].label} → {rankedCorrelations[0].target} (r = {rankedCorrelations[0].r})</div>
            <p className="text-sm text-[#c9d1d9]">
              The strongest correlation of the three tracked metrics — {rankedCorrelations[0].label.toLowerCase()} is currently
              the best predictor of overall language success.
            </p>
          </div>

          <div className="bg-[#0d1117] p-4 rounded border-l-4 border-[#bc8cff]">
            <div className="font-semibold text-white mb-1">{rankedCorrelations[1].label} → {rankedCorrelations[1].target} (r = {rankedCorrelations[1].r})</div>
            <p className="text-sm text-[#c9d1d9]">
              A moderate correlation — meaningful, but a weaker predictor of overall score than the strongest metric above.
            </p>
          </div>

          <div className="bg-[#0d1117] p-4 rounded border-l-4 border-[#58a6ff]">
            <div className="font-semibold text-white mb-1">{rankedCorrelations[2].label} → {rankedCorrelations[2].target} (r = {rankedCorrelations[2].r})</div>
            <p className="text-sm text-[#c9d1d9]">
              The weakest of the three tracked correlations, confirming it's not the most reliable success indicator on its own.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-[#161b22] border border-[#21262d] p-6 rounded-lg">
        <h3 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-white mb-1">Q: Why is {mostPopularLanguage.name}'s popularity score so high?</h4>
            <p className="text-sm text-[#c9d1d9]">
              {mostPopularLanguage.name} repositories average {mostPopularLanguage.avgStars.toLocaleString()} stars, the highest of any
              tracked language right now. Popularity scores are normalized within each language's own sample, so this
              reflects real, current adoption rather than a fixed baseline.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-1">Q: What makes {topLanguage.name} the overall leader?</h4>
            <p className="text-sm text-[#c9d1d9]">
              {topLanguage.name} currently achieves the highest overall score ({topLanguage.overallScore.toFixed(1)}) through balanced
              strength: popularity {topLanguage.popularityScore.toFixed(1)}, activity {topLanguage.activityScore.toFixed(1)}, and
              health {topLanguage.healthScore.toFixed(1)}. No major weaknesses across the three dimensions.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-1">Q: How often is the data updated?</h4>
            <p className="text-sm text-[#c9d1d9]">
              This dashboard is live: a scheduled job refreshes scores for {totalRepoCount.toLocaleString()} repositories directly
              from the GitHub API (last refreshed {formatRelativeTime(generatedAt)}). Popularity and recency are recomputed for every
              fetched repo; activity/health/overall scores are computed for a representative top-scoring sample per language to stay
              within API limits — see the language-level averages' methodology for details. There is no static fallback: if the live
              pipeline can't be reached, the dashboard shows an explicit error instead of stale numbers.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-1">Q: Can I export my analysis?</h4>
            <p className="text-sm text-[#c9d1d9]">
              Yes! Use the export buttons in the navigation bar to download PDF reports or PowerPoint presentations 
              based on your current selections and filters.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

