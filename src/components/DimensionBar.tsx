import { useState, useEffect } from "react";

function tierColorForScore(score: number): string {
  if (score < 30) return "var(--t-nascent)";
  if (score < 55) return "var(--t-developing)";
  if (score < 75) return "var(--t-maturing)";
  return "var(--t-leading)";
}

interface Props {
  label: string;
  score: number;
  delay?: number;
}

export default function DimensionBar({ label, score, delay = 0 }: Props) {
  const [width, setWidth] = useState(0);
  const color = tierColorForScore(score);

  useEffect(() => {
    const t = setTimeout(() => setWidth(score), 80 + delay);
    return () => clearTimeout(t);
  }, [score, delay]);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "160px 1fr 56px",
      alignItems: "center",
      gap: 16,
      padding: "11px 0",
    }}>
      <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 600,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          color: "var(--ink)",
        }}>
          {label}
        </div>
      </div>

      <div style={{
        position: "relative", height: 10, borderRadius: 999,
        background: "var(--surface-inset)", overflow: "hidden",
        boxShadow: "var(--inner-line)",
      }}>
        {/* tier band ticks at 30, 55, 75 */}
        {[30, 55, 75].map((p) => (
          <span key={p} style={{
            position: "absolute", left: p + "%", top: 0, bottom: 0,
            width: 1, background: "var(--border-strong)", opacity: .7,
          }} />
        ))}
        <div style={{
          position: "absolute", left: 0, top: 0, bottom: 0,
          width: width + "%", borderRadius: 999,
          background: color,
          transition: "width 1s var(--ease)",
        }} />
      </div>

      <span style={{
        fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums",
        fontSize: 13, fontWeight: 600, color: "var(--ink)",
        textAlign: "right",
      }}>
        {score}
      </span>
    </div>
  );
}
