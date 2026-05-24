import { Upload, FileText, Brain, RefreshCw, Timer, BarChart3 } from "lucide-react";
import Reveal from "@/components/effects/Reveal";
import StaggerContainer, { StaggerItem } from "@/components/effects/StaggerContainer";
import { Link } from "react-router-dom";

const features = [
  { icon: Upload, title: "Direct Upload", desc: "Upload PDFs and PowerPoint files. Our AI reads and understands your content directly — no manual work needed." },
  { icon: FileText, title: "PPTX Support", desc: "Upload lecture slides directly. Content is extracted from every slide and turned into quiz material automatically." },
  { icon: Brain, title: "Smart Quizzes", desc: "Our AI generates questions from YOUR materials, not random internet trivia. Every question is contextually relevant." },
  { icon: RefreshCw, title: "No Repetition", desc: "Our AI tracks every question asked. Each new quiz is completely unique so you never see the same question twice." },
  { icon: Timer, title: "Exam Simulation", desc: "Full mock exams with realistic timing, scoring, and review. Prepare under real exam conditions with 60+ questions." },
  { icon: BarChart3, title: "Deep Analytics", desc: "Track mastery scores, study streaks, and weak topics. Visualize your progress with beautiful charts." },
];

function FeatureShape({ index, children }) {
  // Each card gets a unique SVG decorative shape
  const shapes = [
    // Card 0: Top-right corner curve
    <svg key="s0" className="absolute top-0 right-0 w-20 h-20 pointer-events-none" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg">
      <path d="M80 0 Q40 0 20 20 Q0 40 0 80 L0 0 Z" fill="#DC2626" opacity="0.06" />
      <circle cx="60" cy="20" r="3" fill="#DC2626" opacity="0.12" />
    </svg>,
    // Card 1: Bottom-left arc
    <svg key="s1" className="absolute bottom-0 left-0 w-24 h-24 pointer-events-none" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 96 Q0 48 48 48 Q96 48 96 0 L96 96 Z" fill="#DC2626" opacity="0.05" />
      <circle cx="20" cy="76" r="2.5" fill="#DC2626" opacity="0.1" />
    </svg>,
    // Card 2: Side waves
    <svg key="s2" className="absolute top-4 right-0 w-6 h-full pointer-events-none" viewBox="0 0 24 200" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 0 Q24 50 0 100 Q24 150 0 200" fill="none" stroke="#DC2626" strokeWidth="1" opacity="0.08" />
    </svg>,
    // Card 3: Dotted corner
    <svg key="s3" className="absolute top-3 right-3 pointer-events-none" viewBox="0 0 40 40" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="2" fill="#DC2626" opacity="0.1" />
      <circle cx="20" cy="8" r="2" fill="#DC2626" opacity="0.15" />
      <circle cx="32" cy="8" r="2" fill="#DC2626" opacity="0.1" />
      <circle cx="8" cy="20" r="2" fill="#DC2626" opacity="0.15" />
      <circle cx="20" cy="20" r="2" fill="#DC2626" opacity="0.2" />
      <circle cx="8" cy="32" r="2" fill="#DC2626" opacity="0.1" />
    </svg>,
    // Card 4: Bottom curve
    <svg key="s4" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-12 pointer-events-none" viewBox="0 0 128 48" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 48 Q64 0 128 48 L128 48 L0 48 Z" fill="#DC2626" opacity="0.04" />
    </svg>,
    // Card 5: Corner bracket
    <svg key="s5" className="absolute top-4 left-4 w-10 h-10 pointer-events-none" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 16 L0 0 L16 0" fill="none" stroke="#DC2626" strokeWidth="1.5" opacity="0.15" />
      <path d="M40 24 L40 40 L24 40" fill="none" stroke="#DC2626" strokeWidth="1.5" opacity="0.15" />
    </svg>,
  ];

  return (
    <div className="relative group h-full bg-white border border-[#E5E5E5] rounded-[24px] p-8 sm:p-10 hover:border-[#DC2626]/20 hover:shadow-[0_24px_64px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500 overflow-hidden">
      {shapes[index % shapes.length]}
      {children}
    </div>
  );
}

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

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-10">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <StaggerItem key={i}>
                <FeatureShape index={i}>
                  <div className="w-12 h-12 sm:w-14 sm:h-14 bg-[#FEF2F2] rounded-2xl flex items-center justify-center mb-6 sm:mb-8 group-hover:bg-[#DC2626] transition-colors duration-300 shadow-sm">
                    <Icon size={22} strokeWidth={1.5} className="text-[#DC2626] group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-base sm:text-xl font-semibold text-[#171717] mb-3 sm:mb-4">{f.title}</h3>
                  <p className="text-xs sm:text-[15px] text-[#737373] leading-relaxed">{f.desc}</p>
                </FeatureShape>
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
