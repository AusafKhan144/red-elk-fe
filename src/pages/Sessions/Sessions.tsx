import { Link } from "react-router-dom";
import { useSessions } from "../../hooks/useSession";
import TierChip from "../../components/TierChip";
import Sparkline from "../../components/Sparkline";
import Radar from "../../components/Radar";
import SectionHead from "../../components/common/SectionHead";
import PageWrapper from "../../components/common/PageWrapper";
import type { MaturityLevel, RadarPoint, Session } from "../../types/api";

/* ── helpers ─────────────────────────────────────────────────────── */

function tierColor(score: number): string {
  if (score < 30) return "var(--t-nascent)";
  if (score < 55) return "var(--t-developing)";
  if (score < 75) return "var(--t-maturing)";
  return "var(--t-leading)";
}

function sessionTime(s: Session): number {
  return new Date(s.completed_at ?? s.started_at).getTime();
}

const fullDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const monthYear = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", { month: "short", year: "numeric" });

const ICONS: Record<string, string> = {
  trend: "M22 7l-8.5 8.5-5-5L2 17M16 7h6v6",
  flag: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V4s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22V4",
  arrowR: "M5 12h14M13 6l6 6-6 6",
  play: "M6 4l14 8-14 8z",
  plus: "M12 5v14M5 12h14",
};

function Icon({ name, size = 14, fill = false }: { name: keyof typeof ICONS; size?: number; fill?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill ? "currentColor" : "none"}
      stroke={fill ? "none" : "currentColor"}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      style={{ flexShrink: 0 }}
    >
      <path d={ICONS[name]} />
    </svg>
  );
}

const primaryBtn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
  padding: "8px 16px", borderRadius: "var(--radius)",
  background: "var(--accent)", color: "var(--accent-ink)",
  fontWeight: 600, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap",
};
const ghostBtn: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 7,
  padding: "8px 16px", borderRadius: "var(--radius)",
  background: "var(--surface)", color: "var(--ink)",
  border: "1px solid var(--border-strong)",
  fontWeight: 600, fontSize: 13, textDecoration: "none", whiteSpace: "nowrap",
};

/* ── session card ────────────────────────────────────────────────── */

