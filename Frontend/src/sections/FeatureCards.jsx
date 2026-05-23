import { Upload, FileText, Brain, RefreshCw, Timer, BarChart3 } from "lucide-react";
import Reveal from "@/components/effects/Reveal";
import StaggerContainer, { StaggerItem } from "@/components/effects/StaggerContainer";
import { Link } from "react-router-dom";

const features = [
  { icon: Upload, title: "Direct PDF to AI", desc: "Upload PDFs straight to Gemini AI with no text extraction needed. The AI reads and understands your document natively." },
  { icon: FileText, title: "PPTX Support", desc: "Upload PowerPoint files directly. No conversion needed. Text is extracted from every slide automatically." },
  { icon: Brain, title: "Adaptive Quizzes", desc: "Questions generated from YOUR materials, not random internet trivia. Every question is contextually relevant." },
  { icon: RefreshCw, title: "No Repetition", desc: "AI tracks every question asked. Each new set is completely unique so you never see the same question twice." },
  { icon: Timer, title: "Exam Simulation", desc: "Full mock exams with realistic timing, scoring, and review. Prepare under real exam conditions." },
  { icon: BarChart3, title: "Deep Analytics", desc: "Track mastery scores, study streaks, and weak topics. Visualize your progress with beautiful charts." },
];

export default function FeatureCards() {
  return (
    <section className="bg-white py-32 lg:py-40">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-24">
          <Reveal>
            <span className="inline-flex items-center px-5 py-2 bg-[#FEF2F2] text-[#DC2626] text-xs font-semibold uppercase tracking-widest rounded-full mb-8">
              Features
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-[#171717] mb-8 tracking-tight leading-tight">
              Everything you need to excel
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg text-[#737373] max-w-[520px] mx-auto leading-relaxed">
              From material upload to mastery tracking, every tool is designed for one thing: results.
            </p>
          </Reveal>
        </div>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <StaggerItem key={i}>
                <div className="group h-full bg-white border border-[#E5E5E5] rounded-2xl p-10 hover:border-[#DC2626]/20 hover:shadow-[0_24px_64px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500">
                  <div className="w-14 h-14 bg-[#FEF2F2] rounded-2xl flex items-center justify-center mb-8 group-hover:bg-[#DC2626] transition-colors duration-300 shadow-sm">
                    <Icon size={24} strokeWidth={1.5} className="text-[#DC2626] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-[#171717] mb-4">{f.title}</h3>
                  <p className="text-[15px] text-[#737373] leading-relaxed">{f.desc}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <Reveal delay={0.3}>
          <div className="text-center mt-20">
            <Link to="/features" className="inline-flex items-center justify-center gap-3 px-8 py-4 text-[15px] font-medium text-[#171717] bg-white border border-[#E5E5E5] rounded-2xl hover:border-[#DC2626] hover:text-[#DC2626] hover:bg-[#FEF2F2] hover:shadow-[0_4px_16px_rgba(220,38,38,0.08)] transition-all">
              View All Features
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
