import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Upload, FileText, Brain, RefreshCw, Timer, BarChart3, ArrowRight, Zap, Target, Shield, BookOpen, Award } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/effects/Reveal";
import StaggerContainer, { StaggerItem } from "@/components/effects/StaggerContainer";

const allFeatures = [
  { icon: Upload, title: "Direct PDF to AI", desc: "Upload PDFs straight to Gemini AI. No text extraction needed. The AI reads your document natively and understands the content, structure, and context.", color: "#DC2626", bg: "#FEF2F2" },
  { icon: FileText, title: "PPTX Support", desc: "Upload PowerPoint files directly. No conversion needed. Text is extracted from every slide, including speaker notes and embedded content.", color: "#F59E0B", bg: "#FFFBEB" },
  { icon: Brain, title: "Adaptive Quizzes", desc: "Questions generated from YOUR materials, not random internet trivia. Every question is contextually relevant to what you are studying.", color: "#10B981", bg: "#ECFDF5" },
  { icon: RefreshCw, title: "No Repetition", desc: "AI tracks every question asked across all sessions. Each new set is completely unique. Never see the same question twice.", color: "#DC2626", bg: "#FEF2F2" },
  { icon: Timer, title: "Exam Simulation", desc: "Full mock exams with realistic timing, scoring, and review. Prepare under exam conditions to reduce anxiety and improve performance.", color: "#8B5CF6", bg: "#F5F3FF" },
  { icon: BarChart3, title: "Deep Analytics", desc: "Track mastery scores, study streaks, and weak topics. Visualize your progress over time with beautiful, actionable charts.", color: "#10B981", bg: "#ECFDF5" },
  { icon: Zap, title: "Instant Feedback", desc: "Get immediate explanations for every answer. Understand why you got it right or wrong with detailed reasoning from AI.", color: "#F59E0B", bg: "#FFFBEB" },
  { icon: Target, title: "Topic Selection", desc: "Choose which topics to focus on. The AI detects all topics in your materials and lets you create targeted study sessions.", color: "#8B5CF6", bg: "#F5F3FF" },
  { icon: Shield, title: "Secure & Private", desc: "Your materials are encrypted and never shared. Your data belongs to you. We use industry-standard security practices.", color: "#DC2626", bg: "#FEF2F2" },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="pt-32 pb-20 bg-[#0A0A0A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(220,38,38,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <span className="inline-flex items-center px-5 py-2 bg-[#FEF2F2] text-[#DC2626] text-xs font-semibold uppercase tracking-widest rounded-full mb-6">Features</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
              Everything you need to <span className="bg-gradient-to-br from-[#DC2626] to-[#EF4444] bg-clip-text text-transparent">excel</span>
            </h1>
            <p className="text-lg text-[#A3A3A3] max-w-[600px] mx-auto leading-relaxed mb-10">
              A complete toolkit designed to transform how you study, practice, and perform.
            </p>
            <Link to="/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[15px] font-semibold text-white bg-[#DC2626] rounded-2xl hover:bg-[#B91C1C] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(220,38,38,0.3)] transition-all">
              Start Learning Now <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      <section className="py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
          <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {allFeatures.map((f, i) => {
              const Icon = f.icon;
              return (
                <StaggerItem key={i}>
                  <div className="group h-full bg-white border border-[#E5E5E5] rounded-2xl p-8 hover:border-[#DC2626]/20 hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" style={{ background: f.bg }}>
                      <Icon size={24} strokeWidth={1.5} style={{ color: f.color }} />
                    </div>
                    <h3 className="text-xl font-semibold text-[#171717] mb-3">{f.title}</h3>
                    <p className="text-sm text-[#737373] leading-relaxed">{f.desc}</p>
                  </div>
                </StaggerItem>
              );
            })}
          </StaggerContainer>
        </div>
      </section>

      <section className="bg-[#FAFAFA] py-20 border-y border-[#E5E5E5]">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {[
              { icon: BookOpen, value: "50K+", label: "Quizzes Generated" },
              { icon: Award, value: "94%", label: "Avg Improvement" },
              { icon: Zap, value: "2,000+", label: "Active Students" },
              { icon: BarChart3, value: "99.9%", label: "Uptime" },
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="text-center">
                    <div className="w-14 h-14 bg-[#FEF2F2] rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Icon size={24} className="text-[#DC2626]" strokeWidth={1.5} />
                    </div>
                    <p className="text-3xl font-bold text-[#171717] mb-1">{stat.value}</p>
                    <p className="text-sm text-[#737373]">{stat.label}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
