import { useEffect, useRef } from "react";

interface RadarChartProps {
  data: {
    name: string;
    values: number[];
    color: string;
  }[];
  labels: string[];
}

export default function RadarChart({ data, labels }: RadarChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 60;
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
      const labelX = centerX + (radius + 30) * Math.cos(angle);
      const labelY = centerY + (radius + 30) * Math.sin(angle);
      ctx.fillStyle = "#8b949e";
      ctx.font = "12px Inter";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(labels[i], labelX, labelY);
    }

    // Draw data polygons
    data.forEach((item, index) => {
      ctx.beginPath();
      ctx.strokeStyle = item.color;
      ctx.fillStyle = `${item.color}30`;
      ctx.lineWidth = 2;

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

        // Draw points
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
      });

      ctx.closePath();
      ctx.stroke();
      ctx.fillStyle = `${item.color}20`;
      ctx.fill();
    });

  }, [data, labels]);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="w-full h-auto"
      />
      <div className="mt-4 flex flex-wrap gap-3 justify-center">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-[#c9d1d9]">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

