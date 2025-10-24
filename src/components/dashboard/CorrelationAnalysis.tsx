import { languageData, correlationData } from "@/data/analysisData";

export default function CorrelationAnalysis() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Correlation Analysis</h2>
        <p className="text-[#8b949e]">Statistical relationships between metrics and overall success</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#161b22] border border-[#21262d] p-6">
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-[#3fb950] mb-2">0.85</div>
            <div className="text-sm font-semibold text-white mb-1">Activity vs Overall</div>
            <div className="text-xs text-[#8b949e]">R² = 0.72</div>
          </div>
          <div className="text-sm text-[#c9d1d9] text-center">
            Strongest predictor of language success
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#21262d] p-6">
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-[#bc8cff] mb-2">0.68</div>
            <div className="text-sm font-semibold text-white mb-1">Health vs Overall</div>
            <div className="text-xs text-[#8b949e]">R² = 0.46</div>
          </div>
          <div className="text-sm text-[#c9d1d9] text-center">
            Moderate positive correlation
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#21262d] p-6">
          <div className="text-center mb-4">
            <div className="text-5xl font-bold text-[#58a6ff] mb-2">0.57</div>
            <div className="text-sm font-semibold text-white mb-1">Popularity vs Overall</div>
            <div className="text-xs text-[#8b949e]">R² = 0.33</div>
          </div>
          <div className="text-sm text-[#c9d1d9] text-center">
            Weakest predictor among three
          </div>
        </div>
      </div>

      <div className="bg-[#161b22] border border-[#21262d] p-6">
        <h3 className="text-xl font-bold text-white mb-4">Activity Score vs Overall Score</h3>
        <div className="bg-[#0d1117] p-6 rounded">
          <div className="grid grid-cols-12 gap-2">
            {languageData.map((lang) => (
              <div
                key={lang.name}
                className="relative group"
                style={{
                  gridColumn: `span 1`,
                  gridRow: `span 1`,
                  marginLeft: `${(lang.activityScore / 100) * 100}%`,
                  marginTop: `${100 - (lang.overallScore / 50) * 100}%`
                }}
              >
                <div
                  className="w-4 h-4 rounded-full cursor-pointer"
                  style={{ backgroundColor: lang.color }}
                  title={`${lang.name}: Activity ${lang.activityScore.toFixed(1)}, Overall ${lang.overallScore.toFixed(2)}`}
                />
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 text-sm text-[#8b949e] text-center">
          Scatter plot showing strong positive correlation (r = 0.85) between activity and overall scores
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#161b22] border border-[#21262d] p-6">
          <h3 className="text-xl font-bold text-white mb-4">Key Findings</h3>
          <div className="space-y-3">
            <div className="bg-[#0d1117] p-4 rounded border-l-4 border-[#3fb950]">
              <div className="font-semibold text-white mb-2">Activity is King</div>
              <div className="text-sm text-[#c9d1d9]">
                Activity metrics (commits, contributors) show strongest correlation (r=0.85) with overall success
              </div>
            </div>
            <div className="bg-[#0d1117] p-4 rounded border-l-4 border-[#58a6ff]">
              <div className="font-semibold text-white mb-2">Popularity Misleading</div>
              <div className="text-sm text-[#c9d1d9]">
                Raw popularity (stars) has weakest correlation (r=0.57), confirming it's not the best success indicator
              </div>
            </div>
            <div className="bg-[#0d1117] p-4 rounded border-l-4 border-[#bc8cff]">
              <div className="font-semibold text-white mb-2">Health Matters</div>
              <div className="text-sm text-[#c9d1d9]">
                Health indicators show moderate correlation (r=0.68), emphasizing importance of good project governance
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#21262d] p-6">
          <h3 className="text-xl font-bold text-white mb-4">Statistical Significance</h3>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">Activity Correlation</span>
                <span className="text-sm font-mono text-[#3fb950]">p &lt; 0.0001</span>
              </div>
              <div className="text-xs text-[#8b949e] mb-2">Highly significant relationship</div>
              <div className="w-full bg-[#21262d] h-2 rounded-full overflow-hidden">
                <div className="h-full bg-[#3fb950]" style={{ width: "85%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">Health Correlation</span>
                <span className="text-sm font-mono text-[#bc8cff]">p &lt; 0.001</span>
              </div>
              <div className="text-xs text-[#8b949e] mb-2">Significant relationship</div>
              <div className="w-full bg-[#21262d] h-2 rounded-full overflow-hidden">
                <div className="h-full bg-[#bc8cff]" style={{ width: "68%" }} />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-white">Popularity Correlation</span>
                <span className="text-sm font-mono text-[#58a6ff]">p &lt; 0.01</span>
              </div>
              <div className="text-xs text-[#8b949e] mb-2">Moderate significance</div>
              <div className="w-full bg-[#21262d] h-2 rounded-full overflow-hidden">
                <div className="h-full bg-[#58a6ff]" style={{ width: "57%" }} />
              </div>
            </div>

            <div className="mt-6 p-4 bg-[#0d1117] rounded">
              <div className="text-sm text-[#c9d1d9]">
                All correlations are statistically significant, validating ecosystem-level variations beyond individual project quality
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
