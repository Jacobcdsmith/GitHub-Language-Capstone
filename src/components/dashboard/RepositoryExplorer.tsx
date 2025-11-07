import { useMemo, useState } from "react";
import { Database, Filter, Search, ChevronDown, ChevronUp, ExternalLink, Star, GitFork, Users, TrendingUp } from "lucide-react";
import { topRepositories, languageData } from "@/data/analysisData";

const languages = languageData.map((lang) => lang.name);

export default function RepositoryExplorer() {
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
  }, [searchTerm, selectedLanguage]);

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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                      <div className="bg-[var(--bg-surface)] p-4 rounded-lg border border-[var(--border-default)]">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="w-4 h-4 text-[#ffd700]" />
                          <span className="text-xs font-semibold text-[var(--text-secondary)]">Stars</span>
                        </div>
                        <div className="text-2xl font-bold text-[var(--text-primary)]">
                          {repo.stars.toLocaleString()}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] mt-1">
                          Community popularity
                        </div>
                      </div>
                      
                      <div className="bg-[var(--bg-surface)] p-4 rounded-lg border border-[var(--border-default)]">
                        <div className="flex items-center gap-2 mb-2">
                          <GitFork className="w-4 h-4 text-[#58a6ff]" />
                          <span className="text-xs font-semibold text-[var(--text-secondary)]">Forks</span>
                        </div>
                        <div className="text-2xl font-bold text-[var(--text-primary)]">
                          {repo.forks.toLocaleString()}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] mt-1">
                          Active derivatives
                        </div>
                      </div>
                      
                      <div className="bg-[var(--bg-surface)] p-4 rounded-lg border border-[var(--border-default)]">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="w-4 h-4 text-[#3fb950]" />
                          <span className="text-xs font-semibold text-[var(--text-secondary)]">Contributors</span>
                        </div>
                        <div className="text-2xl font-bold text-[var(--text-primary)]">
                          {repo.contributors.toLocaleString()}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] mt-1">
                          Active developers
                        </div>
                      </div>
                      
                      <div className="bg-[var(--bg-surface)] p-4 rounded-lg border border-[var(--border-default)]">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="w-4 h-4 text-[#bc8cff]" />
                          <span className="text-xs font-semibold text-[var(--text-secondary)]">Growth Signal</span>
                        </div>
                        <div className="text-2xl font-bold text-[var(--text-primary)]">
                          {(repo.growth * 100).toFixed(0)}%
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] mt-1">
                          Growth trajectory
                        </div>
                      </div>
                    </div>
                    
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
