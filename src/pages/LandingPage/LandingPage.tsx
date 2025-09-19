import Hero from '@/components/landing/Hero/Hero';
import Features from '@/components/landing/Features/Features';
import Testimonials from '@/components/landing/Testimonials/Testimonials';
import CTA from '@/components/landing/CTA/CTA';
import Footer from '@/components/common/Footer/Footer';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <Features />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
};

export default LandingPage;