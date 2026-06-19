import { useState, useEffect } from "react";
import type { BenchDim } from "../data/preview";

interface Props {
  dims: BenchDim[];
  size?: number;
  color: string;
}

/** Radar with three overlays: you (solid, filled), sector average (dashed), top 25% (faint dashed). */
export default function DualRadar({ dims, size = 304, color }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - 42;
  const n = dims.length;
  const [grow, setGrow] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setGrow(1), 100);
    return () => clearTimeout(t);
  }, []);

  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i: number, val: number, g: number): [number, number] => {
    const r = (val / 100) * g;
    return [cx + Math.cos(angle(i)) * R * r, cy + Math.sin(angle(i)) * R * r];
  };
  const gridPts = (r: number) =>
    dims
      .map((_, i) => {
        const x = cx + Math.cos(angle(i)) * R * r;
        const y = cy + Math.sin(angle(i)) * R * r;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(" ");

  const rings = [0.25, 0.5, 0.75, 1];
  const yourPts = dims.map((d, i) => pt(i, d.you, grow).join(",")).join(" ");
  const sectorPts = dims.map((d, i) => pt(i, d.sector, grow).join(",")).join(" ");
  const topPts = dims.map((d, i) => pt(i, d.top, grow).join(",")).join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {rings.map((r, ri) => (
        <polygon
          key={ri}
          points={gridPts(r)}
          fill={ri === rings.length - 1 ? "var(--surface-2)" : "none"}
          stroke="var(--border)"
          strokeWidth="1"
        />
      ))}
      {dims.map((_, i) => {
        const x = cx + Math.cos(angle(i)) * R;
        const y = cy + Math.sin(angle(i)) * R;
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border)" strokeWidth="1" />;
      })}
      {[25, 50, 75].map((v) => (
        <text
          key={v}
          x={cx + 3}
          y={cy - R * (v / 100) - 3}
          textAnchor="start"
          style={{ fontSize: 8, fill: "var(--faint)", fontFamily: "var(--font-mono)" }}
        >
          {v}
        </text>
      ))}
      {/* top quartile */}
      <polygon
        points={topPts}
        fill="none"
        stroke="var(--border-strong)"
        strokeWidth="1.5"
        strokeDasharray="2,3"
        opacity="0.85"
        style={{ transition: "all 1s var(--ease)" }}
      />
      {/* sector average */}
      <polygon
        points={sectorPts}
        fill="var(--faint)"
        fillOpacity="0.07"
        stroke="var(--faint)"
        strokeWidth="2"
        strokeDasharray="4,3"
        style={{ transition: "all 1s var(--ease)" }}
      />
      {/* you */}
      <polygon
        points={yourPts}
        fill={color}
        fillOpacity="0.16"
        stroke={color}
        strokeWidth="2.5"
        style={{ transition: "all 1s var(--ease)" }}
      />
      {dims.map((d, i) => {
        const [x, y] = pt(i, d.you, grow);
        return <circle key={i} cx={x} cy={y} r="4" fill={color} style={{ transition: "all 1s var(--ease)" }} />;
      })}
      {dims.map((d, i) => {
        const x = cx + Math.cos(angle(i)) * R * 1.23;
        const y = cy + Math.sin(angle(i)) * R * 1.23;
        return (
          <text
            key={i}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            style={{ fontSize: 10.5, fill: "var(--muted)", fontWeight: 600, fontFamily: "var(--font-ui)" }}
          >
            {d.label.split(" ")[0]}
          </text>
        );
      })}
    </svg>
  );
}
