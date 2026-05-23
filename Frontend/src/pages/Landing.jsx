import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/sections/Hero";
import TrustedBy from "@/sections/TrustedBy";
import FeatureCards from "@/sections/FeatureCards";
import HowItWorks from "@/sections/HowItWorks";
import Showcase from "@/sections/Showcase";
import Testimonials from "@/sections/Testimonials";
import CTABanner from "@/sections/CTABanner";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <TrustedBy />
      <FeatureCards />
      <HowItWorks />
      <Showcase />
      <Testimonials />
      <CTABanner />
      <Footer />
    </div>
  );
}
