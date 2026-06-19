import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/RedElkonly.svg";

function scrollToId(e: React.MouseEvent, id: string) {
  e.preventDefault();
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

export default function LandingNav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav className={`relk-nav${scrolled ? " scrolled" : ""}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-brand">
          <div className="nav-tile">
            <img src={logo} alt="Red Elk" />
          </div>
          <div>
            <div className="nav-name">Red Elk</div>
            <div className="nav-sub">AI MATURITY</div>
          </div>
        </Link>
        <div className="nav-links">
          <a href="#how" onClick={(e) => scrollToId(e, "how")}>How it works</a>
          <a href="#features" onClick={(e) => scrollToId(e, "features")}>Features</a>
          <a href="#pricing" onClick={(e) => scrollToId(e, "pricing")}>Pricing</a>
        </div>
        <div style={{ display: "flex", gap: 10, marginLeft: "auto" }}>
          <Link to="/login" className="nav-login">Log in</Link>
          <Link
            to="/login?mode=register"
            className="btn btn-cream"
            style={{ fontSize: "13.5px", padding: "9px 18px" }}
          >
            Get started
          </Link>
        </div>
      </div>
    </nav>
  );
}
