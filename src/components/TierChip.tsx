import type { MaturityLevel } from "../types/api";

const TIER_META: Record<MaturityLevel, { label: string; color: string }> = {
  nascent:    { label: "Nascent",    color: "var(--t-nascent)"    },
  developing: { label: "Developing", color: "var(--t-developing)" },
  maturing:   { label: "Maturing",   color: "var(--t-maturing)"   },
  leading:    { label: "Leading",    color: "var(--t-leading)"    },
};

interface Props {
  tier: MaturityLevel;
  size?: "sm" | "md";
}

export default function TierChip({ tier, size = "md" }: Props) {
  const meta = TIER_META[tier] ?? TIER_META.developing;
  const fs = size === "sm" ? 10 : 11;
  const pad = size === "sm" ? "2px 8px 2px 6px" : "3px 10px 3px 8px";
  const dotSize = size === "sm" ? 6 : 7;

  return (
    <span
      className="re-chip"
      style={{
        padding: pad,
        fontSize: fs,
        color: meta.color,
        background: `color-mix(in srgb, ${meta.color} 11%, var(--surface))`,
        borderColor: `color-mix(in srgb, ${meta.color} 26%, transparent)`,
      }}
    >
      <span
        className="dot"
        style={{ width: dotSize, height: dotSize, background: meta.color }}
      />
      {meta.label}
    </span>
  );
}
