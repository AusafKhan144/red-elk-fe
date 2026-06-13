import { Check } from "lucide-react";

interface Props {
  value: number | null;
  onChange: (value: number) => void;
  disabled?: boolean;
  max?: number;
}

const SCALE_LABELS: Record<number, string[]> = {
  2: ["No", "Yes"],
  3: ["Low", "Medium", "High"],
  5: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
  10: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
};

function getLabels(max: number): string[] {
  if (SCALE_LABELS[max]) return SCALE_LABELS[max];
  return Array.from({ length: max }, (_, i) => String(i + 1));
}

/**
 * Scale answer input — rendered as the design's stacked option cards
 * (number badge · label · radio check), themed with the Atlas tokens.
 * For wide scales (max > 5) the cards become a compact wrapping grid.
 */
export default function RatingInput({ value, onChange, disabled = false, max = 5 }: Props) {
  const labels = getLabels(max);
  const options = Array.from({ length: max }, (_, i) => i + 1);
  const compact = max > 5;

  return (
    <div
      style={
        compact
          ? { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: 10 }
          : { display: "flex", flexDirection: "column", gap: 10 }
      }
    >
      {options.map((n) => {
        const on = value === n;
        return (
          <button
            key={n}
            type="button"
            disabled={disabled}
            onClick={() => onChange(n)}
            aria-pressed={on}
            aria-label={`${n} — ${labels[n - 1]}`}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              textAlign: "left",
              width: "100%",
              padding: "14px 16px",
              borderRadius: "var(--radius)",
              border: `1.5px solid ${on ? "var(--accent)" : "var(--border)"}`,
              background: on ? "var(--accent-soft)" : "var(--surface)",
              cursor: disabled ? "not-allowed" : "pointer",
              opacity: disabled ? 0.5 : 1,
              transition: "all .15s var(--ease)",
              fontFamily: "var(--font-ui)",
            }}
          >
            <span
              style={{
                width: 30,
                height: 30,
                borderRadius: 8,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                fontWeight: 600,
                fontFamily: "var(--font-mono)",
                background: on ? "var(--accent)" : "var(--surface-inset)",
                color: on ? "#fff" : "var(--muted)",
                boxShadow: on ? "none" : "var(--inner-line)",
              }}
            >
              {n}
            </span>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: on ? "var(--accent-press)" : "var(--ink)" }}>
              {labels[n - 1]}
            </span>
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: 999,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                border: `1.5px solid ${on ? "var(--accent)" : "var(--border-strong)"}`,
                background: on ? "var(--accent)" : "transparent",
              }}
            >
              {on && <Check size={12} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
