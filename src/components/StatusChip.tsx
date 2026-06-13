type SessionStatus = "completed" | "in_progress" | "abandoned";

const STATUS_META: Record<SessionStatus, { label: string; color: string }> = {
  completed:   { label: "Completed",   color: "var(--t-leading)"    },
  in_progress: { label: "In progress", color: "var(--t-developing)" },
  abandoned:   { label: "Abandoned",   color: "var(--faint)"        },
};

interface Props {
  status: SessionStatus;
}

export default function StatusChip({ status }: Props) {
  const meta = STATUS_META[status] ?? STATUS_META.in_progress;
  return (
    <span
      className="re-chip"
      style={{
        color: meta.color,
        background: `color-mix(in srgb, ${meta.color} 11%, var(--surface))`,
        borderColor: `color-mix(in srgb, ${meta.color} 26%, transparent)`,
      }}
    >
      <span className="dot" style={{ background: meta.color }} />
      {meta.label}
    </span>
  );
}
