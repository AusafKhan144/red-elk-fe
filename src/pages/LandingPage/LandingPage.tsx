import "./landing.css";
import LandingNav from "../../components/landing/LandingNav";
import Hero from "../../components/landing/Hero/Hero";
import TrustBar from "../../components/landing/TrustBar";
import HowItWorks from "../../components/landing/HowItWorks";
import Features from "../../components/landing/Features/Features";
import Benchmarks from "../../components/landing/Benchmarks";
import Testimonials from "../../components/landing/Testimonials/Testimonials";
import Pricing from "../../components/landing/Pricing";
import CTA from "../../components/landing/CTA/CTA";
import LandingFooter from "../../components/landing/LandingFooter";

export default function LandingPage() {
  return (
    <div className="relk-landing">
      <LandingNav />
      <Hero />
      <TrustBar />
      <HowItWorks />
      <Features />
      <Benchmarks />
      <Testimonials />
      <Pricing />
      <CTA />
      <LandingFooter />
    </div>
  );
}
