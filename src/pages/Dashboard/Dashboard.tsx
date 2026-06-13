import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Layers, BarChart3, Hourglass, Award, LineChart, Play, ArrowRight, BarChart2, Compass } from "lucide-react";
import { useAssessments } from "../../hooks/useAssessments";
import { useSessions } from "../../hooks/useSession";
import { useAuth } from "../../context/AuthContext";
import ScoreDial from "../../components/ScoreDial";
import Sparkline from "../../components/Sparkline";
import TierChip from "../../components/TierChip";
import DimensionBar from "../../components/DimensionBar";
import Radar from "../../components/Radar";
import type { Session, MaturityLevel, RadarPoint } from "../../types/api";
import PageWrapper from "../../components/common/PageWrapper";

function tierColorVar(tier: MaturityLevel): string {
  return `var(--t-${tier})`;
}

function SectionHead({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
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

function MetricCard({ label, value, sub, icon: Icon }: { label: string; value: React.ReactNode; sub?: string; icon: React.ElementType }) {
  return (
    <div className="re-card" style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span className="re-eyebrow">{label}</span>
        <span style={{ color: "var(--faint)", display: "flex" }}><Icon size={15} /></span>
      </div>
      <div style={{ fontSize: 32, fontWeight: 700, lineHeight: 1, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontSize: 12, color: "var(--faint)" }}>{sub}</div>
      )}
    </div>
  );
}

