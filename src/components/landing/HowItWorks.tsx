import { useReveal, revealClass } from "./useReveal";

const ACCENT = "#B5232A";

function ClockPin() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" /><path d="M12 6v6l3 3" />
    </svg>
  );
}
function DocPin() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6" />
    </svg>
  );
}
function TrendPin() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M22 7l-8.5 8.5-5-5L2 17M16 7h6v6" />
    </svg>
  );
}
function ExportPin() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </svg>
  );
}
function OwnersPin() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 7a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
    </svg>
  );
}

const steps = [
  {
    n: "01",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M9 13h6M9 17h6" />
      </svg>
    ),
    title: "Take the diagnostic",
    desc: "Answer structured questions across six AI capability dimensions. Honest, evidence-based — no jargon, no wrong answers.",
    meta: [{ icon: <ClockPin />, text: "~25 minutes" }, { icon: <DocPin />, text: "Structured questions" }],
  },
  {
    n: "02",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18M7 14l3-4 3 3 5-7" />
      </svg>
    ),
    title: "Get your maturity report",
    desc: "Instant scoring across all six dimensions, a sector percentile ranking, and a radar chart showing your capability shape with previous-score overlay.",
    meta: [{ icon: <TrendPin />, text: "Instant results" }, { icon: <ExportPin />, text: "PDF export" }],
  },
  {
    n: "03",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={ACCENT} strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V4s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22V4" />
      </svg>
    ),
    title: "Follow your roadmap",
    desc: "Initiatives ranked by projected impact and effort, with timeframe and ownership guidance. Know exactly what to tackle first to reach the next tier.",
    meta: [{ icon: <TrendPin />, text: "Impact-ranked" }, { icon: <OwnersPin />, text: "With owners" }],
  },
];

export default function HowItWorks() {
  const hd = useReveal();
  return (
    <section className="section" id="how">
      <div className="wrap">
        <div className={revealClass(hd.visible, "section-hd")} ref={hd.ref}>
          <span className="eyebrow">How it works</span>
          <h2>From assessment to action plan in minutes</h2>
          <p>Three steps to a clear, data-backed picture of your AI capability — and exactly what to do next.</p>
        </div>
        <div className="how-grid">
          <div className="how-connector" />
          {steps.map((s, i) => (
            <Card key={s.n} step={s} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ step, delay }: { step: (typeof steps)[number]; delay: number }) {
  const { ref, visible } = useReveal();
  return (
    <div className={revealClass(visible, "how-card")} ref={ref} style={{ transitionDelay: `${delay}s` }}>
      <div className="how-num">{step.n}</div>
      <div className="how-icon">{step.icon}</div>
      <h3>{step.title}</h3>
      <p>{step.desc}</p>
      <div className="how-meta">
        {step.meta.map((m, i) => (
          <span className="how-pill" key={i}>{m.icon}{m.text}</span>
        ))}
      </div>
    </div>
  );
}
