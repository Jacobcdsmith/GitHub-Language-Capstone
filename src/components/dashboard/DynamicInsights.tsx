import { useState, useEffect } from "react";
import { languageData } from "@/data/analysisData";
import { Sparkles, TrendingUp, Award, Zap } from "lucide-react";

interface DynamicInsightsProps {
  selectedLanguages?: string[];
  filterCriteria?: {
    minScore?: number;
    sortBy?: string;
  };
}

export default function DynamicInsights({ selectedLanguages = [], filterCriteria = {} }: DynamicInsightsProps) {
  const [insights, setInsights] = useState<Array<{
    title: string;
    description: string;
    icon: any;
    color: string;
  }>>([]);

  useEffect(() => {
    const newInsights = [];
    const dataToAnalyze = selectedLanguages.length > 0
      ? languageData.filter(l => selectedLanguages.includes(l.name))
      : languageData;

    // Top performer
    const topLang = dataToAnalyze.reduce((max, lang) => 
      lang.overallScore > max.overallScore ? lang : max
    );
    newInsights.push({
      title: `${topLang.name} Leads ${selectedLanguages.length > 0 ? 'Selection' : 'Overall'}`,
      description: `Achieves highest overall score (${topLang.overallScore.toFixed(1)}) with balanced strength across all dimensions.`,
      icon: Award,
      color: topLang.color
    });

    // Most active
    const mostActive = dataToAnalyze.reduce((max, lang) =>
      lang.activityScore > max.activityScore ? lang : max
    );
    newInsights.push({
      title: `${mostActive.name} Most Active`,
      description: `Dominates activity metrics with ${mostActive.avgContributors} avg contributors and ${mostActive.activityScore.toFixed(1)} activity score.`,
      icon: Zap,
      color: '#3fb950'
    });

    // Most popular
    const mostPopular = dataToAnalyze.reduce((max, lang) =>
      lang.popularityScore > max.popularityScore ? lang : max
    );
    newInsights.push({
      title: `${mostPopular.name} Most Popular`,
      description: `Leads in community adoption with ${mostPopular.avgStars.toLocaleString()} average stars per repository.`,
      icon: TrendingUp,
      color: '#58a6ff'
    });

    // Enterprise ready
    const enterpriseReady = dataToAnalyze.filter(l => l.healthScore > 90);
    if (enterpriseReady.length > 0) {
      newInsights.push({
        title: `${enterpriseReady.length} Enterprise-Ready ${enterpriseReady.length === 1 ? 'Language' : 'Languages'}`,
        description: `${enterpriseReady.map(l => l.name).join(', ')} achieve 90+ health scores with complete documentation and governance.`,
        icon: Sparkles,
        color: '#bc8cff'
      });
    }

    // Growth potential
    if (selectedLanguages.length === 0) {
      const growthLangs = dataToAnalyze.filter(l => 
        l.activityScore > 60 && l.popularityScore < 50
      );
      if (growthLangs.length > 0) {
        newInsights.push({
          title: 'High Growth Potential',
          description: `${growthLangs.map(l => l.name).join(', ')} show strong activity despite moderate popularity—watch for rapid adoption.`,
          icon: TrendingUp,
          color: '#ffd700'
        });
      }
    }

    // Comparison insights for multi-select
    if (selectedLanguages.length > 1) {
      const scores = dataToAnalyze.map(l => l.overallScore);
      const range = Math.max(...scores) - Math.min(...scores);
      newInsights.push({
        title: `Score Range: ${range.toFixed(1)} Points`,
        description: `Selected languages span ${range.toFixed(1)} points in overall score, ${range < 10 ? 'showing similar' : 'revealing significant'} performance differences.`,
        icon: Sparkles,
        color: '#f0883e'
      });
    }

    setInsights(newInsights);
  }, [selectedLanguages, filterCriteria]);

  return (
    <div className="bg-[#161b22] border border-[#21262d] p-6 rounded-lg">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-[#ffd700]" />
        <h3 className="text-xl font-bold text-white">Dynamic Insights</h3>
        {selectedLanguages.length > 0 && (
          <span className="text-xs bg-[#58a6ff] text-white px-2 py-1 rounded-full">
            Based on {selectedLanguages.length} selected
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div
              key={index}
              className="bg-[#0d1117] p-4 rounded border-l-4 transition-all hover:scale-105"
              style={{ borderColor: insight.color }}
            >
              <div className="flex items-start gap-3">
                <div
                  className="p-2 rounded mt-1"
                  style={{ backgroundColor: `${insight.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: insight.color }} />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white mb-1">{insight.title}</h4>
                  <p className="text-sm text-[#c9d1d9]">{insight.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedLanguages.length === 0 && (
        <div className="mt-4 p-3 bg-[#0d1117] rounded border border-[#30363d]">
          <p className="text-xs text-[#8b949e] text-center">
            💡 Select languages in the Language Explorer to see personalized insights
          </p>
        </div>
      )}
    </div>
  );
}

