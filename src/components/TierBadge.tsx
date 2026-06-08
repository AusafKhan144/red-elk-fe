import type { TierResult } from "../types/api";

const styles: Record<TierResult, string> = {
  nascent:    "bg-red-50   text-red-700   border-red-200",
  developing: "bg-amber-50 text-amber-700 border-amber-200",
  maturing:   "bg-blue-50  text-blue-700  border-blue-200",
  leading:    "bg-green-50 text-green-700 border-green-200",
};

const dots: Record<TierResult, string> = {
  nascent:    "bg-red-400",
  developing: "bg-amber-400",
  maturing:   "bg-blue-400",
  leading:    "bg-green-400",
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
