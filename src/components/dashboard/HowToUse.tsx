import { BookOpen, BarChart3, TrendingUp, Shield, Info } from "lucide-react";

export default function HowToUse() {
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
              Strong correlation (r=0.85): Activity ↔ Overall Success
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
            <div className="font-semibold text-white mb-1">Activity → Success (r = 0.85)</div>
            <p className="text-sm text-[#c9d1d9]">
              Strong positive correlation indicates that active development (contributors, commits) 
              is the best predictor of language success. More important than raw popularity.
            </p>
          </div>

          <div className="bg-[#0d1117] p-4 rounded border-l-4 border-[#bc8cff]">
            <div className="font-semibold text-white mb-1">Health → Enterprise Adoption</div>
            <p className="text-sm text-[#c9d1d9]">
              Languages with licenses, contributing guidelines, and codes of conduct score 11-13 points 
              higher overall. Critical for enterprise decision-making.
            </p>
          </div>

          <div className="bg-[#0d1117] p-4 rounded border-l-4 border-[#58a6ff]">
            <div className="font-semibold text-white mb-1">Popularity vs. Activity (r = 0.62)</div>
            <p className="text-sm text-[#c9d1d9]">
              Moderate correlation shows that star count doesn't always reflect active development. 
              Some popular languages have lower contributor engagement.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="bg-[#161b22] border border-[#21262d] p-6 rounded-lg">
        <h3 className="text-2xl font-bold text-white mb-4">Frequently Asked Questions</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-white mb-1">Q: Why is Python's popularity score so high?</h4>
            <p className="text-sm text-[#c9d1d9]">
              Python repositories average 5,200 stars, significantly higher than other languages. 
              This reflects its dominant position in data science, ML, and education sectors.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-1">Q: What makes Rust the overall leader?</h4>
            <p className="text-sm text-[#c9d1d9]">
              Rust achieves the highest overall score (49.4) through balanced excellence: strong popularity (48.8), 
              high activity (50.0), and perfect health score (49.4). No major weaknesses.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-1">Q: How often is the data updated?</h4>
            <p className="text-sm text-[#c9d1d9]">
              This analysis is based on a snapshot of 1,200 repositories across 12 languages. 
              Data represents patterns as of the analysis date and may not reflect real-time changes.
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

