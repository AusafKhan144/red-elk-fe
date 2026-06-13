import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, ArrowUp, TrendingUp } from "lucide-react";
import PageWrapper from "../../components/common/PageWrapper";
import SectionHead from "../../components/common/SectionHead";
import DualRadar from "../../components/DualRadar";
import { BENCHMARKS_PREVIEW, type BenchDim } from "../../data/preview";

function tierColorForScore(score: number): string {
  if (score < 30) return "var(--t-nascent)";
  if (score < 55) return "var(--t-developing)";
  if (score < 75) return "var(--t-maturing)";
  return "var(--t-leading)";
}

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

function Marker({ pos, color, dim }: { pos: number; color: string; dim?: boolean }) {
  return (
    <div style={{ position: "absolute", left: `${pos}%`, top: 5, bottom: 0, transform: "translateX(-50%)" }}>
      <div style={{ width: 2, height: 14, background: color, borderRadius: 999, opacity: dim ? 0.8 : 1 }} />
    </div>
  );
}

function BenchRow({ d, delay }: { d: BenchDim; delay: number }) {
  const color = tierColorForScore(d.you);
  const [grow, setGrow] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setGrow(1), 100 + delay);
    return () => clearTimeout(t);
  }, [delay]);
  const above = d.you - d.sector;
  return (
    <div style={{ padding: "15px 0", borderBottom: "1px solid var(--border)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <span style={{ fontSize: 13.5, fontWeight: 600, color: "var(--ink)" }}>{d.label}</span>
        <span
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            color: above >= 0 ? "var(--t-leading)" : "var(--accent)",
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          {above >= 0 ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {Math.abs(above)} vs sector
        </span>
      </div>
      <div style={{ position: "relative", height: 24 }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 10, height: 4, borderRadius: 999, background: "var(--surface-inset)", boxShadow: "var(--inner-line)" }} />
        <div style={{ position: "absolute", left: 0, top: 10, height: 4, width: `${d.you * grow}%`, background: color, borderRadius: 999, transition: "width .9s var(--ease)" }} />
        <Marker pos={d.sector} color="var(--faint)" />
        <Marker pos={d.top} color="var(--border-strong)" dim />
        <div
          style={{
            position: "absolute",
            left: `calc(${d.you}% * ${grow})`,
            top: 0,
            transform: "translateX(-50%)",
            transition: "left .9s var(--ease)",
            textAlign: "center",
          }}
        >
          <div style={{ width: 14, height: 14, borderRadius: 999, background: color, border: "3px solid var(--surface)", boxShadow: "0 1px 3px rgba(0,0,0,.2)", margin: "4px auto 0" }} />
        </div>
        <span
          style={{
            position: "absolute",
            right: 0,
            top: -2,
            fontSize: 13,
            fontWeight: 700,
            color,
            fontFamily: "var(--font-mono)",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {d.you}
        </span>
      </div>
    </div>
  );
}

export default function Benchmarks() {
  const B = BENCHMARKS_PREVIEW;
  const aboveCount = B.dims.filter((d) => d.you >= d.sector).length;
  const tierColor = "var(--t-maturing)";

  return (
    <PageWrapper>
      <div className="re-fade-in" style={{ display: "flex", flexDirection: "column", gap: 22 }}>
        {/* Capability shape */}
        <div className="re-card grid grid-cols-1 lg:grid-cols-[auto_1fr]" style={{ padding: 22, gap: 28, alignItems: "center" }}>
          <div style={{ justifySelf: "center" }}>
            <DualRadar dims={B.dims} size={304} color={tierColor} />
          </div>
          <div>
            <SectionHead
              title="Capability shape"
              sub="Your profile overlaid with sector average and top 25% of peers."
              action={<PreviewChip />}
            />
            <div style={{ display: "flex", flexDirection: "column", gap: 9, marginBottom: 20 }}>
              {[
                { label: "You", color: tierColor, dash: false, w: 2.5 },
                { label: "Sector average", color: "var(--faint)", dash: true, w: 2 },
                { label: "Top 25%", color: "var(--border-strong)", dash: true, w: 1.5 },
              ].map((l) => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg width="28" height="10" style={{ flexShrink: 0 }}>
                    <line x1="0" y1="5" x2="28" y2="5" stroke={l.color} strokeWidth={l.w} strokeDasharray={l.dash ? "4,3" : "none"} />
                  </svg>
                  <span style={{ fontSize: 13, color: "var(--muted)" }}>{l.label}</span>
                </div>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {B.dims
                .filter((d) => d.you > d.sector)
                .map((d) => (
                  <div
                    key={d.label}
                    style={{
                      padding: "10px 12px",
                      borderRadius: "var(--radius)",
                      background: "color-mix(in srgb, var(--t-leading) 7%, var(--surface))",
                      border: "1px solid color-mix(in srgb, var(--t-leading) 18%, transparent)",
                    }}
                  >
                    <div style={{ fontSize: 11, color: "var(--faint)", marginBottom: 2 }}>{d.label.split(" &")[0]}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "var(--t-leading)", display: "flex", alignItems: "center", gap: 4 }}>
                      <ArrowUp size={12} />+{d.you - d.sector} above avg
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        {/* Percentile hero */}
        <div className="re-card grid grid-cols-1 lg:grid-cols-[auto_1fr_auto]" style={{ padding: 22, gap: 26, alignItems: "center" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 52, fontWeight: 800, color: "var(--t-leading)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
              {B.percentile}
              <span style={{ fontSize: 22 }}>nd</span>
            </div>
            <div style={{ fontSize: 11.5, color: "var(--faint)", marginTop: 2 }}>percentile</div>
          </div>
          <div>
            <span className="re-eyebrow">Sector benchmark</span>
            <h1 style={{ fontSize: 25, fontWeight: 800, letterSpacing: "-.015em", margin: "8px 0 8px", lineHeight: 1.1, color: "var(--ink)" }}>
              Ahead of {B.percentile}% of {B.sector} peers
            </h1>
            <p style={{ margin: 0, fontSize: 13.5, color: "var(--muted)", lineHeight: 1.5, maxWidth: 460 }}>
              Compared against {B.peers} organisations who completed the Enterprise AI Maturity assessment in your sector.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, minWidth: 132 }}>
            <div style={{ padding: "12px 14px", borderRadius: "var(--radius)", background: "var(--surface-2)", border: "1px solid var(--border)" }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: "var(--t-leading)", fontVariantNumeric: "tabular-nums" }}>
                {aboveCount}/{B.dims.length}
              </div>
              <div style={{ fontSize: 11, color: "var(--faint)" }}>dimensions above average</div>
            </div>
          </div>
        </div>

        {/* Per-dimension comparison */}
        <div className="re-card" style={{ padding: 22 }}>
          <SectionHead
            title="How you compare, by capability"
            action={
              <div style={{ display: "flex", gap: 16, fontSize: 11.5, color: "var(--muted)", flexWrap: "wrap" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 999, background: tierColor }} /> You
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 2, height: 12, background: "var(--faint)" }} /> Sector avg
                </span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                  <span style={{ width: 2, height: 12, background: "var(--border-strong)" }} /> Top 25%
                </span>
              </div>
            }
          />
          <div style={{ borderTop: "1px solid var(--border)" }}>
            {B.dims.map((d, i) => (
              <BenchRow key={d.label} d={d} delay={i * 80} />
            ))}
          </div>
        </div>

        {/* Callout */}
        <div
          className="re-card"
          style={{
            padding: 20,
            display: "flex",
            gap: 16,
            alignItems: "center",
            background: "color-mix(in srgb, var(--t-leading) 6%, var(--surface))",
            borderColor: "color-mix(in srgb, var(--t-leading) 22%, var(--border))",
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 12,
              background: "color-mix(in srgb, var(--t-leading) 14%, var(--surface))",
              color: "var(--t-leading)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <TrendingUp size={21} />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 3, color: "var(--ink)" }}>
              You lead the sector on Strategy &amp; Technology
            </h3>
            <p style={{ margin: 0, fontSize: 13, color: "var(--muted)", lineHeight: 1.5 }}>
              Governance &amp; Risk is your only dimension within reach of the sector average — closing it would move
              you into the top decile.
            </p>
          </div>
          <Link
            to="/action-plan"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "9px 15px",
              borderRadius: "var(--radius)",
              background: "var(--accent)",
              color: "var(--accent-ink)",
              fontWeight: 600,
              fontSize: 13.5,
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            See action plan <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </PageWrapper>
  );
}
