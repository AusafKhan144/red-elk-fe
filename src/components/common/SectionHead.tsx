interface Props {
  title: string;
  sub?: string;
  action?: React.ReactNode;
}

export default function SectionHead({ title, sub, action }: Props) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14, gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 15, fontWeight: 700, letterSpacing: "-.01em", color: "var(--ink)" }}>{title}</h2>
        {sub && <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--muted)" }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}
