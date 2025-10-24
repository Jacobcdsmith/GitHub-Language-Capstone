import { useState, useEffect } from "react";
import { languageData } from "@/data/analysisData";

interface AnimatedComparisonProps {
  selectedLanguages?: string[];
}

export default function AnimatedComparison({ selectedLanguages }: AnimatedComparisonProps) {
  const [animationProgress, setAnimationProgress] = useState(0);
  const languages = selectedLanguages 
    ? languageData.filter(l => selectedLanguages.includes(l.name))
    : languageData.slice(0, 6);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimationProgress(prev => (prev >= 100 ? 100 : prev + 2));
    }, 20);
    return () => clearInterval(timer);
  }, []);

  const metrics = [
    { key: 'popularityScore', label: 'Popularity', color: '#58a6ff' },
    { key: 'activityScore', label: 'Activity', color: '#3fb950' },
    { key: 'healthScore', label: 'Health', color: '#bc8cff' }
  ] as const;

  return (
    <div className="bg-[#161b22] border border-[#21262d] p-6 rounded-lg">
      <h3 className="text-xl font-bold text-white mb-6">Multi-Dimensional Comparison</h3>
      
      <div className="space-y-8">
        {metrics.map((metric) => (
          <div key={metric.key}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold text-white">{metric.label}</span>
              <span className="text-xs text-[#8b949e]">Score Range: 0-100</span>
            </div>
            
            <div className="space-y-2">
              {languages.map((lang) => {
                const score = lang[metric.key];
                const animatedWidth = (score * animationProgress) / 100;
                
                return (
                  <div key={lang.name} className="group">
                    <div className="flex items-center gap-3">
                      <div className="w-24 flex items-center gap-2">
                        <span className="text-lg">{lang.icon}</span>
                        <span className="text-xs font-medium text-[#8b949e] group-hover:text-white transition-colors">
                          {lang.name}
                        </span>
                      </div>
                      
                      <div className="flex-1 relative">
                        <div className="w-full bg-[#0d1117] h-6 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all duration-300 flex items-center justify-end pr-2"
                            style={{
                              width: `${animatedWidth}%`,
                              backgroundColor: metric.color,
                              boxShadow: `0 0 10px ${metric.color}40`
                            }}
                          >
                            {animationProgress === 100 && (
                              <span className="text-xs font-bold text-white">
                                {score.toFixed(1)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

