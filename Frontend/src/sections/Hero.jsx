import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Play } from "lucide-react";
import FloatingBlobs from "@/components/effects/FloatingBlobs";

const stats = [
  { value: "60+", label: "Students" },
  { value: "1,200+", label: "Quizzes Taken" },
  { value: "94%", label: "Pass Rate" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-[#0A0A0A] overflow-hidden flex items-center justify-center">
      {/* Dot grid background */}
      <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
      <FloatingBlobs />

      {/* Central glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 60%)", filter: "blur(80px)" }} />

      {/* Floating shapes */}
      <motion.div className="absolute top-[20%] right-[15%] w-3 h-3 bg-[#DC2626]/20 rounded-sm" animate={{ y: [0, -15, 0], rotate: [0, 90, 0] }} transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute bottom-[30%] left-[10%] w-4 h-4 border border-[#DC2626]/15 rounded-full" animate={{ y: [0, 12, 0], x: [0, 8, 0] }} transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />

      <div className="relative z-10 w-full max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 pt-36 pb-28">
        <div className="flex flex-col items-center text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} className="mb-10">
            <span className="inline-flex items-center px-5 py-2 bg-[#FEF2F2] text-[#DC2626] text-xs font-semibold uppercase tracking-widest rounded-full">
              AI-Powered Exam Prep
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.3 }} className="text-5xl sm:text-6xl lg:text-[80px] font-extrabold text-white leading-[1.08] tracking-tight mb-8">
            Study Less.
            <br />
            <span className="bg-gradient-to-br from-[#DC2626] to-[#EF4444] bg-clip-text text-transparent">Learn More.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.4 }} className="text-lg sm:text-xl text-[#A3A3A3] max-w-[560px] mb-12 leading-relaxed">
            Upload your course materials. Our AI reads them and generates personalized quizzes directly from your content. No generic questions. Just targeted learning.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.5 }} className="flex flex-col sm:flex-row items-center gap-5 mb-20">
            <Link to="/register" className="inline-flex items-center justify-center gap-3 px-10 py-5 text-[15px] font-semibold text-white bg-[#DC2626] rounded-2xl hover:bg-[#B91C1C] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(220,38,38,0.3)] transition-all">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <a href="#how-it-works" className="inline-flex items-center justify-center gap-3 px-8 py-5 text-[15px] font-medium text-white/70 border border-white/15 rounded-2xl hover:border-white/30 hover:text-white hover:bg-white/5 transition-all duration-300">
              <Play size={15} className="opacity-70" /> See How It Works
            </a>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.6 }} className="flex items-center justify-center gap-6 sm:gap-16 lg:gap-24">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-2xl sm:text-4xl font-bold text-white mb-2">{stat.value}</p>
                <p className="text-[10px] sm:text-xs text-[#737373] uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#FAFAFA] to-transparent" />
    </section>
  );
}
