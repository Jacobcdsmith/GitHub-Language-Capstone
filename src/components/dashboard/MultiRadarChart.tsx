import { useEffect, useRef, useState } from "react";

interface MultiRadarChartProps {
  data: {
    name: string;
    values: number[];
    color: string;
  }[];
  labels: string[];
}

const colorSchemes = {
  default: { name: 'Default', colors: (data: any[]) => data.map(d => d.color) },
  colorblind: {
    name: 'Colorblind Friendly',
    colors: (data: any[]) => ['#0173B2', '#DE8F05', '#029E73', '#CC78BC', '#CA9161', '#949494', '#ECE133', '#56B4E9'].slice(0, data.length)
  },
  highContrast: {
    name: 'High Contrast',
    colors: (data: any[]) => ['#FFFF00', '#00FFFF', '#FF00FF', '#00FF00', '#FF0000', '#0000FF', '#FFFFFF', '#FFA500'].slice(0, data.length)
  },
  monochrome: {
    name: 'Monochrome',
    colors: (data: any[]) => ['#FFFFFF', '#CCCCCC', '#999999', '#666666', '#333333', '#B3B3B3', '#808080', '#4D4D4D'].slice(0, data.length)
  }
};

export default function MultiRadarChart({ data, labels }: MultiRadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [colorScheme, setColorScheme] = useState<keyof typeof colorSchemes>('default');
  const colors = colorSchemes[colorScheme].colors(data);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 80;
    const numAxes = labels.length;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background circles
    ctx.strokeStyle = "#21262d";
    ctx.lineWidth = 1;
    for (let i = 1; i <= 5; i++) {
      ctx.beginPath();
      ctx.arc(centerX, centerY, (radius / 5) * i, 0, 2 * Math.PI);
      ctx.stroke();
      
      // Draw scale labels
      ctx.fillStyle = "#8b949e";
      ctx.font = "10px Inter";
      ctx.textAlign = "center";
      ctx.fillText(`${i * 20}`, centerX + 5, centerY - (radius / 5) * i - 5);
    }

    // Draw axes
    ctx.strokeStyle = "#30363d";
    ctx.lineWidth = 1;
    for (let i = 0; i < numAxes; i++) {
      const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.stroke();

      // Draw labels
      const labelX = centerX + (radius + 40) * Math.cos(angle);
      const labelY = centerY + (radius + 40) * Math.sin(angle);
      ctx.fillStyle = "#c9d1d9";
      ctx.font = "bold 13px Inter";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(labels[i], labelX, labelY);
    }

    // Draw data polygons
    data.forEach((item, index) => {
      ctx.beginPath();
      const itemColor = colors[index];
      ctx.strokeStyle = itemColor;
      ctx.fillStyle = `${itemColor}25`;
      ctx.lineWidth = 2.5;

      item.values.forEach((value, i) => {
        const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
        const distance = (value / 100) * radius;
        const x = centerX + distance * Math.cos(angle);
        const y = centerY + distance * Math.sin(angle);

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.closePath();
      ctx.stroke();
      ctx.fill();

      // Draw points
      item.values.forEach((value, i) => {
        const angle = (Math.PI * 2 * i) / numAxes - Math.PI / 2;
        const distance = (value / 100) * radius;
        const x = centerX + distance * Math.cos(angle);
        const y = centerY + distance * Math.sin(angle);

        ctx.fillStyle = colors[index];
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
        
        // Add white border to points
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
      });
    });

  }, [data, labels, colors]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        className="w-full h-auto"
      />
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-center gap-2">
          <label className="text-sm text-[#8b949e]">Color Scheme:</label>
          <select
            value={colorScheme}
            onChange={(e) => setColorScheme(e.target.value as keyof typeof colorSchemes)}
            className="px-3 py-1 bg-[#0d1117] border border-[#30363d] rounded text-white text-sm focus:outline-none focus:border-[#58a6ff]"
          >
            {Object.entries(colorSchemes).map(([key, scheme]) => (
              <option key={key} value={key}>{scheme.name}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
        {data.map((item, index) => (
          <div key={item.name} className="flex items-center gap-2 bg-[#0d1117] px-3 py-2 rounded">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: colors[index] }}
            />
            <span className="text-sm font-semibold text-white">{item.name}</span>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

