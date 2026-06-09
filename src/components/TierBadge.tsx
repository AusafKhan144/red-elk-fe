import type { TierResult } from "../types/api";

const styles: Record<TierResult, string> = {
  nascent:    "bg-red-50   text-red-700   border-red-200",
  developing: "bg-amber-50 text-amber-700 border-amber-200",
  maturing:   "bg-teal-50  text-teal-700  border-teal-200",
  leading:    "bg-yellow-50 text-yellow-700 border-yellow-300",
};

const dots: Record<TierResult, string> = {
  nascent:    "bg-red-400",
  developing: "bg-amber-400",
  maturing:   "bg-teal-500",
  leading:    "bg-elk-gold",
};

const labels: Record<TierResult, string> = {
  nascent:    "Nascent",
  developing: "Developing",
  maturing:   "Maturing",
  leading:    "Leading",
};

interface Props {
  tier: TierResult;
  size?: "sm" | "md" | "lg";
}

export default function TierBadge({ tier, size = "md" }: Props) {
  const padding = size === "lg" ? "px-3.5 py-1.5 text-sm" : "px-2.5 py-0.5 text-xs";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${styles[tier]} ${padding}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dots[tier]}`} />
      {labels[tier]}
    </span>
  );
}
