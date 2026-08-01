import { useMemo, useState } from "react";
import { Database, Filter, Search, ChevronDown, ChevronUp, ExternalLink, Star, GitFork, Users, TrendingUp, AlertCircle, RefreshCw, GitPullRequest, Tag } from "lucide-react";
import { useAnalysisData } from "@/contexts/AnalysisDataContext";
import { useLiveRepoStats } from "@/hooks/useLiveRepoStats";
import { formatRelativeTime } from "@/lib/formatRelativeTime";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
}

function StatCard({ icon, label, value, hint }: StatCardProps) {
  return (
    <div className="bg-[var(--bg-surface)] p-4 rounded-lg border border-[var(--border-default)]">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs font-semibold text-[var(--text-secondary)]">{label}</span>
      </div>
      <div className="text-2xl font-bold text-[var(--text-primary)]">{value}</div>
      <div className="text-xs text-[var(--text-secondary)] mt-1">{hint}</div>
    </div>
  );
}

interface LiveStatsPanelProps {
  fullName: string;
  staticStars: number;
  staticForks: number;
  staticContributors: number;
  staticGrowth: number;
  openPullRequests: number;
  hasReleases: boolean;
  daysSinceLastRelease: number | null;
}

function formatReleaseRecency(hasReleases: boolean, daysSinceLastRelease: number | null): string {
  if (!hasReleases || daysSinceLastRelease === null) return "No releases";
  if (daysSinceLastRelease < 1) return "Today";
  if (daysSinceLastRelease < 30) return `${Math.round(daysSinceLastRelease)}d ago`;
  if (daysSinceLastRelease < 365) return `${Math.round(daysSinceLastRelease / 30)}mo ago`;
  return `${(daysSinceLastRelease / 365).toFixed(1)}y ago`;
}

