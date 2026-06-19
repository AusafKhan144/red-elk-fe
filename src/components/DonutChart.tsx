import { useState, useEffect } from "react";

export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface Props {
  segments: DonutSegment[];
  size?: number;
  centerValue: string;
  centerLabel: string;
}

export default function DonutChart({ segments, size = 150, centerValue, centerLabel }: Props) {
  const r = size / 2 - 14;
  const c = 2 * Math.PI * r;
  const total = segments.reduce((s, seg) => s + seg.value, 0) || 1;
  const [grow, setGrow] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setGrow(1), 100);
    return () => clearTimeout(t);
  }, []);

  let acc = 0;
  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        {segments.map((seg) => {
          const len = (seg.value / total) * c * grow;
          const el = (
            <circle
              key={seg.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth="14"
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-acc}
              style={{ transition: "stroke-dasharray 1s var(--ease)" }}
            />
          );
          acc += len;
          return el;
        })}
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <span style={{ fontSize: 26, fontWeight: 700, color: "var(--ink)", fontVariantNumeric: "tabular-nums", lineHeight: 1 }}>
          {centerValue}
        </span>
        <span style={{ fontSize: 10, color: "var(--faint)", marginTop: 3 }}>{centerLabel}</span>
      </div>
    </div>
  );
}
