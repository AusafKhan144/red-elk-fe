import type { DimensionResult } from "../types/api";

function scoreThreshold(score: number): "nascent" | "developing" | "maturing" | "leading" {
  if (score >= 75) return "leading";
  if (score >= 55) return "maturing";
  if (score >= 30) return "developing";
  return "nascent";
}

const barColor: Record<string, string> = {
  nascent:    "bg-elk-red",
  developing: "bg-amber-400",
  maturing:   "bg-elk-teal",
  leading:    "bg-elk-gold",
};

const leftBorder: Record<string, string> = {
  nascent:    "border-l-elk-red",
  developing: "border-l-amber-400",
  maturing:   "border-l-elk-teal",
  leading:    "border-l-elk-gold",
};

const labelColor: Record<string, string> = {
  nascent:    "text-elk-red",
  developing: "text-amber-600",
  maturing:   "text-elk-teal",
  leading:    "text-yellow-600",
};

export default function DimensionCard({ dimension }: { dimension: DimensionResult }) {
  const pct = Math.min(100, Math.max(0, dimension.score));
  const tier = scoreThreshold(dimension.score);

  return (
    <div className={`bg-white rounded-xl border border-gray-100 border-l-4 ${leftBorder[tier]} shadow-sm p-5 hover:shadow-md transition-all`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-800 leading-snug">{dimension.name}</h3>
        <span className={`text-lg font-extrabold ${labelColor[tier]}`} style={{ fontFamily: "var(--font-display)" }}>
          {dimension.score % 1 === 0 ? dimension.score : dimension.score.toFixed(1)}
        </span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-3 overflow-hidden">
        <div
          className={`h-1.5 rounded-full transition-all duration-700 ease-out ${barColor[tier]}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {dimension.description && (
        <p className="text-xs text-gray-500 leading-relaxed">{dimension.description}</p>
      )}
    </div>
  );
}
