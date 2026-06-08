interface Props {
  score: number;
  size?: number;
  dark?: boolean;
}

function tierLabel(score: number): string {
  if (score >= 75) return "Leading";
  if (score >= 55) return "Maturing";
  if (score >= 30) return "Developing";
  return "Nascent";
}

export default function ScoreRing({ score, size = 120, dark = false }: Props) {
  const strokeWidth = 10;
  const r = (size - strokeWidth * 2) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const offset = circumference - (score / 100) * circumference;

  const trackColor = dark ? "rgba(255,255,255,0.1)" : "#f3f4f6";
  const textColor = dark ? "#ffffff" : "#111827";
  const subColor = dark ? "rgba(255,255,255,0.4)" : "#9ca3af";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={trackColor} strokeWidth={strokeWidth} />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="#C0392B"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span style={{ fontSize: size * 0.26, fontWeight: 800, color: textColor, lineHeight: 1 }}>
          {score}
        </span>
        <span style={{ fontSize: size * 0.1, color: subColor, fontWeight: 500, marginTop: 2 }}>
          {tierLabel(score)}
        </span>
      </div>
    </div>
  );
}
