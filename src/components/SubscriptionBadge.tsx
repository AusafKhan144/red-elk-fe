import { Zap, Star, Circle } from "lucide-react";
import type { SubscriptionTier } from "../types/api";

const config: Record<SubscriptionTier, {
  label: string;
  icon: React.ElementType;
  className: string;
}> = {
  free: {
    label: "Free",
    icon: Circle,
    className: "bg-gray-50 text-gray-600 border-gray-200",
  },
  basic: {
    label: "Basic",
    icon: Zap,
    className: "bg-blue-50 text-blue-700 border-blue-200",
  },
  premium: {
    label: "Premium",
    icon: Star,
    className: "bg-amber-50 text-amber-700 border-amber-200",
  },
};

interface Props {
  tier: SubscriptionTier;
  size?: "sm" | "md" | "lg";
}

export default function SubscriptionBadge({ tier, size = "md" }: Props) {
  const { label, icon: Icon, className } = config[tier] ?? config.free;
  const padding = size === "lg" ? "px-3.5 py-1.5 text-sm" : "px-2.5 py-0.5 text-xs";
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold border ${className} ${padding}`}>
      <Icon size={11} />
      {label}
    </span>
  );
}
