import { useState, useEffect } from "react";
import { languageData, correlationData, segmentData } from "@/data/analysisData";
import { TrendingUp, Award, Activity, Sparkles } from "lucide-react";
import DynamicInsights from "./DynamicInsights";

export default function Overview() {
  const topLanguages = languageData.slice(0, 5);
  const [hoveredLang, setHoveredLang] = useState<string | null>(null);
  const [animatedScores, setAnimatedScores] = useState<Record<string, number>>({});

  useEffect(() => {
    // Animate scores on mount
    topLanguages.forEach((lang, index) => {
      setTimeout(() => {
        setAnimatedScores(prev => ({ ...prev, [lang.name]: lang.overallScore }));
      }, index * 100);
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Dashboard Overview</h2>
        <p className="text-[#8b949e]">
          Comprehensive analysis of 1,200 GitHub repositories across 12 programming languages
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#161b22] border border-[#21262d] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#58a6ff]/10 rounded">
              <Award className="w-6 h-6 text-[#58a6ff]" />
            </div>
            <h3 className="text-lg font-semibold text-white">Top Language</h3>
          </div>
          <div className="text-4xl font-bold text-[#CE422B] mb-2">Rust</div>
          <div className="text-sm text-[#8b949e]">Overall Score: 49.40</div>
          <div className="mt-4 text-sm text-[#c9d1d9]">
            Leads with balanced strength across all dimensions
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#21262d] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#3fb950]/10 rounded">
              <Activity className="w-6 h-6 text-[#3fb950]" />
            </div>
            <h3 className="text-lg font-semibold text-white">Most Active</h3>
          </div>
          <div className="text-4xl font-bold text-[#3178C6] mb-2">TypeScript</div>
          <div className="text-sm text-[#8b949e]">Activity Score: 69.44</div>
          <div className="mt-4 text-sm text-[#c9d1d9]">
            311 avg contributors, highest engagement
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#21262d] p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-[#bc8cff]/10 rounded">
              <TrendingUp className="w-6 h-6 text-[#bc8cff]" />
            </div>
            <h3 className="text-lg font-semibold text-white">Strongest Predictor</h3>
          </div>
          <div className="text-4xl font-bold text-[#3fb950] mb-2">Activity</div>
          <div className="text-sm text-[#8b949e]">Correlation: r = 0.85</div>
          <div className="mt-4 text-sm text-[#c9d1d9]">
            Better predictor than popularity (r = 0.57)
          </div>
        </div>
      </div>

      {/* Dynamic Insights */}
      <DynamicInsights />

      {/* Top 5 Languages Ranking */}
      <div className="bg-[#161b22] border border-[#21262d] p-6">
        <h3 className="text-xl font-bold text-white mb-4">Top 5 Languages by Overall Score</h3>
        <div className="space-y-4">
          {topLanguages.map((lang, index) => (
            <div 
              key={lang.name} 
              className="flex items-center gap-4 transition-all duration-300 hover:scale-105 cursor-pointer"
              onMouseEnter={() => setHoveredLang(lang.name)}
              onMouseLeave={() => setHoveredLang(null)}
            >
              <div className="w-8 h-8 flex items-center justify-center bg-[#21262d] rounded font-bold text-[#8b949e]">
                {index + 1}
              </div>
              <div className="flex-1 relative">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{lang.icon}</span>
                    <span className="font-semibold text-white">{lang.name}</span>
                  </div>
                  <span className="text-lg font-bold" style={{ color: lang.color }}>
                    {lang.overallScore.toFixed(2)}
                  </span>
                </div>
                <div className="w-full bg-[#21262d] h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${((animatedScores[lang.name] || 0) / 50) * 100}%`,
                      backgroundColor: lang.color,
                      boxShadow: hoveredLang === lang.name ? `0 0 10px ${lang.color}` : 'none'
                    }}
                  />
                </div>
                {hoveredLang === lang.name && (
                  <div className="absolute right-0 top-0 bg-[#0d1117] border border-[#30363d] rounded px-3 py-2 text-xs space-y-1 z-10">
                    <div className="text-[#8b949e]">Popularity: <span className="text-[#58a6ff] font-semibold">{lang.popularityScore.toFixed(1)}</span></div>
                    <div className="text-[#8b949e]">Activity: <span className="text-[#3fb950] font-semibold">{lang.activityScore.toFixed(1)}</span></div>
                    <div className="text-[#8b949e]">Health: <span className="text-[#bc8cff] font-semibold">{lang.healthScore.toFixed(1)}</span></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Segment Analysis Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[#161b22] border border-[#21262d] p-6">
          <h3 className="text-xl font-bold text-white mb-4">Language Segments</h3>
          <div className="space-y-3">
            {segmentData.map((segment) => (
              <div key={segment.segment} className="bg-[#0d1117] p-4 rounded">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-white">{segment.segment}</span>
                  <span className="text-[#58a6ff] font-mono text-sm">
                    {segment.avgScore.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-[#8b949e] mb-2">
                  {segment.languages.join(", ")}
                </div>
                <div className="text-xs text-[#8b949e]">{segment.repos} repositories</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#21262d] p-6">
          <h3 className="text-xl font-bold text-white mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="bg-[#0d1117] p-4 rounded border-l-4 border-[#3fb950]">
              <div className="font-semibold text-white mb-2">Modern Languages Dominate</div>
              <div className="text-sm text-[#c9d1d9]">
                Rust, TypeScript, and Go outperform traditional languages by 10-15 points with balanced strength across all dimensions
              </div>
            </div>
            <div className="bg-[#0d1117] p-4 rounded border-l-4 border-[#58a6ff]">
              <div className="font-semibold text-white mb-2">Activity Predicts Success</div>
              <div className="text-sm text-[#c9d1d9]">
                Activity metrics (r=0.85) demonstrate stronger correlation with success than popularity (r=0.57)
              </div>
            </div>
            <div className="bg-[#0d1117] p-4 rounded border-l-4 border-[#bc8cff]">
              <div className="font-semibold text-white mb-2">Health Indicators Matter</div>
              <div className="text-sm text-[#c9d1d9]">
                License, contributing guidelines, and CoC each add 11-13 points to overall scores
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

