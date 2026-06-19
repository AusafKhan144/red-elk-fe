import { useState, useEffect } from "react";

function tierColor(score: number): string {
  if (score < 30) return "var(--t-nascent)";
  if (score < 55) return "var(--t-developing)";
  if (score < 75) return "var(--t-maturing)";
  return "var(--t-leading)";
}

function useCountUp(target: number, duration = 1100) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf: number;
    let start: number | null = null;
    const tick = (t: number) => {
      if (!start) start = t;
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(target * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export default function ScoreDial({ score, size = 132 }: { score: number; size?: number }) {
  const color = tierColor(score);
  const r = size / 2 - 9;
  const circumference = 2 * Math.PI * r;
  const animated = useCountUp(score, 1100);
  const offset = circumference - (animated / 100) * circumference;

  return (
    <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-inset)" strokeWidth="9" />
        <circle
          cx={size / 2} cy={size / 2} r={r} fill="none"
          stroke={color} strokeWidth="9" strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset .2s linear" }}
        />
      </svg>
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        <span style={{
          fontFamily: "var(--font-ui)", fontVariantNumeric: "tabular-nums",
          fontSize: size >= 120 ? 38 : 28, fontWeight: 700, lineHeight: 1,
          color: "var(--ink)",
        }}>
          {Math.round(animated)}
        </span>
        <span style={{ fontSize: 10.5, color: "var(--faint)", marginTop: 2 }}>/ 100</span>
      </div>
    </div>
  );
}
