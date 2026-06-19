import { Zap, Star, Circle } from "lucide-react";
import type { SubscriptionTier } from "../types/api";

const config: Record<SubscriptionTier, {
  label: string;
  icon: React.ElementType;
  color: string;
}> = {
  free:    { label: "Free",    icon: Circle, color: "var(--faint)"        },
  basic:   { label: "Basic",   icon: Zap,    color: "var(--t-maturing)"   },
  premium: { label: "Premium", icon: Star,   color: "var(--t-developing)" },
};

interface Props {
  tier: SubscriptionTier;
  size?: "sm" | "md" | "lg";
}

export default function SubscriptionBadge({ tier, size = "md" }: Props) {
  const { label, icon: Icon, color } = config[tier] ?? config.free;
  const fs = size === "lg" ? 13 : 11;
  const pad = size === "lg" ? "5px 14px" : "2px 9px";
  return (
    <span
      className="re-chip"
      style={{
        padding: pad,
        fontSize: fs,
        color,
        background: `color-mix(in srgb, ${color} 11%, var(--surface))`,
        borderColor: `color-mix(in srgb, ${color} 26%, transparent)`,
      }}
    >
      <Icon size={size === "lg" ? 13 : 11} />
      {label}
    </span>
  );
}
