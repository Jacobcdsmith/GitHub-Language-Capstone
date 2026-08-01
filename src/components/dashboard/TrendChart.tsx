import { Loader2 } from "lucide-react";
import { useHistory } from "@/hooks/useHistory";

interface TrendChartProps {
  languages: { name: string; color: string }[];
}

const WIDTH = 700;
const HEIGHT = 260;
const PADDING = 40;

export default function TrendChart({ languages }: TrendChartProps) {
  const { history, loading, error } = useHistory();

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)] py-10 justify-center">
        <Loader2 className="w-4 h-4 animate-spin" />
        Loading trend history&hellip;
      </div>
    );
  }

  if (error || !history || history.length < 2) {
    return (
      <div className="text-sm text-[var(--text-secondary)] py-10 text-center">
        Not enough history yet to plot a trend — this builds up automatically as the daily refresh runs.
      </div>
    );
  }

  const dates = history.map((h) => h.date);
  const innerWidth = WIDTH - PADDING * 2;
  const innerHeight = HEIGHT - PADDING * 2;
  const scaleX = (index: number) => PADDING + (dates.length > 1 ? (index / (dates.length - 1)) * innerWidth : innerWidth / 2);
  const scaleY = (value: number) => PADDING + innerHeight - (value / 100) * innerHeight;

  return (
    <div>
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full h-auto">
        {[0, 25, 50, 75, 100].map((tick) => (
          <g key={tick}>
            <line x1={PADDING} x2={WIDTH - PADDING} y1={scaleY(tick)} y2={scaleY(tick)} stroke="var(--border-default)" strokeWidth={1} />
            <text x={PADDING - 8} y={scaleY(tick)} textAnchor="end" dominantBaseline="middle" fontSize={10} fill="var(--text-secondary)">
              {tick}
            </text>
          </g>
        ))}

        {languages.map((lang) => {
          const points = history
            .map((entry, index) => {
              const langEntry = entry.languages.find((l) => l.language === lang.name);
              return langEntry ? `${scaleX(index)},${scaleY(langEntry.overallScore)}` : null;
            })
            .filter((point): point is string => point !== null)
            .join(" ");

          if (!points) return null;
          return <polyline key={lang.name} points={points} fill="none" stroke={lang.color} strokeWidth={2.5} strokeLinejoin="round" />;
        })}

        <text x={PADDING} y={HEIGHT - 8} fontSize={10} fill="var(--text-secondary)">
          {dates[0]}
        </text>
        <text x={WIDTH - PADDING} y={HEIGHT - 8} textAnchor="end" fontSize={10} fill="var(--text-secondary)">
          {dates[dates.length - 1]}
        </text>
      </svg>
      <div className="flex flex-wrap gap-3 mt-3">
        {languages.map((lang) => (
          <div key={lang.name} className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lang.color }} />
            {lang.name}
          </div>
        ))}
      </div>
    </div>
  );
}
