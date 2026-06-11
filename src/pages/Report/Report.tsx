import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Download, Loader2, RefreshCw, AlertTriangle } from "lucide-react";
import { useReport } from "../../hooks/useReport";
import TierChip from "../../components/TierChip";
import ScoreDial from "../../components/ScoreDial";
import RadarChart from "../../components/RadarChart";
import PageWrapper from "../../components/common/PageWrapper";
import type { MaturityLevel, RadarPoint } from "../../types/api";

const TIERS: { key: MaturityLevel; label: string; range: string }[] = [
  { key: "nascent",    label: "Nascent",    range: "0–30"   },
  { key: "developing", label: "Developing", range: "30–55"  },
  { key: "maturing",   label: "Maturing",   range: "55–75"  },
  { key: "leading",    label: "Leading",    range: "75–100" },
];

function tierColorVar(tier: MaturityLevel) {
  return `var(--t-${tier})`;
}

function MaturityTrack({ d, delay = 0 }: { d: RadarPoint; delay?: number }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShow(true), 100 + delay);
    return () => clearTimeout(t);
  }, [delay]);

  const tierBands: { key: MaturityLevel; flex: number }[] = [
    { key: "nascent",    flex: 30  },
    { key: "developing", flex: 25  },
    { key: "maturing",   flex: 20  },
    { key: "leading",    flex: 25  },
  ];

  const tierOfScore = (s: number): MaturityLevel => {
    if (s < 30) return "nascent";
    if (s < 55) return "developing";
    if (s < 75) return "maturing";
    return "leading";
  };
  const tier = tierOfScore(d.score);

  return (
    <div style={{ padding: "15px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 9 }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>{d.label}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <TierChip tier={tier} size="sm" />
          <span style={{ fontFamily: "var(--font-mono)", fontSize: 14, fontWeight: 600, color: "var(--ink)", width: 28, textAlign: "right" }}>{d.score}</span>
        </div>
      </div>
      <div style={{ position: "relative", height: 22 }}>
        {/* tier band background */}
        <div style={{ position: "absolute", inset: "6px 0", display: "flex", gap: 2, borderRadius: 6, overflow: "hidden" }}>
          {tierBands.map((t) => (
            <div
              key={t.key}
              style={{ flex: t.flex, background: `color-mix(in srgb, ${tierColorVar(t.key)} 13%, var(--surface))` }}
            />
          ))}
        </div>
        {/* animated position marker */}
        <div style={{
          position: "absolute", top: 0, bottom: 0,
          left: `calc(${d.score}% * ${show ? 1 : 0})`,
          transition: "left .9s var(--ease)", transform: "translateX(-50%)",
        }}>
          <div style={{
            width: 4, height: "100%", borderRadius: 999,
            background: tierColorVar(tier), boxShadow: "0 0 0 3px var(--surface)",
          }} />
        </div>
      </div>
    </div>
  );
}

function GlanceRow({ icon, tint, label, name, value, last }: { icon: string; tint: string; label: string; name: string; value: string; last?: boolean }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 12,
      padding: "12px 0", borderBottom: last ? "none" : "1px solid var(--border)",
    }}>
      <span style={{
        width: 32, height: 32, borderRadius: 9, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        color: tint, background: `color-mix(in srgb, ${tint} 12%, var(--surface))`,
        fontSize: 15,
      }}>
        {icon}
      </span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: "var(--faint)" }}>{label}</div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{name}</div>
      </div>
      <span style={{ fontFamily: "var(--font-mono)", fontSize: 13, fontWeight: 600, color: tint }}>{value}</span>
    </div>
  );
}