const TIERS: { key: MaturityLevel; label: string; range: string; color: string }[] = [
  { key: "nascent",    label: "Nascent",    range: "0–30",   color: "var(--t-nascent)"    },
  { key: "developing", label: "Developing", range: "30–55",  color: "var(--t-developing)" },
  { key: "maturing",   label: "Maturing",   range: "55–75",  color: "var(--t-maturing)"   },
  { key: "leading",    label: "Leading",    range: "75–100", color: "var(--t-leading)"    },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { data: assessments, isLoading: loadingA } = useAssessments();
  const { data: sessions, isLoading: loadingS } = useSessions();
  const [dimView, setDimView] = useState<"bars" | "radar">("bars");

  const inProgress: Session[] = sessions?.filter((s) => s.status === "in_progress") ?? [];
  const completed: Session[] = sessions?.filter((s) => s.status === "completed") ?? [];

  const resume = inProgress[0] ?? null;

  // Use maturity_summary from the user profile — no extra report fetch needed
  const summary = user?.maturity_summary ?? null;
  const overallScore = summary?.overall_score ?? null;
  const tier = summary?.tier_result ?? null;
  const radarData: RadarPoint[] = summary?.radar_data ?? [];
  const reportSessionId = summary?.as_of_session_id ?? null;

  // Real sparkline scores from completed sessions (oldest→newest)
  const sparklineScores = completed
    .slice(0, 8)
    .reverse()
    .map((s) => s.score ?? 0)
    .filter((v) => v > 0);

  return (
    <PageWrapper>
      <div className="re-fade-in" style={{ display: "flex", flexDirection: "column", gap: 26 }}>

        {/* ── Hero row ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 18 }}>
          {/* maturity score panel */}
          <div className="re-card" style={{ padding: 22, display: "flex", gap: 26, alignItems: "center" }}>
            {overallScore !== null ? (
              <>
                <ScoreDial score={overallScore} size={132} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span className="re-eyebrow">Overall AI maturity</span>
                    {tier && <TierChip tier={tier} size="sm" />}
                  </div>
                  <p style={{ margin: "0 0 14px", fontSize: 13.5, color: "var(--muted)", lineHeight: 1.5 }}>
                    Based on your most recent completed assessment across all dimensions.
                  </p>
                  {sparklineScores.length >= 2 && (
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ fontSize: 11.5, color: "var(--faint)" }}>Score trend</div>
                      <Sparkline
                        data={sparklineScores}
                        width={120} height={30}
                        color={tier ? tierColorVar(tier) : "var(--accent)"}
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div style={{ flex: 1, textAlign: "center", padding: "24px 0" }}>
                <span className="re-eyebrow" style={{ display: "block", marginBottom: 10 }}>Overall AI maturity</span>
                <p style={{ fontSize: 13.5, color: "var(--faint)", margin: 0 }}>
                  {loadingS ? "Loading…" : "Complete an assessment to see your score"}
                </p>
              </div>
            )}
          </div>

          {/* resume / next action */}
          <div className="re-card" style={{ padding: 0, overflow: "hidden", display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "14px 18px 12px", borderBottom: "1px solid var(--border)" }}>
              <span className="re-eyebrow">Continue</span>
            </div>
            <div style={{ padding: 18, display: "flex", flexDirection: "column", gap: 14, flex: 1 }}>
              {resume ? (
                <>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
                      <span style={{ width: 7, height: 7, borderRadius: 999, background: "var(--t-developing)", display: "inline-block" }} />
                      <span style={{ fontSize: 11.5, color: "var(--faint)" }}>In progress</span>
                    </div>
                    <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 10, color: "var(--ink)" }}>
                      {resume.assessment_name ?? "Assessment"}
                    </h3>
                    {/* Real progress from API */}
                    <div style={{ height: 6, borderRadius: 999, background: "var(--surface-inset)", overflow: "hidden" }}>
                      <div style={{ width: `${resume.progress_pct ?? 0}%`, height: "100%", background: "var(--accent)", borderRadius: 999 }} />
                    </div>
                    <div style={{ fontSize: 11.5, color: "var(--muted)", marginTop: 6 }}>
                      {resume.progress_pct != null ? `${resume.progress_pct}% complete` : "In progress"}
                    </div>
                  </div>
                  <Link
                    to={`/sessions/${resume.id}/quiz`}
                    onClick={() => {
                      if (resume.assessment_slug) {
                        sessionStorage.setItem(`session-${resume.id}-slug`, resume.assessment_slug);
                      }
                    }}
                    style={{
                      marginTop: "auto",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      padding: "9px 16px", borderRadius: "var(--radius)",
                      background: "var(--accent)", color: "var(--accent-ink)",
                      fontWeight: 600, fontSize: 13.5, textDecoration: "none",
                      transition: "background .15s",
                    }}
                  >
                    <Play size={14} fill="currentColor" /> Resume assessment
                  </Link>
                </>
              ) : (
                <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12 }}>
                  <p style={{ fontSize: 13, color: "var(--faint)", textAlign: "center", margin: 0 }}>
                    No assessments in progress
                  </p>
                  <Link
                    to="/assessments"
                    style={{
                      display: "inline-flex", alignItems: "center", gap: 6,
                      padding: "8px 16px", borderRadius: "var(--radius)",
                      background: "var(--surface-inset)", color: "var(--ink)",
                      fontWeight: 600, fontSize: 13, textDecoration: "none",
                      border: "1px solid var(--border)",
                    }}
                  >
                    + Start an assessment
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Metric cards ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          <MetricCard label="Sessions done"   value={loadingS ? "—" : completed.length}          icon={Layers} />
          <MetricCard label="Assessments"     value={loadingA ? "—" : (assessments?.length ?? 0)} icon={BarChart3} />
          <MetricCard label="In progress"     value={loadingS ? "—" : inProgress.length}          icon={Hourglass} />
          <MetricCard
            label="Current tier"
            value={
              user?.tier
                ? <span style={{ fontSize: 15, marginTop: 2, display: "block" }}>
                    {user.tier.charAt(0).toUpperCase() + user.tier.slice(1)}
                  </span>
                : "—"
            }
            icon={Award}
          />
        </div>

        {/* ── Dimension matrix (only when maturity summary available) ── */}
        {radarData.length > 0 && (
          <div className="re-card" style={{ padding: 22 }}>
            <SectionHead
              title="Maturity by dimension"
              sub="Scored 0–100 across the four maturity tiers."
              action={
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div style={{
                    display: "flex", padding: 3,
                    background: "var(--surface-inset)", borderRadius: "var(--radius)",
                    border: "1px solid var(--border)",
                  }}>
                    {([["bars", BarChart2], ["radar", Compass]] as const).map(([id, Icon]) => (
                      <button
                        key={id}
                        title={id === "bars" ? "Bar chart" : "Radar chart"}
                        onClick={() => setDimView(id)}
                        style={{
                          padding: "5px 10px", border: "none",
                          borderRadius: "calc(var(--radius) - 4px)",
                          cursor: "pointer",
                          background: dimView === id ? "var(--surface)" : "transparent",
                          boxShadow: dimView === id ? "var(--card-shadow)" : "none",
                          color: dimView === id ? "var(--ink)" : "var(--faint)",
                          display: "flex",
                          transition: "all .15s var(--ease)",
                        }}
                      >
                        <Icon size={14} />
                      </button>
                    ))}
                  </div>
                  {reportSessionId && (
                    <Link
                      to={`/sessions/${reportSessionId}/report`}
                      style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        padding: "7px 13px", borderRadius: "var(--radius)",
                        background: "var(--surface-inset)", color: "var(--ink)",
                        fontWeight: 600, fontSize: 12.5, textDecoration: "none",
                        border: "1px solid var(--border)",
                      }}
                    >
                      Full report <ArrowRight size={13} />
                    </Link>
                  )}
                </div>
              }
            />

            {dimView === "bars" ? (
              <>
                <div style={{ display: "flex", gap: 16, marginBottom: 6, paddingLeft: 176 }}>
                  {TIERS.map((t) => (
                    <span key={t.key} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--muted)" }}>
                      <span style={{ width: 8, height: 8, borderRadius: 2, background: t.color, display: "inline-block" }} />
                      {t.label}
                      <span style={{ color: "var(--faint)", fontFamily: "var(--font-mono)", fontSize: 10 }}>{t.range}</span>
                    </span>
                  ))}
                </div>
                <div style={{ borderTop: "1px solid var(--border)" }}>
                  {radarData.map((d: RadarPoint, i: number) => (
                    <DimensionBar key={d.dimension} label={d.label} score={d.score} delay={i * 90} />
                  ))}
                </div>
              </>
            ) : (
              <div style={{ display: "flex", justifyContent: "center", padding: "10px 0" }}>
                <Radar data={radarData} size={288} color={tier ? tierColorVar(tier) : "var(--accent)"} />
              </div>
            )}
          </div>
        )}

        {/* ── Available assessments + recent sessions ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          {/* available assessments */}
          <div>
            <SectionHead title="Available assessments" />
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {loadingA ? (
                <SkeletonCard />
              ) : !assessments || assessments.length === 0 ? (
                <EmptyCard message="No assessments available yet." />
              ) : (
                assessments.map((a) => (
                  <div
                    key={a.id}
                    className="re-card re-card-hover"
                    style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10, cursor: "pointer" }}
                    onClick={() => navigate("/assessments")}
                  >
                    <div>
                      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 4, color: "var(--ink)" }}>{a.name}</h3>
                      {a.description && (
                        <p style={{ margin: 0, fontSize: 12.5, color: "var(--muted)", lineHeight: 1.45 }}>{a.description}</p>
                      )}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11.5, color: "var(--faint)" }}>
                      <span style={{ fontFamily: "var(--font-mono)" }}>v{a.version}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* recent sessions */}
          <div>
            <SectionHead
              title="Recent sessions"
              action={
                <Link
                  to="/sessions"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 4,
                    padding: "6px 12px", borderRadius: "var(--radius)",
                    background: "var(--surface-inset)", color: "var(--ink)",
                    fontWeight: 600, fontSize: 12.5, textDecoration: "none",
                    border: "1px solid var(--border)",
                  }}
                >
                  All <ArrowRight size={13} />
                </Link>
              }
            />
            {loadingS ? (
              <SkeletonCard />
            ) : completed.length === 0 ? (
              <EmptyCard message="No completed sessions yet." />
            ) : (
              <div className="re-card" style={{ overflow: "hidden" }}>
                {completed.slice(0, 5).map((s, i, arr) => (
                  <Link
                    key={s.id}
                    to={`/sessions/${s.id}/report`}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "14px 16px",
                      borderBottom: i < arr.length - 1 ? "1px solid var(--border)" : "none",
                      textDecoration: "none",
                    }}
                  >
                    <div style={{
                      width: 38, height: 38, borderRadius: 10,
                      background: "var(--surface-inset)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      color: "var(--muted)", flexShrink: 0,
                    }}>
                      <LineChart size={17} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontSize: 13.5, fontWeight: 600, color: "var(--ink)",
                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      }}>
                        {s.assessment_name ?? "Assessment"}
                      </div>
                      <div style={{ fontSize: 11.5, color: "var(--faint)" }}>
                        {new Date(s.started_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                      {s.score != null && (
                        <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 700, color: "var(--ink)" }}>
                          {Math.round(s.score)}
                        </span>
                      )}
                      {s.tier_result && <TierChip tier={s.tier_result} size="sm" />}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}

function EmptyCard({ message }: { message: string }) {
  return (
    <div style={{
      padding: "32px 24px", textAlign: "center",
      border: "1px dashed var(--border)", borderRadius: "var(--radius-lg)",
    }}>
      <p style={{ fontSize: 13, color: "var(--faint)", margin: 0 }}>{message}</p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{
      height: 80, borderRadius: "var(--radius-lg)",
      background: "var(--surface-inset)",
      animation: "pulse 2s ease-in-out infinite",
    }} />
  );
}
