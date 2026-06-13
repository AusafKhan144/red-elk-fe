import { useNavigate } from "react-router-dom";
import { useReveal, revealClass } from "./useReveal";

type Feat = { text: string; off?: boolean };
type Plan = {
  tier: string;
  price: string;
  priceSmall?: boolean;
  period: string;
  desc: string;
  feats: Feat[];
  cta: string;
  btnClass: string;
  to: string;
  hot?: boolean;
  badge?: string;
};

const plans: Plan[] = [
  {
    tier: "Free",
    price: "$0",
    period: "Forever free",
    desc: "Run the Responsible AI Checkpoint and get a baseline read on your position.",
    feats: [
      { text: "Responsible AI Checkpoint" },
      { text: "Basic maturity report" },
      { text: "Overall sector percentile" },
      { text: "Per-dimension benchmarks", off: true },
      { text: "Action plan", off: true },
      { text: "PDF export", off: true },
    ],
    cta: "Start free",
    btnClass: "btn-plan-ghost",
    to: "/login?mode=register",
  },
  {
    tier: "Growth",
    price: "Let's talk",
    priceSmall: true,
    period: "Flexible team plans",
    desc: "The full Enterprise AI Maturity diagnostic with benchmarking and action planning.",
    hot: true,
    badge: "MOST POPULAR",
    feats: [
      { text: "All Free features" },
      { text: "Enterprise AI Maturity + Data Readiness" },
      { text: "Full per-dimension benchmarks" },
      { text: "Prioritised action plan" },
      { text: "PDF export + session history" },
      { text: "Multiple team members" },
    ],
    cta: "Get started",
    btnClass: "btn-plan-hot",
    to: "/login?mode=register",
  },
  {
    tier: "Enterprise",
    price: "Custom",
    priceSmall: true,
    period: "Tailored to your org",
    desc: "For teams needing SSO, API access, white-labelling, or custom frameworks.",
    feats: [
      { text: "All Growth features" },
      { text: "Unlimited members + SSO" },
      { text: "API access" },
      { text: "White-label reporting" },
      { text: "Dedicated customer success" },
      { text: "Custom assessment frameworks" },
    ],
    cta: "Contact sales",
    btnClass: "btn-plan-primary",
    to: "/login",
  },
];

export default function Pricing() {
  const hd = useReveal();
  return (
    <section className="section pricing-bg" id="pricing">
      <div className="wrap">
        <div className={revealClass(hd.visible, "section-hd")} ref={hd.ref}>
          <span className="eyebrow">Pricing</span>
          <h2>Start free. Scale when you're ready.</h2>
          <p>No credit card required for the free tier.</p>
        </div>
        <div className="pricing-grid">
          {plans.map((p, i) => (
            <Card key={p.tier} plan={p} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function Card({ plan, delay }: { plan: Plan; delay: number }) {
  const { ref, visible } = useReveal();
  const navigate = useNavigate();
  return (
    <div
      className={revealClass(visible, `plan-card${plan.hot ? " hot" : ""}`)}
      ref={ref}
      style={{ transitionDelay: `${delay}s` }}
    >
      {plan.badge && <div className="plan-badge">{plan.badge}</div>}
      <div className="plan-tier">{plan.tier}</div>
      <div
        className="plan-price"
        style={plan.priceSmall ? { fontSize: 30, letterSpacing: "-.01em", lineHeight: 1.2, marginTop: 4 } : undefined}
      >
        {plan.price}
      </div>
      <div className="plan-period">{plan.period}</div>
      <p className="plan-desc">{plan.desc}</p>
      <div className="plan-feats">
        {plan.feats.map((f) => (
          <div className={`plan-feat${f.off ? " off" : ""}`} key={f.text}>
            <div className="plan-check">{f.off ? "—" : "✓"}</div> {f.text}
          </div>
        ))}
      </div>
      <hr className="plan-divider" />
      <button className={`btn-plan ${plan.btnClass}`} onClick={() => navigate(plan.to)}>{plan.cta}</button>
    </div>
  );
}
