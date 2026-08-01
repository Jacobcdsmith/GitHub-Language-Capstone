import type { languageData as staticLanguageData } from "@/data/analysisData";
import { useAnalysisData } from "@/contexts/AnalysisDataContext";
import { TrendingUp, Activity, Heart, BarChart3 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type MetricType = 'activity' | 'health' | 'popularity';

function correlationDescriptor(r: number): { strength: string; direction: string } {
  const abs = Math.abs(r);
  const strength = abs >= 0.7 ? "Strong" : abs >= 0.4 ? "Moderate" : "Weak";
  const direction = r >= 0 ? "Positive" : "Negative";
  return { strength, direction };
}

type Language = (typeof staticLanguageData)[number];

type ScatterPoint = {
  language: Language;
  xValue: number;
  yValue: number;
  x: number;
  y: number;
};

const metricConfiguration: Record<MetricType, {
  label: string;
  accessor: (language: Language) => number;
  color: string;
  context: string;
}> = {
  activity: {
    label: "Activity Score",
    accessor: (language) => language.activityScore,
    color: "#3fb950",
    context: "Commit and contributor velocity"
  },
  health: {
    label: "Health Score",
    accessor: (language) => language.healthScore,
    color: "#bc8cff",
    context: "Project governance maturity"
  },
  popularity: {
    label: "Popularity Score",
    accessor: (language) => language.popularityScore,
    color: "#58a6ff",
    context: "Stars and adoption visibility"
  }
};

const chartDimensions = {
  width: 900,
  height: 560,
  padding: 80
};

const heatmapMetrics = [
  { key: "activity", label: "Activity", accent: "#3fb950" },
  { key: "health", label: "Health", accent: "#bc8cff" },
  { key: "popularity", label: "Popularity", accent: "#58a6ff" },
  { key: "overall", label: "Overall", accent: "#f0883e" }
] as const;

type HeatmapMetricKey = typeof heatmapMetrics[number]["key"];

type HeatmapCell = {
  row: typeof heatmapMetrics[number];
  column: typeof heatmapMetrics[number];
  value: number;
  x: number;
  y: number;
  size: number;
  rowIndex: number;
  columnIndex: number;
};

function buildHeatmapMatrix(correlationData: {
  activityVsOverall: { r: number };
  popularityVsOverall: { r: number };
  healthVsOverall: { r: number };
  activityVsHealth: { r: number };
  activityVsPopularity: { r: number };
  healthVsPopularity: { r: number };
}): Record<HeatmapMetricKey, Record<HeatmapMetricKey, number>> {
  return {
    activity: {
      activity: 1.0,
      health: correlationData.activityVsHealth.r,
      popularity: correlationData.activityVsPopularity.r,
      overall: correlationData.activityVsOverall.r
    },
    health: {
      activity: correlationData.activityVsHealth.r,
      health: 1.0,
      popularity: correlationData.healthVsPopularity.r,
      overall: correlationData.healthVsOverall.r
    },
    popularity: {
      activity: correlationData.activityVsPopularity.r,
      health: correlationData.healthVsPopularity.r,
      popularity: 1.0,
      overall: correlationData.popularityVsOverall.r
    },
    overall: {
      activity: correlationData.activityVsOverall.r,
      health: correlationData.healthVsOverall.r,
      popularity: correlationData.popularityVsOverall.r,
      overall: 1.0
    }
  };
}

const getStrengthLabel = (value: number) => {
  if (value >= 0.9) return "Practically perfect";
  if (value >= 0.75) return "Very strong";
  if (value >= 0.6) return "Strong";
  if (value >= 0.45) return "Moderate";
  if (value >= 0.3) return "Weak";
  return "Very weak";
};

const getHeatmapColor = (value: number) => {
  const clamped = Math.max(0, Math.min(1, value));
  const hue = 210 - clamped * 150; // shifts from cool blues to warm greens
  const saturation = 70;
  const lightness = 55 - clamped * 18;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export default function CorrelationAnalysis() {
  const { languageData, correlationData } = useAnalysisData();
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('activity');
  const metricDetails = metricConfiguration[selectedMetric];

  const correlationByMetric: Record<MetricType, { r: number; rSquared: number }> = {
    activity: correlationData.activityVsOverall,
    health: correlationData.healthVsOverall,
    popularity: correlationData.popularityVsOverall
  };

  const rankedCorrelations = [
    { label: 'Activity', r: correlationData.activityVsOverall.r },
    { label: 'Popularity', r: correlationData.popularityVsOverall.r },
    { label: 'Health', r: correlationData.healthVsOverall.r }
  ].sort((a, b) => b.r - a.r);
  const [strongestCorrelation, middleCorrelation, weakestCorrelation] = rankedCorrelations;

  const scatterState = useMemo(() => {
    const { width, height, padding } = chartDimensions;
    const accessor = metricDetails.accessor;

    const xValues = languageData.map(accessor);
    const yValues = languageData.map((language) => language.overallScore);

    const xMin = Math.max(0, Math.min(...xValues) - 4);
    const xMax = Math.min(100, Math.max(...xValues) + 4);
    const yMin = Math.min(...yValues) - 2;
    const yMax = Math.max(...yValues) + 2;

    const innerWidth = width - padding * 1.5;
    const innerHeight = height - padding * 1.5;
    const safeXRange = xMax - xMin || 1;
    const safeYRange = yMax - yMin || 1;

    const scaleX = (value: number) => padding + ((value - xMin) / safeXRange) * innerWidth;
    const scaleY = (value: number) => height - padding - ((value - yMin) / safeYRange) * innerHeight;

    const points: ScatterPoint[] = languageData.map((language) => {
      const xValue = accessor(language);
      const yValue = language.overallScore;
      return {
        language,
        xValue,
        yValue,
        x: scaleX(xValue),
        y: scaleY(yValue)
      };
    });

    const meanX = xValues.reduce((acc, value) => acc + value, 0) / xValues.length;
    const meanY = yValues.reduce((acc, value) => acc + value, 0) / yValues.length;
    const numerator = xValues.reduce((sum, value, index) => sum + (value - meanX) * (yValues[index] - meanY), 0);
    const denominator = xValues.reduce((sum, value) => sum + Math.pow(value - meanX, 2), 0) || 1;
    const slope = numerator / denominator;
    const intercept = meanY - slope * meanX;

    const lineStartY = slope * xMin + intercept;
    const lineEndY = slope * xMax + intercept;
    const clampY = (value: number) => Math.max(yMin, Math.min(yMax, value));

    const regression = {
      start: { x: scaleX(xMin), y: scaleY(clampY(lineStartY)) },
      end: { x: scaleX(xMax), y: scaleY(clampY(lineEndY)) }
    };

    const createTicks = (min: number, max: number, segments: number) => {
      if (segments <= 0) return [];
      const step = (max - min) / segments;
      return Array.from({ length: segments + 1 }, (_, index) => Number((min + step * index).toFixed(1)));
    };

    return {
      points,
      regression,
      xTicks: createTicks(xMin, xMax, 5),
      yTicks: createTicks(yMin, yMax, 4),
      domain: {
        x: { min: xMin, max: xMax },
        y: { min: yMin, max: yMax }
      }
    };
  }, [metricDetails, languageData]);

  const [hoverPoint, setHoverPoint] = useState<ScatterPoint | null>(null);

  useEffect(() => {
    setHoverPoint(null);
  }, [selectedMetric]);

  const heatmapState = useMemo(() => {
    const heatmapMatrix = buildHeatmapMatrix(correlationData);
    const cellSize = 110;
    const headerSize = 96;
    const padding = 36;
    const originX = padding + headerSize;
    const originY = padding + headerSize;
    const gridSize = cellSize * heatmapMetrics.length;

    const width = padding * 2 + headerSize + gridSize;
    const height = padding * 2 + headerSize + gridSize;

    const cells: HeatmapCell[] = heatmapMetrics.flatMap((rowMetric, rowIndex) =>
      heatmapMetrics.map((columnMetric, columnIndex) => ({
        row: rowMetric,
        column: columnMetric,
        value: heatmapMatrix[rowMetric.key][columnMetric.key],
        x: originX + columnIndex * cellSize,
        y: originY + rowIndex * cellSize,
        size: cellSize,
        rowIndex,
        columnIndex
      }))
    );

    return {
      cells,
      dimensions: {
        width,
        height,
        originX,
        originY,
        cellSize,
        headerSize,
        padding
      }
    };
  }, [correlationData]);

  const [selectedHeatmapCell, setSelectedHeatmapCell] = useState<HeatmapCell | null>(null);

  const defaultHeatmapCell = useMemo(() => {
    return (
      heatmapState.cells.find(
        (cell) => cell.row.key === "activity" && cell.column.key === "overall"
      ) ?? heatmapState.cells[0]
    );
  }, [heatmapState]);

  const activeHeatmapCell = selectedHeatmapCell ?? defaultHeatmapCell;

  const accentColor = metricDetails.color;
  const accentTint = `${metricDetails.color}22`;
  const accentSoftTint = `${metricDetails.color}12`;

  const projectX = (value: number) => {
    const innerWidth = chartDimensions.width - chartDimensions.padding * 1.5;
    const safeRange = scatterState.domain.x.max - scatterState.domain.x.min || 1;
    return chartDimensions.padding + ((value - scatterState.domain.x.min) / safeRange) * innerWidth;
  };

  const projectY = (value: number) => {
    const innerHeight = chartDimensions.height - chartDimensions.padding * 1.5;
    const safeRange = scatterState.domain.y.max - scatterState.domain.y.min || 1;
    return chartDimensions.height - chartDimensions.padding - ((value - scatterState.domain.y.min) / safeRange) * innerHeight;
  };

  const {
    width: heatmapWidth,
    height: heatmapHeight,
    originX,
    originY,
    cellSize,
    headerSize,
    padding: heatmapPadding
  } = heatmapState.dimensions;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-2">Correlation Analysis</h2>
        <p className="text-[var(--text-secondary)]">Statistical relationships between metrics and overall success</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { metric: 'activity' as MetricType, label: "Activity vs Overall", color: "#3fb950" },
          { metric: 'health' as MetricType, label: "Health vs Overall", color: "#bc8cff" },
          { metric: 'popularity' as MetricType, label: "Popularity vs Overall", color: "#58a6ff" }
        ].map(({ metric, label, color }) => {
          const { r, rSquared } = correlationByMetric[metric];
          const rank = rankedCorrelations.findIndex((c) => c.r === r);
          const rankLabel = rank === 0 ? "Strongest predictor of language success" : rank === rankedCorrelations.length - 1 ? "Weakest predictor among the three" : "Moderate positive correlation";
          return (
            <div key={metric} className="bg-[var(--bg-surface)] border border-[var(--border-default)] p-6">
              <div className="text-center mb-4">
                <div className="text-5xl font-bold mb-2" style={{ color }}>{r}</div>
                <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">{label}</div>
                <div className="text-xs text-[var(--text-secondary)]">R² = {rSquared}</div>
              </div>
              <div className="text-sm text-[var(--text-primary)] text-center">{rankLabel}</div>
            </div>
          );
        })}
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <h3 className="text-xl font-bold text-[var(--text-primary)]">
            {selectedMetric === 'activity' && 'Activity Score vs Overall Score'}
            {selectedMetric === 'health' && 'Health Score vs Overall Score'}
            {selectedMetric === 'popularity' && 'Popularity Score vs Overall Score'}
          </h3>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSelectedMetric('activity')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                selectedMetric === 'activity'
                  ? 'bg-[#3fb950] text-white shadow-lg'
                  : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              <Activity className="w-4 h-4 inline mr-1" />
              Activity
            </button>
            <button
              onClick={() => setSelectedMetric('health')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                selectedMetric === 'health'
                  ? 'bg-[#bc8cff] text-white shadow-lg'
                  : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              <Heart className="w-4 h-4 inline mr-1" />
              Health
            </button>
            <button
              onClick={() => setSelectedMetric('popularity')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-all ${
                selectedMetric === 'popularity'
                  ? 'bg-[#58a6ff] text-white shadow-lg'
                  : 'bg-[var(--bg-canvas)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-1" />
              Popularity
            </button>
          </div>
        </div>
        
        <div className="relative rounded-xl border border-[var(--border-default)] bg-[var(--bg-canvas)] overflow-hidden shadow-sm">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(circle at 18% 20%, ${accentTint} 0%, transparent 55%), radial-gradient(circle at 82% 80%, ${accentSoftTint} 0%, transparent 60%)`
            }}
          />
          <div className="absolute top-4 left-4 z-10 rounded-lg border border-[var(--border-default)]/60 bg-[var(--bg-surface)]/80 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-[var(--text-secondary)] backdrop-blur-sm">
            {metricDetails.context}
          </div>
          <div className="relative w-full aspect-[16/10]">
            <svg
              viewBox={`0 0 ${chartDimensions.width} ${chartDimensions.height}`}
              className="absolute inset-0 h-full w-full"
              preserveAspectRatio="none"
              onMouseLeave={() => setHoverPoint(null)}
            >
              <defs>
                <linearGradient id="regression-band" x1="0" x2="1" y1="0" y2="0">
                  <stop offset="0%" stopColor={accentColor} stopOpacity="0.15" />
                  <stop offset="50%" stopColor={accentColor} stopOpacity="0.35" />
                  <stop offset="100%" stopColor={accentColor} stopOpacity="0.15" />
                </linearGradient>
              </defs>

              <rect
                x={projectX(scatterState.domain.x.min) - 36}
                y={projectY(scatterState.domain.y.max) - 24}
                width={projectX(scatterState.domain.x.max) - projectX(scatterState.domain.x.min) + 72}
                height={projectY(scatterState.domain.y.min) - projectY(scatterState.domain.y.max) + 48}
                rx={24}
                fill="var(--bg-surface)"
                opacity={0.35}
              />

              {scatterState.yTicks.map((tick) => {
                const yPosition = projectY(tick);
                return (
                  <g key={`y-grid-${tick}`}>
                    <line
                      x1={projectX(scatterState.domain.x.min)}
                      y1={yPosition}
                      x2={projectX(scatterState.domain.x.max)}
                      y2={yPosition}
                      stroke="var(--border-default)"
                      strokeWidth={1}
                      opacity={tick === scatterState.domain.y.min ? 0.6 : 0.25}
                    />
                    <text
                      x={projectX(scatterState.domain.x.min) - 24}
                      y={yPosition + 6}
                      fill="var(--text-secondary)"
                      fontSize={18}
                      textAnchor="end"
                    >
                      {tick.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {scatterState.xTicks.map((tick) => {
                const xPosition = projectX(tick);
                return (
                  <g key={`x-grid-${tick}`}>
                    <line
                      x1={xPosition}
                      y1={projectY(scatterState.domain.y.max)}
                      x2={xPosition}
                      y2={projectY(scatterState.domain.y.min)}
                      stroke="var(--border-default)"
                      strokeWidth={1}
                      opacity={tick === scatterState.domain.x.min ? 0.6 : 0.2}
                    />
                    <line
                      x1={xPosition}
                      y1={projectY(scatterState.domain.y.min)}
                      x2={xPosition}
                      y2={projectY(scatterState.domain.y.min) + 12}
                      stroke="var(--text-secondary)"
                      strokeWidth={1.5}
                    />
                    <text
                      x={xPosition}
                      y={projectY(scatterState.domain.y.min) + 36}
                      fill="var(--text-secondary)"
                      fontSize={18}
                      textAnchor="middle"
                    >
                      {tick.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              <line
                x1={projectX(scatterState.domain.x.min)}
                y1={projectY(scatterState.domain.y.min)}
                x2={projectX(scatterState.domain.x.max)}
                y2={projectY(scatterState.domain.y.min)}
                stroke="var(--text-secondary)"
                strokeWidth={2}
              />
              <line
                x1={projectX(scatterState.domain.x.min)}
                y1={projectY(scatterState.domain.y.min)}
                x2={projectX(scatterState.domain.x.min)}
                y2={projectY(scatterState.domain.y.max)}
                stroke="var(--text-secondary)"
                strokeWidth={2}
              />

              <line
                x1={scatterState.regression.start.x}
                y1={scatterState.regression.start.y}
                x2={scatterState.regression.end.x}
                y2={scatterState.regression.end.y}
                stroke="url(#regression-band)"
                strokeWidth={8}
                strokeLinecap="round"
                opacity={0.6}
              />
              <line
                x1={scatterState.regression.start.x}
                y1={scatterState.regression.start.y}
                x2={scatterState.regression.end.x}
                y2={scatterState.regression.end.y}
                stroke={accentColor}
                strokeWidth={3}
                strokeLinecap="round"
              />

              {scatterState.points.map((point) => {
                const isActive = hoverPoint?.language.name === point.language.name;
                return (
                  <g
                    key={point.language.name}
                    className="cursor-pointer transition-transform duration-150"
                    onMouseEnter={() => setHoverPoint({ ...point })}
                  >
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={isActive ? 12 : 9}
                      fill={point.language.color}
                      stroke="var(--bg-surface)"
                      strokeWidth={2.2}
                      opacity={isActive ? 1 : 0.85}
                    />
                    <circle
                      cx={point.x}
                      cy={point.y}
                      r={isActive ? 18 : 13}
                      fill="none"
                      stroke={accentColor}
                      strokeDasharray="6 6"
                      strokeWidth={isActive ? 1.8 : 1.2}
                      opacity={isActive ? 0.65 : 0.3}
                    />
                    <text
                      x={point.x}
                      y={point.y - (isActive ? 18 : 14)}
                      textAnchor="middle"
                      fontSize={isActive ? 20 : 16}
                      fill="var(--text-primary)"
                      pointerEvents="none"
                    >
                      {point.language.icon}
                    </text>
                  </g>
                );
              })}

              <text
                x={(projectX(scatterState.domain.x.min) + projectX(scatterState.domain.x.max)) / 2}
                y={projectY(scatterState.domain.y.min) + 72}
                fill="var(--text-secondary)"
                fontSize={18}
                fontWeight={600}
                textAnchor="middle"
              >
                {metricDetails.label}
              </text>
              <text
                x={projectX(scatterState.domain.x.min) - 64}
                y={(projectY(scatterState.domain.y.min) + projectY(scatterState.domain.y.max)) / 2}
                fill="var(--text-secondary)"
                fontSize={18}
                fontWeight={600}
                textAnchor="middle"
                transform={`rotate(-90 ${projectX(scatterState.domain.x.min) - 64} ${(projectY(scatterState.domain.y.min) + projectY(scatterState.domain.y.max)) / 2})`}
              >
                Overall Score
              </text>

              {hoverPoint && (
                <g
                  transform={`translate(${Math.min(
                    chartDimensions.width - 220,
                    hoverPoint.x + 20
                  )}, ${Math.max(hoverPoint.y - 110, 60)})`}
                >
                  <rect
                    width={210}
                    height={110}
                    rx={14}
                    fill="var(--bg-surface)"
                    stroke={accentColor}
                    strokeWidth={1.4}
                    opacity={0.95}
                  />
                  <text x={18} y={32} fill="var(--text-primary)" fontSize={20} fontWeight={600}>
                    {hoverPoint.language.icon} {hoverPoint.language.name}
                  </text>
                  <text x={18} y={62} fill="var(--text-secondary)" fontSize={14}>
                    {metricDetails.label}: {hoverPoint.xValue.toFixed(1)}
                  </text>
                  <text x={18} y={84} fill="var(--text-secondary)" fontSize={14}>
                    Overall Score: {hoverPoint.yValue.toFixed(2)}
                  </text>
                  <text x={18} y={102} fill="var(--text-secondary)" fontSize={12}>
                    Δ from mean: {(hoverPoint.yValue - (scatterState.domain.y.min + scatterState.domain.y.max) / 2).toFixed(2)}
                  </text>
                </g>
              )}
            </svg>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-[var(--bg-canvas)] rounded-lg border border-[var(--border-default)]">
          <div className="text-center">
            <div className="text-sm font-semibold text-[var(--text-primary)] mb-1">
              {correlationDescriptor(correlationByMetric[selectedMetric].r).strength} {correlationDescriptor(correlationByMetric[selectedMetric].r).direction} Correlation
            </div>
            <div className="text-xs text-[var(--text-secondary)]">
              Pearson r = {correlationByMetric[selectedMetric].r} | R² = {correlationByMetric[selectedMetric].rSquared}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-lg p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-[#58a6ff]" />
            <div>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">Correlation Heatmap</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Visualizing how ecosystem metrics move together across languages
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-[var(--text-secondary)]">
            <span className="inline-flex items-center gap-1">
              <span className="h-3 w-3 rounded-full" style={{ background: getHeatmapColor(0.35) }} />
              Weak
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-3 w-3 rounded-full" style={{ background: getHeatmapColor(0.6) }} />
              Moderate
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-3 w-3 rounded-full" style={{ background: getHeatmapColor(0.85) }} />
              Strong
            </span>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="relative overflow-x-auto rounded-xl border border-[var(--border-default)] bg-[var(--bg-canvas)]">
            <svg
              viewBox={`0 0 ${heatmapWidth} ${heatmapHeight}`}
              className="w-full h-full min-w-[520px]"
            >
              <defs>
                {heatmapMetrics.map((metric) => (
                  <linearGradient
                    key={`diag-${metric.key}`}
                    id={`diag-${metric.key}`}
                    x1="0"
                    y1="0"
                    x2="1"
                    y2="1"
                  >
                    <stop offset="0%" stopColor={`${metric.accent}55`} />
                    <stop offset="100%" stopColor={`${metric.accent}aa`} />
                  </linearGradient>
                ))}
              </defs>

              <rect
                x={heatmapPadding}
                y={heatmapPadding}
                width={heatmapWidth - heatmapPadding * 2}
                height={heatmapHeight - heatmapPadding * 2}
                rx={24}
                fill="var(--bg-surface)"
                opacity={0.4}
              />

              {heatmapMetrics.map((metric, index) => (
                <text
                  key={`col-${metric.key}`}
                  x={originX + index * cellSize + cellSize / 2}
                  y={heatmapPadding + headerSize - 18}
                  fill="var(--text-secondary)"
                  fontSize={16}
                  textAnchor="middle"
                  transform={`rotate(-30 ${originX + index * cellSize + cellSize / 2} ${heatmapPadding + headerSize - 18})`}
                >
                  {metric.label}
                </text>
              ))}

              {heatmapMetrics.map((metric, index) => (
                <g key={`row-${metric.key}`}>
                  <text
                    x={heatmapPadding + headerSize - 18}
                    y={originY + index * cellSize + cellSize / 2 + 6}
                    fill="var(--text-secondary)"
                    fontSize={16}
                    textAnchor="end"
                  >
                    {metric.label}
                  </text>
                  <circle
                    cx={heatmapPadding + headerSize - 10}
                    cy={originY + index * cellSize + cellSize / 2 - 6}
                    r={4}
                    fill={metric.accent}
                    opacity={0.7}
                  />
                </g>
              ))}

              {heatmapState.cells.map((cell) => {
                const isDiagonal = cell.row.key === cell.column.key;
                const isActive = activeHeatmapCell.row.key === cell.row.key && activeHeatmapCell.column.key === cell.column.key;
                const isRelated = !isActive && (activeHeatmapCell.row.key === cell.row.key || activeHeatmapCell.column.key === cell.column.key);
                const fillColor = isDiagonal ? `url(#diag-${cell.row.key})` : getHeatmapColor(cell.value);
                const textColor = cell.value >= 0.7 || isDiagonal ? '#ffffff' : 'var(--text-primary)';

                return (
                  <g
                    key={`${cell.row.key}-${cell.column.key}`}
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setSelectedHeatmapCell(cell)}
                    onMouseLeave={() => setSelectedHeatmapCell(null)}
                  >
                    <rect
                      x={cell.x}
                      y={cell.y}
                      width={cell.size}
                      height={cell.size}
                      rx={18}
                      fill={fillColor}
                      opacity={isRelated ? 0.85 : 1}
                      stroke={isActive ? cell.row.accent : 'var(--border-default)'}
                      strokeWidth={isActive ? 3 : 1}
                      className="transition-all duration-200"
                    />
                    <text
                      x={cell.x + cell.size / 2}
                      y={cell.y + cell.size / 2 + 6}
                      textAnchor="middle"
                      fontSize={20}
                      fontWeight={600}
                      fill={textColor}
                    >
                      {cell.value.toFixed(2)}
                    </text>
                    {!isDiagonal && (
                      <text
                        x={cell.x + cell.size / 2}
                        y={cell.y + cell.size - 18}
                        textAnchor="middle"
                        fontSize={12}
                        fill={textColor === '#ffffff' ? '#f8fafc' : 'var(--text-secondary)'}
                      >
                        {getStrengthLabel(cell.value)}
                      </text>
                    )}
                  </g>
                );
              })}

              <text
                x={heatmapWidth - heatmapPadding - 8}
                y={heatmapHeight - heatmapPadding - 12}
                fill="var(--text-secondary)"
                fontSize={12}
                textAnchor="end"
              >
                Pearson r values
              </text>
            </svg>
          </div>

          <div className="rounded-xl border border-[var(--border-default)] bg-[var(--bg-canvas)] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="flex h-12 w-12 items-center justify-center rounded-lg text-lg font-semibold"
                style={{
                  background: `linear-gradient(135deg, ${activeHeatmapCell.row.accent}33, ${activeHeatmapCell.column.accent}66)`
                }}
              >
                {activeHeatmapCell.row.label.charAt(0)}
              </div>
              <div>
                <div className="text-sm font-semibold text-[var(--text-secondary)]">Focus Pair</div>
                <div className="text-lg font-semibold text-[var(--text-primary)]">
                  {activeHeatmapCell.row.label} ↔ {activeHeatmapCell.column.label}
                </div>
              </div>
            </div>
            <div className="text-4xl font-bold text-[var(--text-primary)] tracking-tight">
              {activeHeatmapCell.value.toFixed(2)}
            </div>
            <div className="mt-1 text-sm font-medium text-[var(--text-secondary)]">
              {getStrengthLabel(activeHeatmapCell.value)} positive correlation
            </div>

            <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-[var(--border-default)]">
              <div
                className="h-full rounded-full"
                style={{ width: `${activeHeatmapCell.value * 100}%`, background: getHeatmapColor(activeHeatmapCell.value) }}
              />
            </div>

            <div className="mt-4 space-y-3 text-sm text-[var(--text-secondary)]">
              <p>
                When activity increases, we consistently observe an uplift in overall language success. The
                relationship is resilient even across ecosystems with different maturity levels.
              </p>
              <p>
                {activeHeatmapCell.row.key === activeHeatmapCell.column.key
                  ? "Diagonal cells provide the reference identity line (perfect correlation)."
                  : `This suggests that initiatives improving ${activeHeatmapCell.row.label.toLowerCase()} tend to influence ${activeHeatmapCell.column.label.toLowerCase()} as well.`}
              </p>
            </div>

            <div className="mt-5 text-xs text-[var(--text-secondary)]">
              Hover different cells to explore cross-metric dynamics and prioritize the levers with the strongest
              compounding impact.
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] p-6">
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Key Findings</h3>
          <div className="space-y-3">
            <div className="bg-[var(--bg-canvas)] p-4 rounded border-l-4 border-[#3fb950]">
              <div className="font-semibold text-[var(--text-primary)] mb-2">{strongestCorrelation.label} Predicts Best</div>
              <div className="text-sm text-[var(--text-primary)]">
                {strongestCorrelation.label} metrics show the strongest correlation (r={strongestCorrelation.r}) with overall success
              </div>
            </div>
            <div className="bg-[var(--bg-canvas)] p-4 rounded border-l-4 border-[#58a6ff]">
              <div className="font-semibold text-[var(--text-primary)] mb-2">{weakestCorrelation.label} Least Predictive</div>
              <div className="text-sm text-[var(--text-primary)]">
                {weakestCorrelation.label} has the weakest correlation (r={weakestCorrelation.r}) of the three, confirming it's not the best success indicator on its own
              </div>
            </div>
            <div className="bg-[var(--bg-canvas)] p-4 rounded border-l-4 border-[#bc8cff]">
              <div className="font-semibold text-[var(--text-primary)] mb-2">{middleCorrelation.label} Matters Too</div>
              <div className="text-sm text-[var(--text-primary)]">
                {middleCorrelation.label} shows a moderate correlation (r={middleCorrelation.r}) with overall success
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[var(--bg-surface)] border border-[var(--border-default)] p-6">
          <h3 className="text-xl font-bold text-[var(--text-primary)] mb-4">Correlation Strength</h3>
          <div className="space-y-4">
            {[
              { label: "Activity Correlation", r: correlationData.activityVsOverall.r, color: "#3fb950" },
              { label: "Health Correlation", r: correlationData.healthVsOverall.r, color: "#bc8cff" },
              { label: "Popularity Correlation", r: correlationData.popularityVsOverall.r, color: "#58a6ff" }
            ].map(({ label, r, color }) => {
              const { strength, direction } = correlationDescriptor(r);
              return (
                <div key={label}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-[var(--text-primary)]">{label}</span>
                    <span className="text-sm font-mono" style={{ color }}>r = {r}</span>
                  </div>
                  <div className="text-xs text-[var(--text-secondary)] mb-2">{strength} {direction.toLowerCase()} relationship</div>
                  <div className="w-full bg-[var(--border-default)] h-2 rounded-full overflow-hidden">
                    <div className="h-full" style={{ width: `${Math.abs(r) * 100}%`, backgroundColor: color }} />
                  </div>
                </div>
              );
            })}

            <div className="mt-6 p-4 bg-[var(--bg-canvas)] rounded">
              <div className="text-sm text-[var(--text-primary)]">
                {strongestCorrelation.label} has the strongest relationship with overall success (r = {strongestCorrelation.r}), suggesting
                ecosystem-level variation beyond individual project quality.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
