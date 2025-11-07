import { Shield, FileText, CheckCircle2, Building2, ClipboardList, ArrowUpDown, BarChart3, TrendingUp, ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { languageData, healthIndicators, topRepositories } from "@/data/analysisData";
import { useState, useMemo } from "react";

type SortField = "name" | "healthScore" | "enterpriseReadiness" | "avgContributors" | "avgStars";
type SortOrder = "asc" | "desc";

export default function EnterpriseReadiness() {
  const [sortField, setSortField] = useState<SortField>("healthScore");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [expandedLanguage, setExpandedLanguage] = useState<string | null>(null);

  const enterpriseLeaders = useMemo(() => {
    const sorted = [...languageData].sort((a, b) => {
      let aVal: number | string, bVal: number | string;
      
      switch (sortField) {
        case "name":
          aVal = a.name;
          bVal = b.name;
          break;
        case "healthScore":
          aVal = a.healthScore;
          bVal = b.healthScore;
          break;
        case "enterpriseReadiness":
          aVal = a.enterpriseReadiness;
          bVal = b.enterpriseReadiness;
          break;
        case "avgContributors":
          aVal = a.avgContributors;
          bVal = b.avgContributors;
          break;
        case "avgStars":
          aVal = a.avgStars;
          bVal = b.avgStars;
          break;
        default:
          aVal = a.healthScore;
          bVal = b.healthScore;
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortOrder === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      
      return sortOrder === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
    });

    return sorted.slice(0, 6);
  }, [sortField, sortOrder]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      onClick={() => handleSort(field)}
      className="flex items-center gap-1 hover:text-[var(--text-primary)] transition-colors"
    >
      {children}
      <ArrowUpDown className={`w-3 h-3 ${sortField === field ? "text-[#58a6ff]" : "opacity-40"}`} />
    </button>
  );

  const readinessSummary = {
    withLicense: languageData.filter((lang) => lang.healthScore >= 60).length,
    highGovernance: languageData.filter((lang) => lang.healthScore >= 65).length,
    enterpriseReady: languageData.filter((lang) => lang.enterpriseReadiness >= 30).length
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Enterprise Readiness</h2>
        <p className="text-[var(--text-secondary)]">
          Governance, sustainability, and compliance indicators for production usage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-[#3fb950]" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Enterprise Ready</h3>
          </div>
          <div className="text-4xl font-bold text-[#3fb950] mb-2">{readinessSummary.enterpriseReady}</div>
          <div className="text-sm text-[var(--text-secondary)]">
            languages score 30+ on enterprise readiness (Rust, Go, TypeScript lead)
          </div>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="w-6 h-6 text-[#58a6ff]" />
            <h3 className="text-lg font-semibold text-[var(--text-primary)]">Strong Governance</h3>
          </div>
          <div className="text-4xl font-bold text-[#58a6ff] mb-2">{readinessSummary.highGovernance}</div>
          <div className="text-sm text-[var(--text-secondary)]">
            languages exceed 65 health score with mature documentation & community codes
          </div>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] p-6 rounded-lg">
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-6 h-6 text-[#f0883e]" />
            <h3 className="text-lg font-semibold text-white">License Compliance</h3>
          </div>
          <div className="text-4xl font-bold text-[#f0883e] mb-2">{readinessSummary.withLicense}</div>
          <div className="text-sm text-[#8b949e]">
            languages achieve 60+ health score, indicating standard OSS licensing coverage
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="w-6 h-6 text-[#bc8cff]" />
          <h3 className="text-xl font-bold text-[var(--text-primary)]">Top Enterprise-Ready Languages</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-[var(--text-secondary)]">
              <tr className="border-b border-[var(--border-default)]">
                <th className="py-3"><SortButton field="name">Language</SortButton></th>
                <th className="py-3"><SortButton field="healthScore">Health Score</SortButton></th>
                <th className="py-3"><SortButton field="enterpriseReadiness">Enterprise Readiness</SortButton></th>
                <th className="py-3"><SortButton field="avgContributors">Avg Contributors</SortButton></th>
                <th className="py-3"><SortButton field="avgStars">Avg Stars</SortButton></th>
                <th className="py-3 text-center">Repos</th>
              </tr>
            </thead>
            <tbody className="text-[var(--text-primary)]">
              {enterpriseLeaders.map((lang) => {
                const langRepos = topRepositories.filter(repo => repo.language === lang.name);
                const isExpanded = expandedLanguage === lang.name;
                
                return (
                  <>
                    <tr key={lang.name} className="border-b border-[var(--border-default)]/60 last:border-0 hover:bg-[var(--bg-hover)] transition-colors">
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{lang.icon}</span>
                          <span className="font-semibold text-[var(--text-primary)]">{lang.name}</span>
                        </div>
                      </td>
                      <td className="py-3 font-mono text-[#3fb950]">{lang.healthScore.toFixed(1)}</td>
                      <td className="py-3 font-mono text-[#58a6ff]">{lang.enterpriseReadiness}%</td>
                      <td className="py-3 font-mono">{lang.avgContributors}</td>
                      <td className="py-3 font-mono">{lang.avgStars.toLocaleString()}</td>
                      <td className="py-3 text-center">
                        {langRepos.length > 0 && (
                          <button
                            onClick={() => setExpandedLanguage(isExpanded ? null : lang.name)}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-[#58a6ff] bg-opacity-20 text-[#58a6ff] rounded hover:bg-opacity-30 transition-colors"
                          >
                            <span className="text-xs font-semibold">{langRepos.length}</span>
                            {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </button>
                        )}
                      </td>
                    </tr>
                    
                    {isExpanded && langRepos.length > 0 && (
                      <tr>
                        <td colSpan={6} className="py-0">
                          <div className="bg-[var(--bg-canvas)] p-4 border-t border-[var(--border-default)]">
                            <div className="space-y-2">
                              {langRepos.map((repo) => (
                                <div
                                  key={repo.name}
                                  className="flex items-center justify-between p-3 bg-[var(--bg-surface)] border border-[var(--border-default)] rounded hover:border-[#58a6ff] transition-colors"
                                >
                                  <div className="flex-1">
                                    <div className="font-semibold text-[var(--text-primary)] mb-1">
                                      {repo.name}
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)]">
                                      <span>⭐ {repo.stars.toLocaleString()}</span>
                                      <span>🍴 {repo.forks.toLocaleString()}</span>
                                      <span>👥 {repo.contributors.toLocaleString()}</span>
                                      <span className="text-[#3fb950]">📈 {(repo.growth * 100).toFixed(0)}%</span>
                                    </div>
                                  </div>
                                  <a
                                    href={`https://github.com/${repo.name}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1 px-3 py-1.5 bg-[#238636] hover:bg-[#2ea043] text-white rounded text-xs font-semibold transition-colors"
                                  >
                                    <ExternalLink className="w-3 h-3" />
                                    View
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <ClipboardList className="w-6 h-6 text-[#ffd700]" />
          <h3 className="text-xl font-bold text-[var(--text-primary)]">Health Indicator Impact</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {healthIndicators.map((indicator) => (
            <div key={indicator.indicator} className="bg-[var(--bg-canvas)] p-4 rounded border border-[var(--border-default)]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-[var(--text-primary)]">{indicator.indicator}</span>
                <span className="text-sm font-mono text-[#58a6ff]">+{indicator.impact.toFixed(1)}</span>
              </div>
              <p className="text-xs text-[var(--text-secondary)]">{indicator.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-6 h-6 text-[#3fb950]" />
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Enterprise Readiness by Language</h3>
          </div>
          <div className="space-y-3">
            {[...languageData]
              .sort((a, b) => b.enterpriseReadiness - a.enterpriseReadiness)
              .slice(0, 8)
              .map((lang) => (
                <div key={lang.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{lang.icon}</span>
                      <span className="text-sm font-semibold text-[var(--text-primary)]">{lang.name}</span>
                    </div>
                    <span className="text-sm font-mono text-[#58a6ff]">{lang.enterpriseReadiness}%</span>
                  </div>
                  <div className="w-full bg-[var(--bg-canvas)] h-3 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-500 rounded-full"
                      style={{
                        width: `${lang.enterpriseReadiness}%`,
                        backgroundColor: lang.color
                      }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-6 h-6 text-[#bc8cff]" />
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Health Score Distribution</h3>
          </div>
          <div className="space-y-3">
            {[...languageData]
              .sort((a, b) => b.healthScore - a.healthScore)
              .slice(0, 8)
              .map((lang) => (
                <div key={lang.name}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{lang.icon}</span>
                      <span className="text-sm font-semibold text-[var(--text-primary)]">{lang.name}</span>
                    </div>
                    <span className="text-sm font-mono text-[#3fb950]">{lang.healthScore.toFixed(1)}</span>
                  </div>
                  <div className="w-full bg-[var(--bg-canvas)] h-3 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#3fb950] to-[#58a6ff] transition-all duration-500 rounded-full"
                      style={{ width: `${(lang.healthScore / 100) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-6">
          <Building2 className="w-6 h-6 text-[#f0883e]" />
          <h3 className="text-xl font-bold text-[var(--text-primary)]">Readiness Matrix: Health vs Enterprise Score</h3>
        </div>
        <div className="relative bg-[var(--bg-canvas)] p-8 rounded-lg" style={{ height: '400px' }}>
          {/* Grid lines */}
          <div className="absolute inset-8 grid grid-cols-4 grid-rows-4">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className="border border-[var(--border-default)] border-opacity-20" />
            ))}
          </div>
          
          {/* Axis labels */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-sm text-[var(--text-secondary)] font-semibold">
            Health Score →
          </div>
          <div className="absolute top-1/2 left-2 transform -translate-y-1/2 -rotate-90 text-sm text-[var(--text-secondary)] font-semibold">
            Enterprise Readiness →
          </div>
          
          {/* Data points */}
          {languageData.map((lang) => {
            const x = ((lang.healthScore - 50) / 20) * 100; // Scale 50-70 to 0-100%
            const y = 100 - (lang.enterpriseReadiness); // Invert Y for top-to-bottom
            
            return (
              <div
                key={lang.name}
                className="absolute group cursor-pointer transition-transform hover:scale-150"
                style={{
                  left: `calc(${Math.max(5, Math.min(95, x))}% + 2rem)`,
                  top: `calc(${Math.max(5, Math.min(95, y))}% + 2rem)`,
                  transform: 'translate(-50%, -50%)'
                }}
              >
                <div
                  className="w-4 h-4 rounded-full shadow-lg"
                  style={{ backgroundColor: lang.color }}
                />
                <div className="absolute left-1/2 top-full mt-2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-[var(--bg-surface)] border border-[var(--border-default)] px-3 py-2 rounded shadow-xl whitespace-nowrap z-10">
                  <div className="text-sm font-bold text-[var(--text-primary)] mb-1">{lang.icon} {lang.name}</div>
                  <div className="text-xs text-[var(--text-secondary)]">
                    Health: {lang.healthScore.toFixed(1)} | Enterprise: {lang.enterpriseReadiness}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="mt-4 text-sm text-[var(--text-secondary)] text-center">
          Languages in the top-right quadrant excel in both health and enterprise readiness
        </div>
      </div>
    </div>
  );
}