function LiveStatsPanel({ fullName, staticStars, staticForks, staticContributors, staticGrowth, openPullRequests, hasReleases, daysSinceLastRelease }: LiveStatsPanelProps) {
  const { data, loading, error, rateLimited, refetch } = useLiveRepoStats(fullName);

  const stars = data?.stars ?? staticStars;
  const forks = data?.forks ?? staticForks;

  return (
    <>
      <div className="mb-4 text-xs">
        {data ? (
          <div className="flex items-center gap-2 text-[#3fb950]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3fb950] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#3fb950]" />
            </span>
            Live from GitHub &middot; updated {formatRelativeTime(data.updatedAt)}
          </div>
        ) : loading ? (
          <div className="flex items-center gap-2 text-[var(--text-secondary)]">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Fetching live data from GitHub&hellip;
          </div>
        ) : (
          <div className="flex items-center gap-2 text-[var(--text-muted)]">
            <span>
              {error ? (rateLimited ? "GitHub API rate limit reached" : "Live data unavailable") : "Live data"} &mdash; showing snapshot data
            </span>
            <button onClick={refetch} className="underline hover:text-[var(--text-secondary)]">
              retry
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        <StatCard
          icon={<Star className="w-4 h-4 text-[#ffd700]" />}
          label="Stars"
          value={stars.toLocaleString()}
          hint="Community popularity"
        />
        <StatCard
          icon={<GitFork className="w-4 h-4 text-[#58a6ff]" />}
          label="Forks"
          value={forks.toLocaleString()}
          hint="Active derivatives"
        />
        <StatCard
          icon={<Users className="w-4 h-4 text-[#3fb950]" />}
          label="Contributors"
          value={staticContributors.toLocaleString()}
          hint="Active developers"
        />
        {data ? (
          <StatCard
            icon={<AlertCircle className="w-4 h-4 text-[#f0883e]" />}
            label="Open Issues"
            value={data.openIssues.toLocaleString()}
            hint="Currently tracked on GitHub"
          />
        ) : (
          <StatCard
            icon={<TrendingUp className="w-4 h-4 text-[#bc8cff]" />}
            label="Growth Signal"
            value={`${(staticGrowth * 100).toFixed(0)}%`}
            hint="Growth trajectory"
          />
        )}
        <StatCard
          icon={<GitPullRequest className="w-4 h-4 text-[#3fb950]" />}
          label="Open Pull Requests"
          value={openPullRequests.toLocaleString()}
          hint="Real-world maintenance load"
        />
        <StatCard
          icon={<Tag className="w-4 h-4 text-[#f0883e]" />}
          label="Last Release"
          value={formatReleaseRecency(hasReleases, daysSinceLastRelease)}
          hint="Release cadence signal"
        />
      </div>
    </>
  );
}

export default function RepositoryExplorer() {
  const { topRepositories, languageData } = useAnalysisData();
  const languages = useMemo(() => languageData.map((lang) => lang.name), [languageData]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | "all">("all");
  const [expandedRepo, setExpandedRepo] = useState<string | null>(null);

  const repositories = useMemo(() => {
    return topRepositories
      .filter((repo) =>
        selectedLanguage === "all" ? true : repo.language === selectedLanguage
      )
      .filter((repo) =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [searchTerm, selectedLanguage, topRepositories]);

  const toggleExpand = (repoName: string) => {
    setExpandedRepo(expandedRepo === repoName ? null : repoName);
  };

  const getRepoUrl = (repoName: string) => {
    return `https://github.com/${repoName}`;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Repository Explorer</h2>
        <p className="text-[var(--text-secondary)]">Dive into exemplar repositories powering each ecosystem</p>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--bg-canvas)] border border-[var(--border-default)] rounded text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:border-[#58a6ff]"
            />
          </div>
          <div className="relative md:col-span-2">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-secondary)]" />
            <select
              value={selectedLanguage}
              onChange={(event) => setSelectedLanguage(event.target.value as typeof selectedLanguage)}
              className="w-full pl-10 pr-4 py-2 bg-[var(--bg-canvas)] border border-[var(--border-default)] rounded text-[var(--text-primary)] focus:outline-none focus:border-[#58a6ff]"
            >
              <option value="all">All languages</option>
              {languages.map((language) => (
                <option key={language} value={language}>
                  {language}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg">
        <div className="p-6 border-b border-[var(--border-default)] flex items-center gap-3">
          <Database className="w-5 h-5 text-[#58a6ff]" />
          <div>
            <h3 className="text-xl font-bold text-[var(--text-primary)]">Curated Repository Set</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Highlighting flagship projects with exceptional community traction
            </p>
          </div>
        </div>
        
        <div className="divide-y divide-[var(--border-default)]">
          {repositories.map((repo) => {
            const isExpanded = expandedRepo === repo.name;
            const repoUrl = getRepoUrl(repo.name);
            
            return (
              <div key={repo.name} className="transition-colors hover:bg-[var(--bg-hover)]">
                <button
                  onClick={() => toggleExpand(repo.name)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-1">
                      <div className="font-semibold text-[var(--text-primary)] flex items-center gap-2">
                        {repo.name}
                        <span className="text-xs font-mono px-2 py-0.5 bg-[#58a6ff] bg-opacity-20 text-[#58a6ff] rounded">
                          {repo.language}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] mt-1">
                        Flagship {repo.language} project
                      </div>
                    </div>
                    
                    <div className="hidden md:flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                        <Star className="w-4 h-4 text-[#ffd700]" />
                        <span>{repo.stars.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                        <GitFork className="w-4 h-4" />
                        <span>{repo.forks.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                        <Users className="w-4 h-4" />
                        <span>{repo.contributors.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="ml-4">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-[var(--text-secondary)]" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-[var(--text-secondary)]" />
                    )}
                  </div>
                </button>
                
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 bg-[var(--bg-canvas)] border-t border-[var(--border-default)]">
                    <LiveStatsPanel
                      fullName={repo.name}
                      staticStars={repo.stars}
                      staticForks={repo.forks}
                      staticContributors={repo.contributors}
                      staticGrowth={repo.growth}
                      openPullRequests={repo.openPullRequests}
                      hasReleases={repo.hasReleases}
                      daysSinceLastRelease={repo.daysSinceLastRelease}
                    />

                    <div className="flex flex-col sm:flex-row gap-3">
                      <a
                        href={repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-[#238636] hover:bg-[#2ea043] text-white rounded-lg font-semibold transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View on GitHub
                      </a>
                      
                      <a
                        href={`${repoUrl}/stargazers`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] border border-[var(--border-default)] rounded-lg font-semibold transition-colors"
                      >
                        <Star className="w-4 h-4" />
                        View Stargazers
                      </a>
                      
                      <a
                        href={`${repoUrl}/network/members`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 px-4 py-2 bg-[var(--bg-surface)] hover:bg-[var(--bg-hover)] text-[var(--text-primary)] border border-[var(--border-default)] rounded-lg font-semibold transition-colors"
                      >
                        <GitFork className="w-4 h-4" />
                        View Network
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
