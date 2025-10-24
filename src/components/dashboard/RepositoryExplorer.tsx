import { useMemo, useState } from "react";
import { Database, Filter, Search } from "lucide-react";
import { topRepositories, languageData } from "@/data/analysisData";

const languages = languageData.map((lang) => lang.name);

export default function RepositoryExplorer() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | "all">("all");

  const repositories = useMemo(() => {
    return topRepositories
      .filter((repo) =>
        selectedLanguage === "all" ? true : repo.language === selectedLanguage
      )
      .filter((repo) =>
        repo.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
  }, [searchTerm, selectedLanguage]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Repository Explorer</h2>
        <p className="text-[#8b949e]">Dive into exemplar repositories powering each ecosystem</p>
      </div>

      <div className="bg-[#161b22] border border-[#21262d] p-6 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b949e]" />
            <input
              type="text"
              placeholder="Search repositories..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0d1117] border border-[#30363d] rounded text-white placeholder-[#8b949e] focus:outline-none focus:border-[#58a6ff]"
            />
          </div>
          <div className="relative md:col-span-2">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8b949e]" />
            <select
              value={selectedLanguage}
              onChange={(event) => setSelectedLanguage(event.target.value as typeof selectedLanguage)}
              className="w-full pl-10 pr-4 py-2 bg-[#0d1117] border border-[#30363d] rounded text-white focus:outline-none focus:border-[#58a6ff]"
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

      <div className="bg-[#161b22] border border-[#21262d] rounded-lg">
        <div className="p-6 border-b border-[#21262d] flex items-center gap-3">
          <Database className="w-5 h-5 text-[#58a6ff]" />
          <div>
            <h3 className="text-xl font-bold text-white">Curated Repository Set</h3>
            <p className="text-sm text-[#8b949e]">
              Highlighting flagship projects with exceptional community traction
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-left text-[#8b949e]">
              <tr className="border-b border-[#21262d]">
                <th className="py-3 px-6">Repository</th>
                <th className="py-3 px-6">Language</th>
                <th className="py-3 px-6">Stars</th>
                <th className="py-3 px-6">Forks</th>
                <th className="py-3 px-6">Contributors</th>
                <th className="py-3 px-6">Growth Signal</th>
              </tr>
            </thead>
            <tbody className="text-[#c9d1d9]">
              {repositories.map((repo) => (
                <tr key={repo.name} className="border-b border-[#21262d]/60 last:border-0">
                  <td className="py-4 px-6">
                    <div>
                      <div className="font-semibold text-white">{repo.name}</div>
                      <div className="text-xs text-[#8b949e]">Flagship {repo.language} project</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 font-mono text-[#58a6ff]">{repo.language}</td>
                  <td className="py-4 px-6 font-mono">{repo.stars.toLocaleString()}</td>
                  <td className="py-4 px-6 font-mono">{repo.forks.toLocaleString()}</td>
                  <td className="py-4 px-6 font-mono">{repo.contributors.toLocaleString()}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <div className="w-full bg-[#21262d] h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#3fb950]"
                          style={{ width: `${repo.growth * 100}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-[#3fb950]">{(repo.growth * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
