import { Link } from "react-router-dom";

function anchor(e: React.MouseEvent, id: string) {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function LandingFooter() {
  return (
    <footer>
      <div className="wrap">
        <div className="footer-top">
          <div>
            <div className="footer-brand-name">Red Elk</div>
            <div className="footer-brand-sub">AI Maturity Platform</div>
            <p className="footer-brand-p">
              The enterprise AI maturity diagnostic. Benchmark your capabilities, close the gaps,
              prove the value.
            </p>
          </div>
          <div>
            <div className="footer-col-title">Product</div>
            <a className="footer-lnk" href="#how" onClick={(e) => anchor(e, "how")}>How it works</a>
            <a className="footer-lnk" href="#features" onClick={(e) => anchor(e, "features")}>Features</a>
            <a className="footer-lnk" href="#pricing" onClick={(e) => anchor(e, "pricing")}>Pricing</a>
            <Link className="footer-lnk" to="/login">Dashboard</Link>
          </div>
          <div>
            <div className="footer-col-title">Assessments</div>
            <a className="footer-lnk" href="#features" onClick={(e) => anchor(e, "features")}>Enterprise AI Maturity</a>
            <a className="footer-lnk" href="#features" onClick={(e) => anchor(e, "features")}>Data Readiness Index</a>
            <a className="footer-lnk" href="#features" onClick={(e) => anchor(e, "features")}>Responsible AI Checkpoint</a>
          </div>
          <div>
            <div className="footer-col-title">Company</div>
            <a className="footer-lnk" href="#benchmarks" onClick={(e) => anchor(e, "benchmarks")}>Benchmarks</a>
            <a className="footer-lnk" href="#testimonials" onClick={(e) => anchor(e, "testimonials")}>Customers</a>
            <a className="footer-lnk" href="#pricing" onClick={(e) => anchor(e, "pricing")}>Pricing</a>
            <Link className="footer-lnk" to="/login?mode=register">Get started</Link>
          </div>
        </div>
        <div className="footer-btm">
          <span>© {new Date().getFullYear()} Red Elk Ltd. All rights reserved.</span>
          <div style={{ display: "flex", gap: 20 }}>
            <a href="#" onClick={(e) => e.preventDefault()}>Privacy</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Terms</a>
            <a href="#" onClick={(e) => e.preventDefault()}>Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
