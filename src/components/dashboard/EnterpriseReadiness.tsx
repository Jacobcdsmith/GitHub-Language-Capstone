import { Shield, FileText, CheckCircle2, Building2, ClipboardList, ArrowUpDown } from "lucide-react";
import { languageData, healthIndicators } from "@/data/analysisData";
import { useState, useMemo } from "react";

type SortField = "name" | "healthScore" | "enterpriseReadiness" | "avgContributors" | "avgStars";
type SortOrder = "asc" | "desc";

export default function EnterpriseReadiness() {
  const [sortField, setSortField] = useState<SortField>("healthScore");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

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
              </tr>
            </thead>
            <tbody className="text-[var(--text-primary)]">
              {enterpriseLeaders.map((lang) => (
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-[#161b22] border border-[#21262d] rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <ClipboardList className="w-6 h-6 text-[#ffd700]" />
          <h3 className="text-xl font-bold text-white">Health Indicator Impact</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {healthIndicators.map((indicator) => (
            <div key={indicator.indicator} className="bg-[#0d1117] p-4 rounded border border-[#21262d]">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-white">{indicator.indicator}</span>
                <span className="text-sm font-mono text-[#58a6ff]">+{indicator.impact.toFixed(1)}</span>
              </div>
              <p className="text-xs text-[#8b949e]">{indicator.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
