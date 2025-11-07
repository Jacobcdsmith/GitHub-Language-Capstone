import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";

const visualizations = [
  {
    id: "enhanced_3d",
    title: "Enhanced 3D Language Ecosystem",
    description: "Interactive 3D scatter plot showing languages across Popularity, Activity, and Health dimensions",
    file: "enhanced_3d_language_analysis.html",
    color: "#58a6ff"
  },
  {
    id: "parallel",
    title: "Parallel Coordinates - Top 100",
    description: "Multi-dimensional view of top 100 repositories across all metrics",
    file: "parallel_coordinates_top100.html",
    color: "#bc8cff"
  },
  {
    id: "treemap",
    title: "Repository Treemap",
    description: "Hierarchical treemap of top repositories sized by stars",
    file: "treemap_top_repos.html",
    color: "#f0883e"
  },
  {
    id: "animated",
    title: "Animated Language Evolution",
    description: "Time-series animation showing language growth and evolution",
    file: "animated_language_evolution.html",
    color: "#ffd700"
  },
  {
    id: "mesh",
    title: "Language Mesh Network",
    description: "Network graph showing relationships and similarities between languages",
    file: "language_mesh_network.html",
    color: "#ff6b6b"
  },
  {
    id: "sunburst",
    title: "Language Hierarchy Sunburst",
    description: "Hierarchy of languages grouped by ecosystem classification",
    file: "language_hierarchy_sunburst.html",
    color: "#4ecdc4"
  }
];

export default function Visualizations3D() {
  const [selectedViz, setSelectedViz] = useState(visualizations[0]);
  const [isFullscreen, setIsFullscreen] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-white mb-2">Interactive Visualizations</h2>
        <p className="text-[#8b949e]">
          Explore multi-dimensional data with interactive 3D charts and advanced visualizations
        </p>
      </div>

      {/* Visualization Selector */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {visualizations.map((viz) => (
          <button
            key={viz.id}
            onClick={() => setSelectedViz(viz)}
            className={`p-4 rounded-lg transition-all ${
              selectedViz.id === viz.id
                ? "bg-black border-2 scale-105"
                : "bg-black border border-[#21262d] hover:border-[#30363d]"
            }`}
            style={{
              borderColor: selectedViz.id === viz.id ? viz.color : undefined
            }}
          >
            <div
              className="w-3 h-3 rounded-full mb-2 mx-auto"
              style={{ backgroundColor: viz.color }}
            />
            <div className="text-sm font-semibold text-white text-center">
              {viz.title}
            </div>
          </button>
        ))}
      </div>

      {/* Main Visualization Display */}
      <div className="bg-black border border-[#21262d] rounded-lg overflow-hidden">
        <div className="p-4 border-b border-[#21262d] flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">{selectedViz.title}</h3>
            <p className="text-sm text-[#8b949e]">{selectedViz.description}</p>
          </div>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 hover:bg-[#21262d] rounded transition-colors"
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5 text-[#8b949e]" />
            ) : (
              <Maximize2 className="w-5 h-5 text-[#8b949e]" />
            )}
          </button>
        </div>
        <div
          className={`bg-black ${
            isFullscreen ? "h-[calc(100vh-250px)]" : "h-[600px]"
          }`}
        >
          <iframe
            src={`/visualizations/${selectedViz.file}`}
            className="w-full h-full border-none"
            title={selectedViz.title}
            style={{ backgroundColor: "#000" }}
          />
        </div>
      </div>

      {/* Visualization Grid - Quick Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-black border border-[#21262d] p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Interaction Tips</h3>
          <div className="space-y-3 text-sm text-[#c9d1d9]">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#58a6ff] mt-1.5" />
              <div>
                <span className="font-semibold text-white">Rotate:</span> Click and drag to rotate 3D visualizations
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#3fb950] mt-1.5" />
              <div>
                <span className="font-semibold text-white">Zoom:</span> Scroll or pinch to zoom in/out
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#bc8cff] mt-1.5" />
              <div>
                <span className="font-semibold text-white">Pan:</span> Shift + drag to pan the view
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#f0883e] mt-1.5" />
              <div>
                <span className="font-semibold text-white">Hover:</span> Hover over data points for detailed information
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 rounded-full bg-[#ffd700] mt-1.5" />
              <div>
                <span className="font-semibold text-white">Reset:</span> Double-click to reset view
              </div>
            </div>
          </div>
        </div>

        <div className="bg-black border border-[#21262d] p-6 rounded-lg">
          <h3 className="text-xl font-bold text-white mb-4">Visualization Insights</h3>
          <div className="space-y-3">
            <div className="bg-black p-4 rounded border-l-4 border-[#58a6ff]">
              <div className="font-semibold text-white mb-1">Clustering Patterns</div>
              <div className="text-sm text-[#c9d1d9]">
                Modern languages (Rust, TypeScript, Go) cluster in high-activity regions
              </div>
            </div>
            <div className="bg-black p-4 rounded border-l-4 border-[#3fb950]">
              <div className="font-semibold text-white mb-1">Dimensional Analysis</div>
              <div className="text-sm text-[#c9d1d9]">
                3D views reveal relationships invisible in 2D projections
              </div>
            </div>
            <div className="bg-black p-4 rounded border-l-4 border-[#bc8cff]">
              <div className="font-semibold text-white mb-1">Temporal Evolution</div>
              <div className="text-sm text-[#c9d1d9]">
                Animated charts show language adoption and growth trajectories
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

