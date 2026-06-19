import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";

const NS = "http://www.w3.org/2000/svg";

/** Animated hero radar — ported from the design's vanilla-JS rAF build. */
function HeroRadar() {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.innerHTML = "";

    const cx = 190, cy = 190, R = 148;
    const dims = [
      { l: "Strategy", s: 82 }, { l: "Data", s: 71 }, { l: "Tech", s: 79 },
      { l: "Talent", s: 64 }, { l: "Governance", s: 58 }, { l: "Adoption", s: 73 },
    ];
    const n = dims.length;
    const ang = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
    const pt = (i: number, r: number): [number, number] =>
      [cx + Math.cos(ang(i)) * R * r, cy + Math.sin(ang(i)) * R * r];
    const mk = (tag: string, a: Record<string, string | number>) => {
      const e = document.createElementNS(NS, tag);
      Object.entries(a).forEach(([k, v]) => e.setAttribute(k, String(v)));
      return e;
    };

    // grid
    [0.25, 0.5, 0.75, 1].forEach((r, ri) => {
      svg.appendChild(mk("polygon", {
        points: dims.map((_, i) => pt(i, r).join(",")).join(" "),
        fill: ri === 3 ? "rgba(255,255,255,.035)" : "none",
        stroke: "rgba(255,255,255,.1)", "stroke-width": "1",
      }));
    });
    // spokes
    dims.forEach((_, i) => {
      const [x, y] = pt(i, 1);
      svg.appendChild(mk("line", { x1: cx, y1: cy, x2: x, y2: y, stroke: "rgba(255,255,255,.1)", "stroke-width": "1" }));
    });
    // ring value labels
    [25, 50, 75].forEach((v) => {
      const t = mk("text", {
        x: cx + 3, y: cy - R * (v / 100) - 3, "text-anchor": "start",
        fill: "rgba(247,233,228,.22)", "font-size": "8.5", "font-family": "'JetBrains Mono',monospace",
      });
      t.textContent = String(v);
      svg.appendChild(t);
    });
    // dim labels
    dims.forEach((d, i) => {
      const [x, y] = pt(i, 1.22);
      const t = mk("text", {
        x, y, "text-anchor": "middle", "dominant-baseline": "middle",
        fill: "rgba(247,233,228,.55)", "font-size": "11.5", "font-weight": "700",
        "font-family": "'Schibsted Grotesk',sans-serif",
      });
      t.textContent = d.l;
      svg.appendChild(t);
    });
    // fill + stroke + dots
    const fill = mk("polygon", { fill: "rgba(247,233,228,.13)" });
    const stroke = mk("polygon", { fill: "none", stroke: "rgba(247,233,228,.88)", "stroke-width": "2.5", "stroke-linejoin": "round" });
    svg.appendChild(fill); svg.appendChild(stroke);
    const dots = dims.map(() => {
      const c = mk("circle", { r: "4.5", fill: "rgba(247,233,228,.88)" });
      svg.appendChild(c);
      return c;
    });

    const setPoints = (g: number) => {
      const pts = dims.map((d, i) => pt(i, (d.s / 100) * g).join(",")).join(" ");
      fill.setAttribute("points", pts);
      stroke.setAttribute("points", pts);
      dots.forEach((dot, i) => {
        const [x, y] = pt(i, (dims[i].s / 100) * g);
        dot.setAttribute("cx", String(x));
        dot.setAttribute("cy", String(y));
      });
    };

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) { setPoints(1); return; }

    const ease = (t: number) => 1 - Math.pow(1 - t, 3);
    const start = performance.now(), dur = 1500;
    let raf = 0;
    const frame = (now: number) => {
      const g = ease(Math.min((now - start) / dur, 1));
      setPoints(g);
      if (g < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  return <svg ref={svgRef} width="380" height="380" viewBox="0 0 380 380" style={{ overflow: "visible" }} />;
}

const stats = [
  { val: "6 dimensions", lbl: "Capability framework" },
  { val: "Sector peers", lbl: "Benchmark comparison" },
  { val: "Tiered roadmap", lbl: "Prioritised next steps" },
];

export default function Hero() {
  return (
    <section className="hero" id="hero">
      <div className="wrap hero-inner">
        <div>
          <p className="hero-eyebrow">AI Maturity Platform</p>
          <h1>Know exactly where your AI stands.</h1>
          <p className="hero-sub">
            The diagnostic platform that benchmarks six AI capability dimensions, compares you
            against sector peers, and builds a prioritised roadmap to the next maturity tier.
          </p>
          <div className="hero-ctas">
            <Link to="/login?mode=register" className="btn btn-cream" style={{ fontSize: "15px", padding: "13px 26px" }}>
              Get started free
            </Link>
            <a
              href="#how"
              className="btn btn-ghost-light"
              onClick={(e) => { e.preventDefault(); document.getElementById("how")?.scrollIntoView({ behavior: "smooth" }); }}
            >
              See how it works →
            </a>
          </div>
          <div className="hero-stats">
            {stats.map((s) => (
              <div className="hero-stat" key={s.lbl}>
                <div className="hero-stat-val">{s.val}</div>
                <div className="hero-stat-lbl">{s.lbl}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-visual">
          <HeroRadar />
        </div>
      </div>
    </section>
  );
}
