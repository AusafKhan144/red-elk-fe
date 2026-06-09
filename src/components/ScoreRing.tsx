import type { MaturityLevel } from "../types/api";

interface Props {
  score: number;
  size?: number;
  dark?: boolean;
  tier?: MaturityLevel;
}

const TIER_COLORS: Record<MaturityLevel, string> = {
  nascent:    "#C0392B",
  developing: "#D97706",
  maturing:   "#0D9488",
  leading:    "#D4A72C",
};

function inferTier(score: number): MaturityLevel {
  if (score >= 75) return "leading";
  if (score >= 55) return "maturing";
  if (score >= 30) return "developing";
  return "nascent";
}

const TIER_LABELS: Record<MaturityLevel, string> = {
  nascent:    "Nascent",
  developing: "Developing",
  maturing:   "Maturing",
  leading:    "Leading",
};

export default function ScoreRing({ score, size = 120, dark = false, tier }: Props) {
  const strokeWidth = 10;
  const r = (size - strokeWidth * 2) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  const resolvedTier = tier ?? inferTier(score);
  const arcColor = TIER_COLORS[resolvedTier];
  const trackColor = dark ? "rgba(255,255,255,0.08)" : "#f3f4f6";
  const textColor = dark ? "#ffffff" : "#111827";
  const subColor = dark ? "rgba(255,255,255,0.4)" : "#9ca3af";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        style={{ transform: "rotate(-90deg)", filter: `drop-shadow(0 0 10px ${arcColor}55)` }}
      >
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={arcColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span style={{ fontSize: size * 0.26, fontWeight: 800, color: textColor, lineHeight: 1, fontFamily: "var(--font-display)" }}>
          {score}
        </span>
        <span style={{ fontSize: size * 0.1, color: subColor, fontWeight: 500, marginTop: 2 }}>
          {TIER_LABELS[resolvedTier]}
        </span>
      </div>
    </div>
  );
}