export default function Report() {
  const { sessionId } = useParams<{ sessionId: string }>();
  const { data: report, isLoading, timedOut, resetPolling } = useReport(sessionId!);
  const assessmentSlug = sessionStorage.getItem(`session-${sessionId}-slug`);

  if (isLoading || (!report && !timedOut)) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "128px 24px", gap: 20 }}>
        <div style={{ position: "relative", width: 56, height: 56 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "4px solid var(--surface-inset)" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "4px solid var(--accent)", borderTopColor: "transparent", animation: "spin 1s linear infinite" }} />
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontWeight: 700, fontSize: 16, color: "var(--ink)", marginBottom: 4 }}>Calculating your results</p>
          <p style={{ color: "var(--faint)", fontSize: 13 }}>This takes just a moment…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!report) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "96px 24px", gap: 16 }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, background: "var(--accent-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <AlertTriangle size={28} style={{ color: "var(--accent)" }} />
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>Report not available</p>
          <p style={{ color: "var(--faint)", fontSize: 13, marginBottom: 20 }}>Your results could not be loaded.</p>
          <Link
            to="/dashboard"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "9px 20px", borderRadius: "var(--radius)",
              background: "var(--accent)", color: "var(--accent-ink)",
              fontWeight: 600, fontSize: 13.5, textDecoration: "none",
            }}
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const tier = report.tier_result;
  const tierIdx = TIERS.findIndex((t) => t.key === tier);
  const sorted = [...report.radar_data].sort((a, b) => b.score - a.score);
  const strongest = sorted[0];
  const weakest = sorted[sorted.length - 1];

  return (
    <PageWrapper>
      <div className="re-fade-in" style={{ display: "flex", flexDirection: "column", gap: 22 }}>

        {/* ── Hero ── */}
        <div className="re-card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "auto 1fr auto", gap: 24, alignItems: "center", padding: 24 }}>
            <ScoreDial score={report.overall_score} size={120} />

            <div>
              <span className="re-eyebrow">AI Maturity Report</span>
              <h1 style={{
                fontSize: 28, fontWeight: 700, margin: "8px 0 10px", lineHeight: 1.1,
                color: "var(--ink)", letterSpacing: "-.01em",
              }}>
                Your organisation is <span style={{ color: tierColorVar(tier) }}>{TIERS[tierIdx]?.label}</span>
              </h1>
              <p style={{ margin: 0, fontSize: 13.5, color: "var(--muted)", maxWidth: 460, lineHeight: 1.55 }}>
                Scored {report.overall_score}/100 across {report.radar_data.length} capability dimensions.
              </p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {report.pdf_url ? (
                <a
                  href={report.pdf_url} target="_blank" rel="noopener noreferrer"
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "9px 16px", borderRadius: "var(--radius)",
                    background: "var(--accent)", color: "var(--accent-ink)",
                    fontWeight: 600, fontSize: 13.5, textDecoration: "none",
                    border: "none",
                  }}
                >
                  <Download size={14} /> Download PDF
                </a>
              ) : timedOut ? (
                <button
                  onClick={resetPolling}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "9px 16px", borderRadius: "var(--radius)",
                    background: "var(--surface-inset)", color: "var(--accent)",
                    fontWeight: 600, fontSize: 13.5, cursor: "pointer",
                    border: "1px solid color-mix(in srgb, var(--accent) 30%, transparent)",
                  }}
                >
                  <RefreshCw size={14} /> Retry PDF
                </button>
              ) : (
                <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: "var(--faint)", padding: "9px 16px" }}>
                  <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} />
                  Generating PDF…
                </div>
              )}
              {assessmentSlug && (
                <Link
                  to={`/assessments/${assessmentSlug}`}
                  style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 6,
                    padding: "8px 16px", borderRadius: "var(--radius)",
                    border: "1px solid var(--border-strong)", background: "var(--surface)",
                    color: "var(--ink)", fontWeight: 600, fontSize: 13, textDecoration: "none",
                  }}
                >
                  ↺ Retake
                </Link>
              )}
            </div>
          </div>

          {/* Maturity journey */}
          <div style={{ display: "flex", borderTop: "1px solid var(--border)" }}>
            {TIERS.map((t, i) => {
              const isActive = i === tierIdx;
              const isPast = i < tierIdx;
              return (
                <div
                  key={t.key}
                  style={{
                    flex: 1, padding: "12px 16px", textAlign: "center",
                    borderRight: i < TIERS.length - 1 ? "1px solid var(--border)" : "none",
                    background: isActive ? `color-mix(in srgb, ${tierColorVar(t.key)} 9%, var(--surface))` : "var(--surface)",
                    borderTop: `2px solid ${isActive ? tierColorVar(t.key) : "transparent"}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
                    {isPast && <span style={{ color: tierColorVar(t.key), fontSize: 12 }}>✓</span>}
                    <span style={{
                      fontSize: 13, fontWeight: isActive ? 700 : 500,
                      color: isActive ? "var(--ink)" : isPast ? "var(--muted)" : "var(--faint)",
                    }}>
                      {t.label}
                    </span>
                  </div>
                  <div style={{
                    fontFamily: "var(--font-mono)", fontSize: 10.5, marginTop: 3,
                    color: isActive ? tierColorVar(t.key) : "var(--faint)",
                  }}>
                    {t.range}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Footprint: radar + at a glance ── */}
        <div style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 18 }}>
          <div className="re-card" style={{ padding: 22 }}>
            <div style={{ marginBottom: 14 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>Capability footprint</h2>
              <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--muted)" }}>Shape across all dimensions, scored 0–100.</p>
            </div>
            <RadarChart data={report.radar_data} />
          </div>

          <div className="re-card" style={{ padding: 22, display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 14 }}>At a glance</h2>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <GlanceRow
                icon="📈" tint="var(--t-leading)"
                label="Strongest capability" name={strongest?.label ?? "—"} value={String(strongest?.score ?? "—")}
              />
              <GlanceRow
                icon="🎯" tint="var(--accent)"
                label="Biggest opportunity" name={weakest?.label ?? "—"} value={String(weakest?.score ?? "—")}
              />
              <GlanceRow
                icon="🏅" tint="var(--t-maturing)"
                label="Overall score" name="Across all dimensions" value={`${report.overall_score}/100`}
              />
              <GlanceRow
                icon="⭐" tint="var(--t-developing)"
                label="Maturity tier" name={TIERS[tierIdx]?.label ?? "—"} value={TIERS[tierIdx]?.range ?? "—"} last
              />
            </div>
          </div>
        </div>

        {/* ── Maturity by dimension ── */}
        <div className="re-card" style={{ padding: 22 }}>
          <div style={{ marginBottom: 14 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)" }}>Maturity by dimension</h2>
            <p style={{ margin: "4px 0 0", fontSize: 12.5, color: "var(--muted)" }}>Where each capability sits on the maturity scale.</p>
          </div>
          <div style={{ display: "flex", gap: 16, marginBottom: 4 }}>
            {TIERS.map((t) => (
              <span key={t.key} style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11, color: "var(--muted)" }}>
                <span style={{ width: 8, height: 8, borderRadius: 2, background: tierColorVar(t.key), display: "inline-block" }} />
                {t.label}
              </span>
            ))}
          </div>
          <div style={{ borderTop: "1px solid var(--border)" }}>
            {report.radar_data.map((d, i) => (
              <MaturityTrack key={d.dimension} d={d} delay={i * 80} />
            ))}
          </div>
        </div>

        {/* ── Dimension insights ── */}
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "var(--ink)", marginBottom: 14 }}>Insights & recommendations</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {report.radar_data.map((d) => {
              const tierOfScore = (s: number): MaturityLevel => {
                if (s < 30) return "nascent";
                if (s < 55) return "developing";
                if (s < 75) return "maturing";
                return "leading";
              };
              const t = tierOfScore(d.score);
              return (
                <div key={d.dimension} className="re-card" style={{ padding: 16, display: "flex", flexDirection: "column", gap: 9 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontFamily: "var(--font-mono)", fontSize: 22, fontWeight: 700, color: tierColorVar(t) }}>{d.score}</span>
                    <TierChip tier={t} size="sm" />
                  </div>
                  <h4 style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>{d.label}</h4>
                  {report.recommendations[d.dimension] && (
                    <p style={{ margin: 0, fontSize: 12.5, color: "var(--muted)", lineHeight: 1.5 }}>
                      {report.recommendations[d.dimension]}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Priority callout ── */}
        {weakest && (
          <div
            className="re-card"
            style={{
              padding: 22, display: "flex", gap: 18, alignItems: "center",
              background: "color-mix(in srgb, var(--accent) 5%, var(--surface))",
              borderColor: "color-mix(in srgb, var(--accent) 22%, var(--border))",
            }}
          >
            <div style={{
              width: 46, height: 46, borderRadius: 12,
              background: "var(--accent-soft)", color: "var(--accent)",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, fontSize: 22,
            }}>
              🎯
            </div>
            <div style={{ flex: 1 }}>
              <span className="re-eyebrow" style={{ color: "var(--accent)" }}>Top priority</span>
              <h3 style={{ fontSize: 15, fontWeight: 700, margin: "5px 0 4px", color: "var(--ink)" }}>
                Strengthen {weakest.label} to unlock your next tier
              </h3>
              <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", lineHeight: 1.5, maxWidth: 600 }}>
                At {weakest.score}, {weakest.label} is your lowest-scoring dimension.
                {report.recommendations[weakest.dimension]
                  ? " " + report.recommendations[weakest.dimension]
                  : " Focus here for the highest impact on your overall maturity score."}
              </p>
            </div>
            <Link
              to="/dashboard"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8, whiteSpace: "nowrap",
                padding: "9px 16px", borderRadius: "var(--radius)",
                background: "var(--accent)", color: "var(--accent-ink)",
                fontWeight: 600, fontSize: 13.5, textDecoration: "none",
              }}
            >
              Back to dashboard →
            </Link>
          </div>
        )}

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </PageWrapper>
  );
}
