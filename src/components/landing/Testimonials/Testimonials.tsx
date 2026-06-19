import { useReveal, revealClass } from "../useReveal";

// Anonymized to role + sector only — no fabricated personal names.
const testimonials = [
  {
    quote:
      "Red Elk gave us a precise diagnosis we could act on immediately. Within two quarters we'd closed the governance gaps that had been holding back our entire AI programme.",
    role: "Chief Data Officer",
    org: "Healthcare enterprise",
    initials: "CD",
    color: "#3C7A4E",
  },
  {
    quote:
      "The sector benchmarking was the critical piece. We needed to know whether our AI maturity was genuinely competitive — not just good in isolation. Red Elk answered that clearly.",
    role: "VP, Technology",
    org: "Financial services firm",
    initials: "VP",
    color: "#3C6E8F",
  },
  {
    quote:
      "The action plan alone was worth the investment. Prioritised initiatives with clear ownership guidance — we briefed the board the same week we got our results.",
    role: "Chief Strategy Officer",
    org: "Logistics company",
    initials: "CS",
    color: "#BC7A1E",
  },
];

export default function Testimonials() {
  const hd = useReveal();
  return (
    <section className="section" id="testimonials">
      <div className="wrap">
        <div className={revealClass(hd.visible, "section-hd")} ref={hd.ref}>
          <span className="eyebrow">What teams say</span>
          <h2>Trusted by enterprise AI leaders</h2>
        </div>
        <div className="testi-grid">
          {testimonials.map((t, i) => (
            <Card key={t.role} t={t} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ t, delay }: { t: (typeof testimonials)[number]; delay: number }) {
  const { ref, visible } = useReveal();
  return (
    <div className={revealClass(visible, "testi-card")} ref={ref} style={{ transitionDelay: `${delay}s` }}>
      <div className="testi-stars">★★★★★</div>
      <p className="testi-quote">{t.quote}</p>
      <div className="testi-author">
        <div className="testi-avatar" style={{ background: t.color }}>{t.initials}</div>
        <div>
          <div className="testi-name">{t.role}</div>
          <div className="testi-role">{t.org}</div>
        </div>
      </div>
    </div>
  );
}
