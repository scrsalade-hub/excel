import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import Reveal from "@/components/effects/Reveal";
import { motion } from "framer-motion";

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden py-32 lg:py-40" style={{ background: "linear-gradient(135deg, #DC2626 0%, #991B1B 100%)" }}>
      {/* Dot grid */}
      <div className="absolute inset-0 opacity-15" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />

      {/* Decorative elements */}
      <motion.div className="absolute top-16 left-[8%] w-32 h-32 border border-white/10 rounded-full" animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 8, repeat: Infinity }} />
      <motion.div className="absolute bottom-16 right-[8%] w-44 h-44 border border-white/10 rounded-2xl rotate-12" animate={{ rotate: [12, 20, 12] }} transition={{ duration: 12, repeat: Infinity }} />
      <div className="absolute top-1/3 right-[20%] w-3 h-3 bg-white/20 rounded-full" />
      <div className="absolute bottom-1/3 left-[12%] w-2 h-2 bg-white/15 rounded-sm rotate-45" />

      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col items-center text-center">
          <Reveal>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-8 tracking-tight leading-tight">Ready to ace your exams?</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-lg sm:text-xl text-white/70 mb-12 max-w-[520px] leading-relaxed">Join students who use our AI to turn their course materials into personalized quizzes and study smarter.</p>
          </Reveal>
          <Reveal delay={0.2}>
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <Link to="/register" className="inline-flex items-center justify-center gap-3 px-10 py-5 text-[15px] font-semibold text-[#DC2626] bg-white rounded-2xl hover:bg-[#FEF2F2] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(0,0,0,0.2)] transition-all">
                Get Started Free <ArrowRight size={18} />
              </Link>
              <a href="#" className="px-10 py-5 text-white border border-white/25 rounded-2xl text-[15px] font-medium hover:bg-white/10 hover:border-white/40 transition-all">
                Contact Sales
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
