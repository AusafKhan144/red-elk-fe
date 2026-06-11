import { useState } from "react";
import { ChevronDown } from "lucide-react";
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

const cardTint: Record<string, string> = {
  nascent:    "bg-red-50/40 dark:bg-red-950/10",
  developing: "bg-amber-50/40 dark:bg-amber-950/10",
  maturing:   "bg-teal-50/40 dark:bg-teal-950/10",
  leading:    "bg-yellow-50/40 dark:bg-yellow-950/10",
};

const labelColor: Record<string, string> = {
  nascent:    "text-elk-red",
  developing: "text-amber-600 dark:text-amber-400",
  maturing:   "text-elk-teal",
  leading:    "text-yellow-600 dark:text-yellow-400",
};

export default function DimensionCard({ dimension }: { dimension: DimensionResult }) {
  const [expanded, setExpanded] = useState(false);
  const pct = Math.min(100, Math.max(0, dimension.score));
  const tier = scoreThreshold(dimension.score);
  const hasRec = !!dimension.description;

  return (
    <div
      className={`${cardTint[tier]} dark:bg-elk-slate rounded-xl border border-gray-100 dark:border-gray-700/40 shadow-sm hover:shadow-md transition-all`}
    >
      <div
        className={`p-5 ${hasRec ? "cursor-pointer select-none" : ""}`}
        role={hasRec ? "button" : undefined}
        tabIndex={hasRec ? 0 : undefined}
        aria-expanded={hasRec ? expanded : undefined}
        onClick={() => hasRec && setExpanded((e) => !e)}
        onKeyDown={(e) => {
          if (hasRec && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setExpanded((prev) => !prev);
          }
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-gray-800 dark:text-white/90 leading-snug">{dimension.name}</h3>
          <div className="flex items-center gap-2">
            <span className={`text-lg font-extrabold ${labelColor[tier]}`} style={{ fontFamily: "var(--font-display)" }}>
              {dimension.score % 1 === 0 ? dimension.score : dimension.score.toFixed(1)}
            </span>
            {hasRec && (
              <ChevronDown
                size={15}
                className={`text-gray-400 dark:text-white/30 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
              />
            )}
          </div>
        </div>

        <div className="w-full bg-gray-100 dark:bg-gray-700/50 rounded-full h-3 overflow-hidden">
          <div
            className={`h-3 rounded-full ${barColor[tier]} transition-all duration-700 ease-out`}
            style={{ width: `${pct}%`, willChange: "width" }}
          />
        </div>
      </div>

      {hasRec && expanded && (
        <div className="px-5 pb-5 pt-0">
          <div className="border-t border-gray-50 dark:border-gray-700/30 pt-3">
            <p className="text-xs text-gray-500 dark:text-white/40 leading-relaxed">{dimension.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
