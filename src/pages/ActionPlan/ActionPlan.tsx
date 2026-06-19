import { Link } from "react-router-dom";
import { ArrowRight, FileText, Users } from "lucide-react";
import PageWrapper from "../../components/common/PageWrapper";
import SectionHead from "../../components/common/SectionHead";
import { useAuth } from "../../context/AuthContext";
import { ACTION_PLAN_PREVIEW, PREVIEW_OVERALL, type PreviewInitiative, type InitiativeStatus } from "../../data/preview";

const STATUS_META: Record<InitiativeStatus, { label: string; color: string }> = {
  "quick-win":  { label: "Quick win",   color: "var(--t-leading)"  },
  recommended:  { label: "Recommended", color: "var(--accent)"     },
  planned:      { label: "Planned",     color: "var(--t-maturing)" },
};
const IMPACT_DOTS: Record<PreviewInitiative["impact"], number> = { High: 3, Medium: 2, Low: 1 };
const STATUS_ORDER: Record<InitiativeStatus, number> = { "quick-win": 0, recommended: 1, planned: 2 };

function PreviewChip() {
  return (
    <span
      className="re-chip"
      style={{
        color: "var(--t-developing)",
        background: "color-mix(in srgb, var(--t-developing) 11%, var(--surface))",
        borderColor: "color-mix(in srgb, var(--t-developing) 26%, transparent)",
      }}
    >
      <span className="dot" style={{ background: "var(--t-developing)" }} />
      Preview · sample data
    </span>
  );
}

function MetaPill({ label, value, color }: { label: string; value: React.ReactNode; color?: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "var(--muted)" }}>
      <span style={{ color: "var(--faint)" }}>{label}</span>
      <span style={{ fontWeight: 600, color: color ?? "var(--ink)" }}>{value}</span>
    </span>
  );
}

function InitiativeCard({ it }: { it: PreviewInitiative }) {
  const st = STATUS_META[it.status];
  return (
    <div className="re-card" style={{ padding: 0, overflow: "hidden", display: "flex" }}>
      <div style={{ width: 4, background: st.color, flexShrink: 0 }} />
      <div style={{ padding: 18, flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 14 }}>
          <div style={{ minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7, flexWrap: "wrap" }}>
              <span
                className="re-chip"
                style={{
                  color: st.color,
                  background: `color-mix(in srgb, ${st.color} 11%, var(--surface))`,
                  borderColor: `color-mix(in srgb, ${st.color} 26%, transparent)`,
                }}
              >
                <span className="dot" style={{ background: st.color }} />
                {st.label}
              </span>
              <span style={{ fontSize: 11.5, color: "var(--faint)" }}>{it.dimension}</span>
            </div>
            <h3 style={{ fontSize: 15.5, fontWeight: 600, marginBottom: 6, color: "var(--ink)" }}>{it.title}</h3>
            <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", lineHeight: 1.5, maxWidth: 560 }}>{it.desc}</p>
          </div>
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: "var(--t-leading)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              +{it.lift}
            </div>
            <div style={{ fontSize: 10.5, color: "var(--faint)", marginTop: 2 }}>pts lift</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 18, marginTop: 14, paddingTop: 13, borderTop: "1px solid var(--border)", flexWrap: "wrap" }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--muted)" }}>
            <span style={{ color: "var(--faint)" }}>Impact</span>
            <span style={{ display: "inline-flex", gap: 2 }}>
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: 999,
                    background: n <= IMPACT_DOTS[it.impact] ? "var(--accent)" : "var(--border-strong)",
                  }}
                />
              ))}
            </span>
            <span style={{ fontWeight: 600 }}>{it.impact}</span>
          </span>
          <MetaPill label="Effort" value={it.effort} />
          <MetaPill label="Timeframe" value={`~${it.weeks} wks`} />
          <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "var(--muted)", marginLeft: "auto" }}>
            <Users size={13} /> {it.owner}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function ActionPlan() {
  const { user } = useAuth();
  const { summary, items } = ACTION_PLAN_PREVIEW;
  const projected = PREVIEW_OVERALL + summary.estLift;
  const reportId = user?.maturity_summary?.as_of_session_id ?? null;
  const sorted = [...items].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);

  return (
    <PageWrapper>
      <div className="re-fade-in" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {/* Projected lift hero */}
        <div className="re-card grid grid-cols-1 lg:grid-cols-[1.3fr_1fr]" style={{ padding: 22, gap: 24, alignItems: "center" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <span className="re-eyebrow" style={{ color: "var(--accent)" }}>Recommended roadmap</span>
              <PreviewChip />
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-.015em", margin: "8px 0 10px", lineHeight: 1.1, color: "var(--ink)" }}>
              Six moves to reach <span style={{ color: "var(--t-leading)" }}>Leading</span>
            </h1>
            <p style={{ margin: 0, fontSize: 13.5, color: "var(--muted)", lineHeight: 1.55, maxWidth: 440 }}>
              Prioritised from your assessment by projected impact and effort. Start with the two quick wins to
              build momentum. These recommendations are illustrative — personalised plans are coming soon.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
              <span style={{ fontSize: 12.5, color: "var(--muted)" }}>Projected maturity</span>
              <span style={{ fontSize: 12, color: "var(--faint)" }}>if completed</span>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
              <span style={{ fontFamily: "var(--font-mono)", fontSize: 22, color: "var(--faint)", fontVariantNumeric: "tabular-nums" }}>
                {PREVIEW_OVERALL}
              </span>
              <ArrowRight size={16} style={{ color: "var(--faint)", alignSelf: "center" }} />
              <span style={{ fontSize: 38, fontWeight: 800, color: "var(--t-leading)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                {projected}
              </span>
            </div>
            <div style={{ position: "relative", height: 10, borderRadius: 999, background: "var(--surface-inset)", overflow: "hidden", boxShadow: "var(--inner-line)" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${PREVIEW_OVERALL}%`, background: "var(--t-maturing)", borderRadius: 999 }} />
              <div
                style={{
                  position: "absolute",
                  left: `${PREVIEW_OVERALL}%`,
                  top: 0,
                  bottom: 0,
                  width: `${summary.estLift}%`,
                  background:
                    "repeating-linear-gradient(45deg, var(--t-leading), var(--t-leading) 4px, color-mix(in srgb, var(--t-leading) 65%, #fff) 4px, color-mix(in srgb, var(--t-leading) 65%, #fff) 8px)",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 18, flexWrap: "wrap" }}>
              <MetaPill label="Initiatives" value={summary.initiatives} />
              <MetaPill label="Quick wins" value={summary.quickWins} color="var(--t-leading)" />
              <MetaPill label="Est. lift" value={`+${summary.estLift} pts`} color="var(--t-leading)" />
            </div>
          </div>
        </div>

        {/* Initiative list */}
        <div>
          <SectionHead
            title="Prioritised initiatives"
            sub="Ordered by impact and speed to value."
            action={
              reportId ? (
                <Link
                  to={`/sessions/${reportId}/report`}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 14px",
                    borderRadius: "var(--radius)",
                    background: "var(--surface-inset)",
                    border: "1px solid var(--border)",
                    color: "var(--ink)",
                    fontWeight: 600,
                    fontSize: 13,
                    whiteSpace: "nowrap",
                  }}
                >
                  <FileText size={13} /> Back to report
                </Link>
              ) : undefined
            }
          />
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {sorted.map((it) => (
              <InitiativeCard key={it.id} it={it} />
            ))}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
