import { useState } from "react";
import { languageData } from "@/data/analysisData";
import { Search, Filter, Zap } from "lucide-react";
import AnimatedComparison from "./AnimatedComparison";
import RadarChart from "./RadarChart";
import MultiRadarChart from "./MultiRadarChart";

interface LanguageExplorerProps {
  onSelectionChange?: (languages: string[]) => void;
}

export default function LanguageExplorer({ onSelectionChange }: LanguageExplorerProps = {}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"overall" | "popularity" | "activity" | "health">("overall");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'single' | 'multi'>('single');

  const filteredLanguages = languageData
    .filter((lang) => lang.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      switch (sortBy) {
        case "popularity":
          return b.popularityScore - a.popularityScore;
        case "activity":
          return b.activityScore - a.activityScore;
        case "health":
          return b.healthScore - a.healthScore;
        default:
          return b.overallScore - a.overallScore;
      }
    });

  const selected = selectedLanguages.length === 1
    ? languageData.find((l) => l.name === selectedLanguages[0])
    : null;

  const selectedMultiple = selectedLanguages.length > 1
    ? languageData.filter((l) => selectedLanguages.includes(l.name))
    : [];

  const toggleLanguageSelection = (langName: string) => {
    const newSelection = viewMode === 'single'
      ? [langName]
      : selectedLanguages.includes(langName)
        ? selectedLanguages.filter(n => n !== langName)
        : [...selectedLanguages, langName];
    
    setSelectedLanguages(newSelection);
    onSelectionChange?.(newSelection);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Language Explorer</h2>
        <p className="text-[#8b949e]">Explore detailed metrics and compare programming languages</p>
      </div>

      <div className="bg-[#161b22] border border-[#21262d] p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8b949e]" />
            <input
              type="text"
              placeholder="Search languages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0d1117] border border-[#30363d] rounded text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff]"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#8b949e]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full pl-10 pr-4 py-2 bg-[#0d1117] border border-[#30363d] rounded text-white focus:outline-none focus:border-[#58a6ff]"
            >
              <option value="overall">Sort by Overall Score</option>
              <option value="popularity">Sort by Popularity</option>
              <option value="activity">Sort by Activity</option>
              <option value="health">Sort by Health</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#161b22] border border-[#21262d] p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">All Languages</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setViewMode('single'); setSelectedLanguages([]); }}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  viewMode === 'single'
                    ? 'bg-[#58a6ff] text-white'
                    : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]'
                }`}
              >
                Single
              </button>
              <button
                onClick={() => setViewMode('multi')}
                className={`px-3 py-1 text-sm rounded transition-colors ${
                  viewMode === 'multi'
                    ? 'bg-[#58a6ff] text-white'
                    : 'bg-[#21262d] text-[#8b949e] hover:bg-[#30363d]'
                }`}
              >
                Multi-Select
              </button>
            </div>
          </div>
          <div className="space-y-2 max-h-[600px] overflow-y-auto">
            {filteredLanguages.map((lang) => (
              <button
                key={lang.name}
                onClick={() => toggleLanguageSelection(lang.name)}
                className={`w-full text-left p-4 rounded transition-colors flex items-start gap-3 ${
                  selectedLanguages.includes(lang.name)
                    ? "bg-[#58a6ff]/20 border border-[#58a6ff]"
                    : "bg-[#0d1117] hover:bg-[#21262d] border border-transparent"
                }`}
              >
                {viewMode === 'multi' && (
                  <div className="mt-1">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedLanguages.includes(lang.name)
                        ? 'bg-[#58a6ff] border-[#58a6ff]'
                        : 'border-[#30363d]'
                    }`}>
                      {selectedLanguages.includes(lang.name) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </div>
                )}
                <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{lang.icon}</span>
                    <span className="font-semibold text-white">{lang.name}</span>
                  </div>
                  <span className="text-lg font-bold" style={{ color: lang.color }}>
                    {lang.overallScore.toFixed(2)}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs text-[#8b949e]">
                  <div>Pop: {lang.popularityScore.toFixed(1)}</div>
                  <div>Act: {lang.activityScore.toFixed(1)}</div>
                  <div>Health: {lang.healthScore.toFixed(1)}</div>
                </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[#161b22] border border-[#21262d] p-6">
          {selectedMultiple.length > 0 ? (
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Multi-Language Comparison</h3>
              <MultiRadarChart
                data={selectedMultiple.map(lang => ({
                  name: lang.name,
                  values: [lang.popularityScore, lang.activityScore, lang.healthScore],
                  color: lang.color
                }))}
                labels={['Popularity', 'Activity', 'Health']}
              />
              <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedMultiple.map(lang => (
                  <div key={lang.name} className="bg-[#0d1117] p-4 rounded border-l-4" style={{ borderColor: lang.color }}>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-2xl">{lang.icon}</span>
                      <span className="font-bold text-white">{lang.name}</span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-[#8b949e]">Overall:</span>
                        <span className="font-bold" style={{ color: lang.color }}>{lang.overallScore.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8b949e]">Stars:</span>
                        <span className="text-white">{lang.avgStars.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8b949e]">Contributors:</span>
                        <span className="text-white">{lang.avgContributors}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : selected ? (
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="text-5xl">{selected.icon}</span>
                <div>
                  <h3 className="text-2xl font-bold text-white">{selected.name}</h3>
                  <div className="text-sm text-[#8b949e]">Overall Score: {selected.overallScore.toFixed(2)}</div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">Popularity Score</span>
                    <span className="text-sm font-mono text-[#58a6ff]">{selected.popularityScore.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-[#21262d] h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-[#58a6ff]" style={{ width: `${selected.popularityScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">Activity Score</span>
                    <span className="text-sm font-mono text-[#3fb950]">{selected.activityScore.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-[#21262d] h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-[#3fb950]" style={{ width: `${selected.activityScore}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-white">Health Score</span>
                    <span className="text-sm font-mono text-[#bc8cff]">{selected.healthScore.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-[#21262d] h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-[#bc8cff]" style={{ width: `${selected.healthScore}%` }} />
                  </div>
                </div>
              </div>

              {/* Radar Chart */}
              <div className="mb-6">
                <h4 className="text-sm font-semibold text-white mb-3">Dimensional Analysis</h4>
                <RadarChart
                  data={[
                    {
                      name: selected.name,
                      values: [selected.popularityScore, selected.activityScore, selected.healthScore],
                      color: selected.color
                    }
                  ]}
                  labels={['Popularity', 'Activity', 'Health']}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0d1117] p-4 rounded">
                  <div className="text-2xl font-bold text-[#58a6ff] mb-1">{selected.avgStars.toLocaleString()}</div>
                  <div className="text-xs text-[#8b949e]">Avg Stars</div>
                </div>
                <div className="bg-[#0d1117] p-4 rounded">
                  <div className="text-2xl font-bold text-[#3fb950] mb-1">{selected.avgForks.toLocaleString()}</div>
                  <div className="text-xs text-[#8b949e]">Avg Forks</div>
                </div>
                <div className="bg-[#0d1117] p-4 rounded">
                  <div className="text-2xl font-bold text-[#bc8cff] mb-1">{selected.avgContributors}</div>
                  <div className="text-xs text-[#8b949e]">Avg Contributors</div>
                </div>
                <div className="bg-[#0d1117] p-4 rounded">
                  <div className="text-2xl font-bold text-[#f0883e] mb-1">{selected.avgCommits.toLocaleString()}</div>
                  <div className="text-xs text-[#8b949e]">Avg Commits</div>
                </div>
                <div className="bg-[#0d1117] p-4 rounded">
                  <div className="text-2xl font-bold text-[#ffd700] mb-1">{selected.enterpriseReadiness}%</div>
                  <div className="text-xs text-[#8b949e]">Enterprise Ready</div>
                </div>
                <div className="bg-[#0d1117] p-4 rounded">
                  <div className="text-2xl font-bold text-[#ff6b6b] mb-1">{selected.growthSignal.toFixed(2)}</div>
                  <div className="text-xs text-[#8b949e]">Growth Signal</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-center">
              <div>
                <div className="text-6xl mb-4">🔍</div>
                <div className="text-xl font-semibold text-white mb-2">Select a Language</div>
                <div className="text-sm text-[#8b949e]">Click on any language from the list to view detailed metrics</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Animated Comparison Section */}
      {selectedLanguages.length > 0 && (
        <div className="mt-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-[#ffd700]" />
            <h3 className="text-xl font-bold text-white">
              {selectedLanguages.length === 1 ? 'Compare with Others' : `Comparing ${selectedLanguages.length} Languages`}
            </h3>
          </div>
          {selectedLanguages.length === 1 ? (
            <AnimatedComparison selectedLanguages={[selectedLanguages[0], ...languageData.filter(l => !selectedLanguages.includes(l.name)).slice(0, 4).map(l => l.name)]} />
          ) : (
            <AnimatedComparison selectedLanguages={selectedLanguages} />
          )}
        </div>
      )}
    </div>
  );
}
