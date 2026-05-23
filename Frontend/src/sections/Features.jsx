import { Upload, FileText, Brain, RefreshCw, Timer, BarChart3 } from "lucide-react";
import Reveal from "@/components/effects/Reveal";
import StaggerContainer, { StaggerItem } from "@/components/effects/StaggerContainer";

const features = [
  { icon: Upload, title: "Direct PDF to AI", desc: "Upload PDFs straight to Gemini AI. No text extraction needed." },
  { icon: FileText, title: "PPTX Support", desc: "Upload PowerPoint files directly. Text extracted from every slide." },
  { icon: Brain, title: "Adaptive Quizzes", desc: "Questions from YOUR materials. Every question is contextually relevant." },
  { icon: RefreshCw, title: "No Repetition", desc: "AI tracks every question asked. Each new set is completely unique." },
  { icon: Timer, title: "Exam Simulation", desc: "Full mock exams with realistic timing, scoring, and review." },
  { icon: BarChart3, title: "Deep Analytics", desc: "Track mastery scores, study streaks, and weak topics over time." },
];

export default function Features() {
  return (
    <section id="features" className="bg-white py-24 sm:py-32">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <Reveal>
            <span className="inline-flex items-center px-5 py-2 bg-[#FEF2F2] text-[#DC2626] text-xs font-semibold uppercase tracking-widest rounded-full mb-6">Features</span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#171717] mb-6 tracking-tight">
              Everything you need to excel
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="text-lg text-[#737373] max-w-[600px] mx-auto leading-relaxed">
              From material upload to mastery tracking, every tool is designed for one thing: results.
            </p>
          </Reveal>
        </div>

        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <StaggerItem key={i}>
                <div className="group h-full bg-white border border-[#E5E5E5] rounded-2xl p-7 hover:border-[#DC2626]/25 hover:shadow-[0_12px_48px_rgba(0,0,0,0.1)] hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 bg-[#FEF2F2] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#DC2626] transition-colors duration-300">
                    <Icon size={22} strokeWidth={1.5} className="text-[#DC2626] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#171717] mb-2">{f.title}</h3>
                  <p className="text-[14px] text-[#737373] leading-relaxed">{f.desc}</p>
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
