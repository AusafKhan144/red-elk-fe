import { Link } from "react-router-dom";
import { useSessions } from "../../hooks/useSession";
import { useAssessments } from "../../hooks/useAssessments";
import TierChip from "../../components/TierChip";
import Sparkline from "../../components/Sparkline";
import PageWrapper from "../../components/common/PageWrapper";
import type { MaturityLevel, Session } from "../../types/api";

function SectionHead({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 14, gap: 16 }}>
      <div>
        <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>{title}</h2>
        {sub && <p style={{ margin: "3px 0 0", fontSize: 12.5, color: "var(--muted)" }}>{sub}</p>}
      </div>
      {action}
    </div>
  );
}

function SessionCard({ s, assessmentName }: { s: Session; assessmentName: string }) {
  const isCompleted = s.status === "completed";

  return (
    <div className="re-card" style={{ padding: 0, overflow: "hidden", display: "flex" }}>
      {/* content */}
      <div style={{ flex: 1, padding: "18px 22px", display: "flex", alignItems: "center", gap: 22 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
            {s.tier_at_time && <TierChip tier={s.tier_at_time as MaturityLevel} size="sm" />}
            <span style={{ fontSize: 11.5, color: "var(--faint)" }}>
              {new Date(s.started_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
            </span>
          </div>
          <h3 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 0 }}>{assessmentName}</h3>
        </div>

        {/* status indicator */}
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          {isCompleted ? (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px",
              borderRadius: 999, fontSize: 11.5, fontWeight: 600,
              background: "color-mix(in srgb, var(--t-leading) 10%, var(--surface))",
              color: "var(--t-leading)",
              border: "1px solid color-mix(in srgb, var(--t-leading) 22%, transparent)",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--t-leading)", display: "inline-block" }} />
              Completed
            </span>
          ) : (
            <span style={{
              display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 9px",
              borderRadius: 999, fontSize: 11.5, fontWeight: 600,
              background: "color-mix(in srgb, var(--t-developing) 10%, var(--surface))",
              color: "var(--t-developing)",
              border: "1px solid color-mix(in srgb, var(--t-developing) 22%, transparent)",
            }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: "var(--t-developing)", display: "inline-block", animation: "pulse 2s ease infinite" }} />
              In progress
            </span>
          )}
        </div>

        {/* actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
          {isCompleted ? (
            <Link
              to={`/sessions/${s.id}/report`}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "8px 16px", borderRadius: "var(--radius)",
                background: "var(--accent)", color: "var(--accent-ink)",
                fontWeight: 600, fontSize: 13, textDecoration: "none",
              }}
            >
              View report →
            </Link>
          ) : (
            <Link
              to={`/sessions/${s.id}/quiz`}
              onClick={() => {
                if (s.assessment_slug) {
                  sessionStorage.setItem(`session-${s.id}-slug`, s.assessment_slug);
                }
              }}
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                padding: "8px 16px", borderRadius: "var(--radius)",
                background: "var(--accent)", color: "var(--accent-ink)",
                fontWeight: 600, fontSize: 13, textDecoration: "none",
              }}
            >
              ▶ Resume
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Sessions() {
  const { data: sessions, isLoading } = useSessions();
  const { data: assessments } = useAssessments();

  const assessmentMap = new Map(assessments?.map((a) => [a.id, a]) ?? []);

  const inProgress = (sessions ?? []).filter((s) => s.status === "in_progress");
  const completed = (sessions ?? []).filter((s) => s.status === "completed");

  /* sparkline: use completed sessions count as a simple trend proxy */
  const sparkData = completed.length > 1
    ? completed.slice(0, 8).reverse().map((_, i) => i + 1)
    : [];

  const frameworks = [...new Set(completed.map((s) => s.assessment_id))].length;

  return (
    <PageWrapper>
      <div className="re-fade-in" style={{ display: "flex", flexDirection: "column", gap: 22 }}>

        {/* ── Progress hero ── */}
        <div className="re-card" style={{ padding: 24 }}>
          {completed.length === 0 && !isLoading ? (
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <span className="re-eyebrow" style={{ display: "block", marginBottom: 10 }}>Assessment history</span>
              <p style={{ fontSize: 14, color: "var(--faint)", margin: "0 0 16px" }}>No completed assessments yet.</p>
              <Link
                to="/dashboard"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "9px 20px", borderRadius: "var(--radius)",
                  background: "var(--accent)", color: "var(--accent-ink)",
                  fontWeight: 600, fontSize: 13.5, textDecoration: "none",
                }}
              >
                Browse assessments →
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 28, alignItems: "center" }}>
              <div>
                <span className="re-eyebrow">Overall progress</span>
                <h2 style={{ fontSize: 24, fontWeight: 700, margin: "8px 0 18px", lineHeight: 1.1, color: "var(--ink)" }}>
                  <span style={{ color: "var(--t-leading)" }}>{completed.length} assessment{completed.length !== 1 ? "s" : ""}</span>
                  {" "}completed · {frameworks} framework{frameworks !== 1 ? "s" : ""}
                </h2>
                {sparkData.length >= 2 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 11.5, color: "var(--faint)" }}>Activity</span>
                    <Sparkline data={sparkData} width={200} height={40} color="var(--t-leading)" />
                  </div>
                )}
              </div>

              <Link
                to="/dashboard"
                style={{
                  display: "inline-flex", alignItems: "center", gap: 7, whiteSpace: "nowrap",
                  padding: "9px 16px", borderRadius: "var(--radius)",
                  background: "var(--accent)", color: "var(--accent-ink)",
                  fontWeight: 600, fontSize: 13.5, textDecoration: "none",
                  alignSelf: "center",
                }}
              >
                + New assessment
              </Link>
            </div>
          )}
        </div>

        {/* ── In progress banner ── */}
        {inProgress.length > 0 && (
          <div>
            <SectionHead title="In progress" />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {inProgress.map((s) => (
                <div
                  key={s.id}
                  className="re-card"
                  style={{
                    padding: "16px 20px", display: "flex", alignItems: "center", gap: 16,
                    background: "color-mix(in srgb, var(--accent) 4%, var(--surface))",
                    borderColor: "color-mix(in srgb, var(--accent) 22%, var(--border))",
                  }}
                >
                  <span style={{ width: 10, height: 10, borderRadius: 999, background: "var(--accent)", flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "var(--ink)", marginBottom: 4 }}>
                      {assessmentMap.get(s.assessment_id)?.name ?? "Assessment"}
                    </div>
                  </div>
                  <Link
                    to={`/sessions/${s.id}/quiz`}
                    onClick={() => {
                      if (s.assessment_slug) {
                        sessionStorage.setItem(`session-${s.id}-slug`, s.assessment_slug);
                      }
                    }}
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 7,
                      padding: "8px 16px", borderRadius: "var(--radius)",
                      background: "var(--accent)", color: "var(--accent-ink)",
                      fontWeight: 600, fontSize: 13, textDecoration: "none",
                    }}
                  >
                    ▶ Resume
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Completed sessions ── */}
        {(completed.length > 0 || isLoading) && (
          <div>
            <SectionHead
              title="Completed assessments"
              sub={isLoading ? undefined : `${completed.length} completed · ${frameworks} framework${frameworks !== 1 ? "s" : ""}`}
            />
            {isLoading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ height: 80, borderRadius: "var(--radius-lg)", background: "var(--surface-inset)" }} />
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {completed.map((s) => (
                  <SessionCard
                    key={s.id}
                    s={s}
                    assessmentName={assessmentMap.get(s.assessment_id)?.name ?? "Assessment"}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </PageWrapper>
  );
}
