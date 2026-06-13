import { useState, useEffect } from "react";
import type { RadarPoint } from "../types/api";

interface Props {
  data: RadarPoint[];
  /** Previous attempt — drawn as a dashed, faint overlay when present. */
  previousData?: RadarPoint[] | null;
  size?: number;
  color: string;
  hideLabels?: boolean;
}

/**
 * Polygon radar chart — mirrors the design's shared `Radar` primitive.
 * Filled current shape, optional dashed previous-attempt overlay, and
 * first-word dimension labels. Replaces the recharts radar for full
 * design fidelity (and drops the recharts dependency).
 */
export default function Radar({ data, previousData, size = 300, color, hideLabels = false }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const pad = size < 200 ? 20 : 38;
  const R = size / 2 - pad;
  const n = data.length;

  const [grow, setGrow] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setGrow(1), 100);
    return () => clearTimeout(t);
  }, []);

  if (n === 0) return null;

  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const pt = (i: number, r: number): [number, number] => [
    cx + Math.cos(angle(i)) * R * r,
    cy + Math.sin(angle(i)) * R * r,
  ];

  const rings = [0.25, 0.5, 0.75, 1];
  const hasPrev = !!previousData && previousData.length > 0;
  const poly = data.map((d, i) => pt(i, (d.score / 100) * grow).join(",")).join(" ");
  const prevPoly = hasPrev
    ? data
        .map((d, i) => {
          const prev = previousData!.find((p) => p.dimension === d.dimension);
          return pt(i, (prev?.score ?? 0) / 100).join(",");
        })
        .join(" ")
    : "";

  const lblR = size < 200 ? 1.32 : 1.19;
  const lblSize = size < 200 ? 8.5 : 10.5;
  const dotR = size < 200 ? 2.5 : 3.5;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
      {rings.map((r, ri) => (
        <polygon
          key={ri}
          points={data.map((_, i) => pt(i, r).join(",")).join(" ")}
          fill={ri === rings.length - 1 ? "var(--surface-2)" : "none"}
          stroke="var(--border)"
          strokeWidth="1"
        />
      ))}
      {data.map((_, i) => {
        const [x, y] = pt(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--border)" strokeWidth="1" />;
      })}
      {hasPrev && (
        <polygon points={prevPoly} fill="none" stroke="var(--faint)" strokeWidth="1.5" strokeDasharray="3,2.5" opacity="0.7" />
      )}
      <polygon
        points={poly}
        fill={color}
        fillOpacity="0.14"
        stroke={color}
        strokeWidth="2"
        style={{ transition: "all 1s var(--ease)" }}
      />
      {data.map((d, i) => {
        const [x, y] = pt(i, (d.score / 100) * grow);
        return <circle key={i} cx={x} cy={y} r={dotR} fill={color} style={{ transition: "all 1s var(--ease)" }} />;
      })}
      {!hideLabels &&
        data.map((d, i) => {
          const [x, y] = pt(i, lblR);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: lblSize, fill: "var(--muted)", fontWeight: 600, fontFamily: "var(--font-ui)" }}
            >
              {d.label.split(" ")[0]}
            </text>
          );
        })}
    </svg>
  );
}
