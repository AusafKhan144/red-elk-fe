import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useReveal, revealClass } from "./useReveal";

// Illustrative "you vs sector avg" shape (no headline numeric claim).
const data = [
  { l: "Strategy & Vision", y: 82, s: 64 },
  { l: "Technology & Tooling", y: 79, s: 62 },
  { l: "Data & Infrastructure", y: 71, s: 58 },
  { l: "Adoption & Culture", y: 73, s: 57 },
  { l: "Talent & Skills", y: 64, s: 55 },
  { l: "Governance & Risk", y: 58, s: 51 },
];

function BenchBars() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [fill, setFill] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) { setFill(true); obs.disconnect(); }
      },
      { threshold: 0.35 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={sectionRef}>
      <div className="bench-vis">
        {data.map((d, i) => (
          <div className="bench-row" key={d.l}>
            <div className="bench-row-lbl">
              <span>{d.l}</span>
              <span className="bench-row-val">{d.y}</span>
            </div>
            <div className="bench-track">
              <div
                className="bench-fill"
                style={{
                  background: "rgba(247,233,228,.82)",
                  width: fill ? `${d.y}%` : 0,
                  transitionDelay: `${80 + i * 80}ms`,
                }}
              />
              <div className="bench-tick" style={{ left: `${d.s}%` }} />
            </div>
          </div>
        ))}
      </div>
      <div className="bench-legend">
        <div className="bench-legend-item">
          <div className="bench-legend-line" style={{ background: "rgba(247,233,228,.82)" }} /> You
        </div>
        <div className="bench-legend-item">
          <div className="bench-legend-line" style={{ background: "rgba(247,233,228,.28)" }} /> Sector avg
        </div>
      </div>
    </div>
  );
}

export default function Benchmarks() {
  const copy = useReveal();
  const vis = useReveal();
  return (
    <section className="section bench-section" id="benchmarks">
      <div className="wrap">
        <div className="bench-inner">
          <div className={revealClass(copy.visible)} ref={copy.ref}>
            <span className="eyebrow" style={{ color: "rgba(247,233,228,.42)" }}>Sector benchmarking</span>
            <h2>See where you stand among your peers</h2>
            <p className="bench-sub">
              Red Elk maintains a continuously updated benchmark pool across sectors. Your report
              includes a percentile ranking for every dimension — not just an overall score.
            </p>
            <Link to="/login?mode=register" className="btn btn-cream">Start your free assessment</Link>
          </div>
          <div className={revealClass(vis.visible)} ref={vis.ref} style={{ transitionDelay: "0.15s" }}>
            <BenchBars />
          </div>
        </div>
      </div>
    </section>
  );
}
