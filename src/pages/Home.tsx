import { Link } from "wouter";
import { BarChart3, ArrowRight, TrendingUp, Code2, Shield, Boxes } from "lucide-react";
import ThemeToggle from "@/components/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg-primary)] via-[var(--bg-surface)] to-[var(--bg-primary)]">
      <div className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-4 mb-6">
            <BarChart3 className="w-16 h-16 text-[#58a6ff]" />
            <h1 className="text-6xl font-bold text-[var(--text-primary)]">
              GitHub Language Analytics
            </h1>
          </div>
          <p className="text-2xl text-[var(--text-secondary)] mb-8 max-w-3xl mx-auto">
            Comprehensive analysis of 1,200 repositories across 12 programming languages
          </p>
          <Link href="/dashboard">
            <button className="inline-flex items-center gap-3 px-8 py-4 bg-[#58a6ff] hover:bg-[#4a9aef] text-white text-lg font-semibold rounded-lg transition-colors shadow-lg">
              <span>Explore Dashboard</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] p-8 rounded-lg text-center">
            <div className="text-5xl font-bold text-[#58a6ff] mb-3">1,200</div>
            <div className="text-lg text-[var(--text-primary)] font-semibold mb-2">Repositories Analyzed</div>
            <div className="text-sm text-[var(--text-secondary)]">Comprehensive dataset coverage</div>
          </div>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] p-8 rounded-lg text-center">
            <div className="text-5xl font-bold text-[#3fb950] mb-3">12</div>
            <div className="text-lg text-[var(--text-primary)] font-semibold mb-2">Programming Languages</div>
            <div className="text-sm text-[var(--text-secondary)]">From Rust to Swift</div>
          </div>
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] p-8 rounded-lg text-center">
            <div className="text-5xl font-bold text-[#bc8cff] mb-3">3</div>
            <div className="text-lg text-[var(--text-primary)] font-semibold mb-2">Analysis Dimensions</div>
            <div className="text-sm text-[var(--text-secondary)]">Popularity, Activity, Health</div>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#58a6ff]/10 rounded">
                <BarChart3 className="w-6 h-6 text-[#58a6ff]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Overview Dashboard</h3>
            </div>
            <p className="text-[var(--text-secondary)]">
              High-level metrics, top languages, and key insights at a glance
            </p>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#3fb950]/10 rounded">
                <Code2 className="w-6 h-6 text-[#3fb950]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Language Explorer</h3>
            </div>
            <p className="text-[var(--text-secondary)]">
              Interactive filtering, search, radar charts, and animated comparisons
            </p>
          </div>

          <div className="bg-[var(--bg-surface)] border-2 border-[#58a6ff] p-6 rounded-lg shadow-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#58a6ff]/20 rounded">
                <Boxes className="w-6 h-6 text-[#58a6ff]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] flex items-center gap-2">
                3D Visualizations
                <span className="text-xs bg-[#58a6ff] text-white px-2 py-1 rounded-full">NEW</span>
              </h3>
            </div>
            <p className="text-[var(--text-primary)]">
              6 interactive visualizations: enhanced 3D scatter, sunburst, treemap, network graphs, parallel coordinates, and animation
            </p>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#bc8cff]/10 rounded">
                <TrendingUp className="w-6 h-6 text-[#bc8cff]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Correlation Analysis</h3>
            </div>
            <p className="text-[var(--text-secondary)]">
              Statistical relationships between metrics and overall success
            </p>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#ffd700]/10 rounded">
                <Shield className="w-6 h-6 text-[#ffd700]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Enterprise Readiness</h3>
            </div>
            <p className="text-[var(--text-secondary)]">
              Health indicators and enterprise adoption metrics
            </p>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#f0883e]/10 rounded">
                <BarChart3 className="w-6 h-6 text-[#f0883e]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Repository Explorer</h3>
            </div>
            <p className="text-[var(--text-secondary)]">
              Browse top repositories with filtering by language
            </p>
          </div>

          <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] p-6 rounded-lg">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[#58a6ff]/10 rounded">
                <TrendingUp className="w-6 h-6 text-[#58a6ff]" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Interactive Navigation</h3>
            </div>
            <p className="text-[var(--text-secondary)]">
              Seamless sidebar navigation between all analysis sections
            </p>
          </div>
        </div>

        {/* Key Findings */}
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] p-8 rounded-lg mb-16">
          <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-6 text-center">Key Findings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[var(--bg-hover)] p-6 rounded-lg border-l-4 border-[#CE422B]">
              <div className="text-2xl font-bold text-[#CE422B] mb-2">Rust Leads Overall</div>
              <p className="text-[var(--text-primary)]">
                Rust achieves the highest overall score (49.4) with balanced strength across all dimensions
              </p>
            </div>
            <div className="bg-[var(--bg-hover)] p-6 rounded-lg border-l-4 border-[#3178C6]">
              <div className="text-2xl font-bold text-[#3178C6] mb-2">TypeScript Most Active</div>
              <p className="text-[var(--text-primary)]">
                TypeScript dominates activity metrics with 311 avg contributors and 69.4 activity score
              </p>
            </div>
            <div className="bg-[var(--bg-hover)] p-6 rounded-lg border-l-4 border-[#3fb950]">
              <div className="text-2xl font-bold text-[#3fb950] mb-2">Activity Predicts Success</div>
              <p className="text-[var(--text-primary)]">
                Activity metrics show strongest correlation (r=0.85) with overall success, outperforming popularity
              </p>
            </div>
            <div className="bg-[var(--bg-hover)] p-6 rounded-lg border-l-4 border-[#bc8cff]">
              <div className="text-2xl font-bold text-[#bc8cff] mb-2">Health Indicators Matter</div>
              <p className="text-[var(--text-primary)]">
                License, contributing guidelines, and CoC each add 11-13 points to overall scores
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/dashboard">
            <button className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#58a6ff] to-[#bc8cff] hover:from-[#4a9aef] hover:to-[#a87ce6] text-white text-xl font-bold rounded-lg transition-all shadow-2xl">
              <span>Launch Interactive Dashboard</span>
              <ArrowRight className="w-6 h-6" />
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

