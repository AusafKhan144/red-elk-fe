import { Link } from "react-router-dom";
import { ArrowRight, Download, User as UserIcon } from "lucide-react";
import PageWrapper from "../../../components/common/PageWrapper";
import SectionHead from "../../../components/common/SectionHead";
import DonutChart from "../../../components/DonutChart";
import DimensionBar from "../../../components/DimensionBar";
import TierChip from "../../../components/TierChip";
import StatusChip from "../../../components/StatusChip";
import SubscriptionBadge from "../../../components/SubscriptionBadge";
import { useAdminAnalytics, useAdminSessions, exportAdminSessions } from "../../../hooks/useAdmin";
import type { MaturityLevel } from "../../../types/api";

const TIER_SEGMENTS = [
  { tier: "free" as const, label: "Free", color: "var(--faint)" },
  { tier: "basic" as const, label: "Basic", color: "var(--t-maturing)" },
  { tier: "premium" as const, label: "Premium", color: "var(--t-developing)" },
];

function maturityFromScore(score: number): MaturityLevel {
  if (score < 30) return "nascent";
  if (score < 55) return "developing";
  if (score < 75) return "maturing";
  return "leading";
}

function StatCard({ label, value, sub }: { label: string; value: React.ReactNode; sub?: React.ReactNode }) {
  return (
    <div className="re-card" style={{ padding: "16px 17px", display: "flex", flexDirection: "column", gap: 8 }}>
      <span className="re-eyebrow">{label}</span>
      <span style={{ fontSize: 30, fontWeight: 800, lineHeight: 1, color: "var(--ink)", fontVariantNumeric: "tabular-nums" }}>
        {value}
      </span>
      {sub && <span style={{ fontSize: 12, color: "var(--faint)" }}>{sub}</span>}
    </div>
  );
}

export default function AdminAnalytics() {
  const { data, isLoading } = useAdminAnalytics();
  const { data: recentSessions } = useAdminSessions(0);

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center py-24">
        <div
          className="w-8 h-8 border-4 rounded-full animate-spin"
          style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}
        />
      </div>
    );
  }

  const completionRate =
    data.total_sessions > 0 ? `${Math.round((data.completed_sessions / data.total_sessions) * 100)}%` : "—";
  const avgScore = data.avg_overall_score != null ? Math.round(data.avg_overall_score) : null;
  const segments = TIER_SEGMENTS.map((s) => ({
    label: s.label,
    value: data.sessions_by_tier[s.tier] ?? 0,
    color: s.color,
  }));
  const weakest = [...data.dimensions].sort((a, b) => a.avg_score - b.avg_score);
  const recent = recentSessions?.slice(0, 6) ?? [];

  return (
    <PageWrapper>
      <div className="re-fade-in" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: 14 }}>
          <StatCard label="Total sessions" value={data.total_sessions} sub="all time" />
          <StatCard label="Completed" value={data.completed_sessions} sub="finished assessments" />
          <StatCard label="Completion rate" value={completionRate} sub="of started sessions" />
          <StatCard
            label="Avg. maturity score"
            value={avgScore ?? "—"}
            sub={avgScore != null ? <TierChip tier={maturityFromScore(avgScore)} size="sm" /> : "no completed sessions"}
          />
        </div>

        {/* Plan distribution + weakest dimensions */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.25fr]" style={{ gap: 18 }}>
          <div className="re-card" style={{ padding: 22 }}>
            <SectionHead title="Sessions by plan" sub="Subscription tier at time of session" />
            <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
              <DonutChart segments={segments} centerValue={String(data.total_sessions)} centerLabel="sessions" />
              <div style={{ display: "flex", flexDirection: "column", gap: 9, flex: 1 }}>
                {segments.map((s) => (
                  <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <span style={{ width: 9, height: 9, borderRadius: 3, background: s.color, flexShrink: 0 }} />
                    <span style={{ fontSize: 12.5, flex: 1, color: "var(--ink)" }}>{s.label}</span>
                    <span style={{ fontSize: 12.5, fontWeight: 600, fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", color: "var(--ink)" }}>
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="re-card" style={{ padding: 22 }}>
            <SectionHead title="Weakest dimensions" sub="Where companies struggle most" />
            <div style={{ borderTop: "1px solid var(--border)" }}>
              {weakest.map((d, i) => (
                <DimensionBar key={d.dimension_id} label={d.dimension_name} score={Math.round(d.avg_score)} delay={i * 70} />
              ))}
              {weakest.length === 0 && (
                <p style={{ padding: "16px 0 4px", fontSize: 13, color: "var(--faint)" }}>No dimension data yet.</p>
              )}
            </div>
          </div>
        </div>

        {/* Recent sessions */}
        <div className="re-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "18px 22px 0" }}>
            <SectionHead
              title="Recent sessions"
              action={
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => exportAdminSessions()}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "7px 13px",
                      borderRadius: "var(--radius)",
                      background: "var(--surface-inset)",
                      border: "1px solid var(--border)",
                      color: "var(--ink)",
                      fontWeight: 600,
                      fontSize: 12.5,
                      cursor: "pointer",
                    }}
                  >
                    Export <Download size={13} />
                  </button>
                  <Link
                    to="/admin/sessions"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "7px 13px",
                      borderRadius: "var(--radius)",
                      background: "var(--surface-inset)",
                      border: "1px solid var(--border)",
                      color: "var(--ink)",
                      fontWeight: 600,
                      fontSize: 12.5,
                    }}
                  >
                    View all <ArrowRight size={13} />
                  </Link>
                </div>
              }
            />
          </div>
          <div
            className="hidden sm:grid"
            style={{ gridTemplateColumns: "1fr auto auto auto", padding: "0 22px 8px", gap: 12 }}
          >
            {["User", "Plan", "Status", "Started"].map((h, i) => (
              <span key={h} className="re-eyebrow" style={{ textAlign: i === 0 ? "left" : "right" }}>
                {h}
              </span>
            ))}
          </div>
          <div>
            {recent.map((s) => (
              <div
                key={s.id}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto auto auto",
                  gap: 12,
                  alignItems: "center",
                  padding: "12px 22px",
                  borderTop: "1px solid var(--border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 11, minWidth: 0 }}>
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 9,
                      background: "var(--surface-inset)",
                      color: "var(--muted)",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <UserIcon size={15} />
                  </span>
                  <div style={{ minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: 13,
                        fontWeight: 600,
                        fontFamily: "var(--font-mono)",
                        color: "var(--ink)",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {s.user_id.slice(0, 8)}…
                    </div>
                    <div style={{ fontSize: 11, color: "var(--faint)", fontFamily: "var(--font-mono)" }}>
                      {s.assessment_id.slice(0, 8)}…
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  {s.tier_at_time ? <SubscriptionBadge tier={s.tier_at_time} /> : <span style={{ color: "var(--faint)" }}>—</span>}
                </div>
                <div style={{ textAlign: "right" }}>
                  <StatusChip status={s.status} />
                </div>
                <span
                  style={{
                    fontSize: 11.5,
                    color: "var(--faint)",
                    textAlign: "right",
                    fontFamily: "var(--font-mono)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {new Date(s.started_at).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                </span>
              </div>
            ))}
            {recent.length === 0 && (
              <p style={{ padding: "16px 22px", fontSize: 13, color: "var(--faint)", borderTop: "1px solid var(--border)" }}>
                No sessions yet.
              </p>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
