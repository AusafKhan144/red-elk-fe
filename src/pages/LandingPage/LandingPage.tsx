import Hero from "../../components/landing/Hero/Hero";
import Features from "../../components/landing/Features/Features";
import HowItWorks from "../../components/landing/Testimonials/Testimonials";
import CTA from "../../components/landing/CTA/CTA";
import Footer from "../../components/common/Footer/Footer";

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      <Hero />
      <Features />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
}
