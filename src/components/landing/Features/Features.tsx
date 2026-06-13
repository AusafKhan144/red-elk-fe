import { useReveal, revealClass } from "../useReveal";

const features = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M16 8l-2.5 5.5L8 16l2.5-5.5z" />
      </svg>
    ),
    title: "Six-dimension framework",
    desc: "Our model spans Strategy & Vision, Data & Infrastructure, Technology & Tooling, Talent & Skills, Governance & Risk, and Adoption & Culture — every layer of enterprise AI capability covered.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
      </svg>
    ),
    title: "Sector benchmarks",
    desc: "Compare your capability profile against companies in your sector. See exactly which dimensions you lead on and where you're falling behind the peer average — per dimension, not just overall.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V4s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22V4" />
      </svg>
    ),
    title: "Prioritised action plan",
    desc: "Every report generates a set of initiatives ranked by projected impact and effort. Quick wins, medium-term plays, and strategic moves — each tied directly to the dimension it will improve.",
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 7l-8.5 8.5-5-5L2 17M16 7h6v6" />
      </svg>
    ),
    title: "Progress tracking",
    desc: "Reassess on any cadence and watch your radar chart evolve. Every new report overlays your previous scores so your improvement is always visible, measurable, and boardroom-ready.",
  },
];

export default function Features() {
  const hd = useReveal();
  return (
    <section className="section features-bg" id="features">
      <div className="wrap">
        <div className={revealClass(hd.visible, "section-hd")} ref={hd.ref}>
          <span className="eyebrow">Capabilities</span>
          <h2>Everything you need to advance your AI programme</h2>
          <p>Built for enterprise teams who need rigour, not just a score.</p>
        </div>
        <div className="features-grid">
          {features.map((f, i) => (
            <Card key={f.title} feature={f} delay={(i % 2) * 0.05 + Math.floor(i / 2) * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ feature, delay }: { feature: (typeof features)[number]; delay: number }) {
  const { ref, visible } = useReveal();
  return (
    <div className={revealClass(visible, "feat-card")} ref={ref} style={{ transitionDelay: `${delay}s` }}>
      <div className="feat-icon">{feature.icon}</div>
      <h3>{feature.title}</h3>
      <p>{feature.desc}</p>
    </div>
  );
}