function SessionCard({ s }: { s: Session }) {
  const score = Math.round(s.score ?? 0);
  const color = tierColor(score);
  const dims = (s.dimension_scores ?? []).filter((d): d is RadarPoint => d != null);
  const hasDims = dims.length >= 3;

  const sorted = [...dims].sort((a, b) => b.score - a.score);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  return (
    <div className="re-card re-card-hover" style={{ padding: 0, overflow: "hidden", display: "flex" }}>
      {/* mini radar panel */}
      {hasDims && (
        <div
          style={{
            width: 172, flexShrink: 0, borderRight: "1px solid var(--border)",
            background: "var(--surface-2)", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", padding: "16px 12px", gap: 10,
          }}
        >
          <Radar data={dims} size={136} color={color} hideLabels />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 3, justifyContent: "center" }}>
            {dims.map((d) => (
              <span
                key={d.dimension}
                style={{
                  fontSize: 9.5, fontWeight: 600, color: "var(--faint)",
                  background: "var(--surface-inset)", padding: "2px 5px", borderRadius: 4,
                }}
              >
                {d.label.replace("Infrastructure", "Infra").split(" ")[0]}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* content */}
      <div style={{ flex: 1, padding: "18px 22px", display: "flex", alignItems: "center", gap: 22, flexWrap: "wrap" }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
            {s.tier_result && <TierChip tier={s.tier_result} size="sm" />}
            <span style={{ fontSize: 11.5, color: "var(--faint)" }}>
              {fullDate(s.completed_at ?? s.started_at)}
            </span>
          </div>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", marginBottom: hasDims ? 12 : 0 }}>
            {s.assessment_name ?? "Assessment"}
          </h3>

          {hasDims && (
            <div style={{ display: "flex", gap: 24 }}>
              <div>
                <div style={{ fontSize: 10.5, color: "var(--faint)", marginBottom: 3, letterSpacing: ".03em", textTransform: "uppercase" }}>
                  Strongest
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--t-leading)", display: "flex", alignItems: "center", gap: 5 }}>
                  <Icon name="trend" size={13} /> {strongest.label}
                  <span style={{ fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", fontSize: 12, color: "var(--faint)" }}>
                    {Math.round(strongest.score)}
                  </span>
                </div>
              </div>
              <div style={{ width: 1, background: "var(--border)" }} />
              <div>
                <div style={{ fontSize: 10.5, color: "var(--faint)", marginBottom: 3, letterSpacing: ".03em", textTransform: "uppercase" }}>
                  Biggest gap
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--accent)", display: "flex", alignItems: "center", gap: 5 }}>
                  <Icon name="flag" size={13} /> {weakest.label}
                  <span style={{ fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", fontSize: 12, color: "var(--faint)" }}>
                    {Math.round(weakest.score)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* score */}
        <div style={{ textAlign: "center", flexShrink: 0 }}>
          <div style={{ fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", fontSize: 52, lineHeight: 1, fontWeight: 700, color }}>
            {score}
          </div>
          <div style={{ fontSize: 12, color: "var(--faint)", marginTop: 2 }}>/ 100</div>
        </div>

        {/* actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8, flexShrink: 0 }}>
          <Link to={`/sessions/${s.id}/report`} style={primaryBtn}>
            View report <Icon name="arrowR" size={14} />
          </Link>
          <Link to="/assessments" style={ghostBtn}>
            <Icon name="play" size={13} fill /> Retake
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ── page ────────────────────────────────────────────────────────── */

export default function Sessions() {
  const { data: sessions, isLoading } = useSessions();

  const all = sessions ?? [];
  const inProgress = all.filter((s) => s.status === "in_progress");
  const completed = all
    .filter((s) => s.status === "completed")
    .sort((a, b) => sessionTime(b) - sessionTime(a)); // newest first

  const frameworks = [...new Set(completed.map((s) => s.assessment_id))].length;

  // Progress hero is driven by the most-assessed framework (the one with the
  // longest history), shown oldest → newest so the trend reads left-to-right.
  const byAssessment = new Map<string, Session[]>();
  for (const s of completed) {
    const arr = byAssessment.get(s.assessment_id) ?? [];
    arr.push(s);
    byAssessment.set(s.assessment_id, arr);
  }
  let primary: Session[] = [];
  for (const arr of byAssessment.values()) {
    if (arr.length > primary.length) primary = arr;
  }
  const series = [...primary].sort((a, b) => sessionTime(a) - sessionTime(b)); // oldest first
  const scores = series.map((s) => Math.round(s.score ?? 0));
  const scoreGain = scores.length >= 2 ? scores[scores.length - 1] - scores[0] : 0;
  const heroName = series[0]?.assessment_name ?? "Assessment";
  const heroColor = tierColor(scores[scores.length - 1] ?? 0);

  return (
    <PageWrapper>
      <div className="re-fade-in" style={{ display: "flex", flexDirection: "column", gap: 22 }}>

        {/* ── Progress hero ── */}
        {completed.length === 0 && !isLoading ? (
          <div className="re-card" style={{ padding: 24 }}>
            <div style={{ textAlign: "center", padding: "24px 0" }}>
              <span className="re-eyebrow" style={{ display: "block", marginBottom: 10 }}>Assessment history</span>
              <p style={{ fontSize: 14, color: "var(--faint)", margin: "0 0 16px" }}>No completed assessments yet.</p>
              <Link to="/dashboard" style={{ ...primaryBtn, padding: "9px 20px", fontSize: 13.5 }}>
                Browse assessments <Icon name="arrowR" size={14} />
              </Link>
            </div>
          </div>
        ) : completed.length > 0 ? (
          <div className="re-card" style={{ padding: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 28, alignItems: "center" }}>
              <div>
                <span className="re-eyebrow">{heroName} · overall progress</span>
                <h2 className="display" style={{ fontFamily: "var(--font-display)", fontSize: 26, margin: "8px 0 18px", lineHeight: 1.1, fontWeight: 700, color: "var(--ink)" }}>
                  {scoreGain !== 0 ? (
                    <>
                      <span style={{ color: scoreGain > 0 ? "var(--t-leading)" : "var(--accent)" }}>
                        {scoreGain > 0 ? "+" : ""}{scoreGain} points
                      </span>{" "}
                      across {series.length} assessments
                    </>
                  ) : (
                    <>
                      {completed.length} assessment{completed.length !== 1 ? "s" : ""} completed
                      {" · "}
                      <span style={{ color: "var(--muted)" }}>{frameworks} framework{frameworks !== 1 ? "s" : ""}</span>
                    </>
                  )}
                </h2>
                {scores.length >= 2 && (
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 11.5, color: "var(--faint)", whiteSpace: "nowrap" }}>
                      {monthYear(series[0].completed_at ?? series[0].started_at)}
                    </span>
                    <div style={{ flex: 1, maxWidth: 340 }}>
                      <Sparkline data={scores} width={340} height={46} color={heroColor} />
                    </div>
                    <span style={{ fontSize: 11.5, color: "var(--faint)", whiteSpace: "nowrap" }}>
                      {monthYear(series[series.length - 1].completed_at ?? series[series.length - 1].started_at)}
                    </span>
                  </div>
                )}
              </div>

              {/* milestone boxes */}
              {scores.length >= 2 && (
                <div style={{ display: "flex", gap: 10 }}>
                  {series.map((s, i) => {
                    const sc = scores[i];
                    const t = tierColor(sc);
                    const isLatest = i === series.length - 1;
                    return (
                      <div
                        key={s.id}
                        style={{
                          padding: "14px 20px", borderRadius: "var(--radius)", textAlign: "center", position: "relative",
                          background: isLatest ? `color-mix(in srgb, ${t} 9%, var(--surface))` : "var(--surface-inset)",
                          border: `1px solid ${isLatest ? `color-mix(in srgb, ${t} 24%, transparent)` : "var(--border)"}`,
                        }}
                      >
                        {isLatest && (
                          <span style={{
                            position: "absolute", top: -8, left: "50%", transform: "translateX(-50%)",
                            fontSize: 10, fontWeight: 700, color: t, letterSpacing: ".04em",
                            background: "var(--surface)", padding: "1px 6px", borderRadius: 99,
                            border: `1px solid color-mix(in srgb, ${t} 24%, transparent)`,
                          }}>LATEST</span>
                        )}
                        <div style={{ fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", fontSize: 32, lineHeight: 1, fontWeight: 700, color: t }}>
                          {sc}
                        </div>
                        <div style={{ fontSize: 11, color: "var(--faint)", margin: "5px 0 7px" }}>
                          {monthYear(s.completed_at ?? s.started_at)}
                        </div>
                        {s.tier_result && <TierChip tier={s.tier_result as MaturityLevel} size="sm" />}
                      </div>
                    );
                  })}
                </div>
              )}

              <Link to="/dashboard" style={{ ...primaryBtn, padding: "9px 16px", fontSize: 13.5, alignSelf: "center" }}>
                <Icon name="plus" size={14} /> New assessment
              </Link>
            </div>
          </div>
        ) : null}

        {/* ── In progress ── */}
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
                    <div style={{ fontSize: 14.5, fontWeight: 600, color: "var(--ink)", marginBottom: s.progress_pct != null ? 7 : 0 }}>
                      {s.assessment_name ?? "Assessment"}
                    </div>
                    {s.progress_pct != null && (
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{ flex: 1, maxWidth: 280, height: 5, borderRadius: 999, background: "var(--surface-inset)", overflow: "hidden" }}>
                          <div style={{ width: `${s.progress_pct}%`, height: "100%", background: "var(--accent)", borderRadius: 999 }} />
                        </div>
                        <span style={{ fontSize: 12.5, color: "var(--muted)" }}>{s.progress_pct}% complete</span>
                      </div>
                    )}
                  </div>
                  <Link
                    to={`/sessions/${s.id}/quiz`}
                    onClick={() => {
                      if (s.assessment_slug) {
                        sessionStorage.setItem(`session-${s.id}-slug`, s.assessment_slug);
                      }
                    }}
                    style={primaryBtn}
                  >
                    <Icon name="play" size={13} fill /> Resume
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Completed assessments ── */}
        {(completed.length > 0 || isLoading) && (
          <div>
            <SectionHead
              title="Completed assessments"
              sub={isLoading ? undefined : `${completed.length} completed · ${frameworks} framework${frameworks !== 1 ? "s" : ""}`}
            />
            {isLoading ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {[1, 2, 3].map((i) => (
                  <div key={i} style={{ height: 180, borderRadius: "var(--radius-lg)", background: "var(--surface-inset)" }} />
                ))}
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {completed.map((s) => (
                  <SessionCard key={s.id} s={s} />
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </PageWrapper>
  );
}
