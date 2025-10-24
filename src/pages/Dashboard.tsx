import { useState } from "react";
import { Link } from "wouter";
import { BarChart3, Code2, TrendingUp, Shield, Database, Home, Boxes, BookOpen } from "lucide-react";
import Overview from "@/components/dashboard/Overview";
import LanguageExplorer from "@/components/dashboard/LanguageExplorer";
import CorrelationAnalysis from "@/components/dashboard/CorrelationAnalysis";
import EnterpriseReadiness from "@/components/dashboard/EnterpriseReadiness";
import RepositoryExplorer from "@/components/dashboard/RepositoryExplorer";
import Visualizations3D from "@/components/dashboard/Visualizations3D";
import HowToUse from "@/components/dashboard/HowToUse";
import ThemeToggle from "@/components/ThemeToggle";

const navigation = [
  { name: "Overview", icon: Home, component: "overview" },
  { name: "Language Explorer", icon: Code2, component: "languages" },
  { name: "3D Visualizations", icon: Boxes, component: "visualizations" },
  { name: "Correlation Analysis", icon: TrendingUp, component: "correlation" },
  { name: "Enterprise Readiness", icon: Shield, component: "enterprise" },
  { name: "Repository Explorer", icon: Database, component: "repositories" },
  { name: "How to Use", icon: BookOpen, component: "guide" }
];

export default function Dashboard() {
  const [activeSection, setActiveSection] = useState("overview");

  const renderSection = () => {
    switch (activeSection) {
      case "overview":
        return <Overview />;
      case "languages":
        return <LanguageExplorer onSelectionChange={() => {}} />;
      case "correlation":
        return <CorrelationAnalysis />;
      case "enterprise":
        return <EnterpriseReadiness />;
      case "repositories":
        return <RepositoryExplorer />;
      case "visualizations":
        return <Visualizations3D />;
      case "guide":
        return <HowToUse />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* Top Header */}
      <header className="bg-[var(--bg-surface)] border-b border-[var(--border-default)]">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <BarChart3 className="w-8 h-8 text-[#58a6ff]" />
            <div>
              <h1 className="text-2xl font-bold text-[var(--text-primary)]">GitHub Language Analytics</h1>
              <p className="text-sm text-[var(--text-secondary)]">Comprehensive Repository Analysis Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link href="/">
              <button className="px-4 py-2 bg-[var(--bg-hover)] hover:bg-[var(--border-hover)] border border-[var(--border-default)] rounded text-sm font-medium transition-colors">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-[var(--bg-surface)] border-r border-[var(--border-default)] min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.component;
              return (
                <button
                  key={item.component}
                  onClick={() => setActiveSection(item.component)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded transition-colors ${
                    isActive
                      ? "bg-[#58a6ff] text-white"
                      : "text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>

          {/* Stats Summary in Sidebar */}
          <div className="p-4 mt-6 border-t border-[var(--border-default)]">
            <h3 className="text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wider mb-3">
              Dataset Summary
            </h3>
            <div className="space-y-3">
              <div>
                <div className="text-2xl font-bold text-[#58a6ff]">1,200</div>
                <div className="text-xs text-[var(--text-secondary)]">Repositories</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#3fb950]">12</div>
                <div className="text-xs text-[var(--text-secondary)]">Languages</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#bc8cff]">3</div>
                <div className="text-xs text-[var(--text-secondary)]">Dimensions</div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}

