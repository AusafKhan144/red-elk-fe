import type { DimensionResult } from "../types/api";

function scoreColor(score: number): string {
  if (score >= 75) return "bg-green-500";
  if (score >= 55) return "bg-blue-500";
  if (score >= 30) return "bg-amber-500";
  return "bg-elk-red";
}

function scoreLabelColor(score: number): string {
  if (score >= 75) return "text-green-600";
  if (score >= 55) return "text-blue-600";
  if (score >= 30) return "text-amber-600";
  return "text-elk-red";
}

export default function DimensionCard({ dimension }: { dimension: DimensionResult }) {
  const pct = Math.min(100, Math.max(0, dimension.score));

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md hover:border-gray-200 transition-all">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-gray-800 leading-snug">{dimension.name}</h3>
        <span className={`text-lg font-extrabold ${scoreLabelColor(dimension.score)}`}>
          {dimension.score}
        </span>
      </div>

      <div className="w-full bg-gray-100 rounded-full h-2 mb-3 overflow-hidden">
        <div
          className={`h-2 rounded-full transition-all duration-700 ease-out ${scoreColor(dimension.score)}`}
          style={{ width: `${pct}%` }}
        />
      </div>

      {dimension.description && (
        <p className="text-xs text-gray-500 leading-relaxed">{dimension.description}</p>
      )}
    </div>
  );
}
