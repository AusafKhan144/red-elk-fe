import { Link } from "react-router-dom";

export default function CTA() {
  return (
    <section className="cta-banner">
      <div className="wrap">
        <span className="eyebrow" style={{ color: "rgba(255,255,255,.42)", display: "block", marginBottom: 14 }}>
          Ready to benchmark?
        </span>
        <h2>Know exactly where your AI stands.</h2>
        <p>Measure, benchmark, and improve your AI maturity with Red Elk.</p>
        <Link to="/login?mode=register" className="btn btn-cream" style={{ fontSize: "15px", padding: "14px 30px" }}>
          Get started free →
        </Link>
      </div>
    </section>
  );
}
