import { Upload, Brain, Target } from "lucide-react";
import Reveal from "@/components/effects/Reveal";
import StaggerContainer, { StaggerItem } from "@/components/effects/StaggerContainer";

const steps = [
  { num: "01", icon: Upload, title: "Upload", desc: "Drop your lecture slides, notes, or textbooks. We support PDF and PowerPoint files." },
  { num: "02", icon: Brain, title: "Analyze", desc: "Our AI reads your materials directly and detects concepts, topics, and key learning areas." },
  { num: "03", icon: Target, title: "Master", desc: "Take dynamic quizzes generated from YOUR materials. Each question is unique and personalized." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#FAFAFA] py-32 lg:py-40">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-24">
          <Reveal>
            <span className="inline-flex items-center px-5 py-2 bg-[#FEF2F2] text-[#DC2626] text-xs font-semibold uppercase tracking-widest rounded-full mb-8">
              How It Works
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-[#171717] tracking-tight leading-tight">Three steps to mastery</h2>
          </Reveal>
        </div>

        <StaggerContainer className="grid md:grid-cols-3 gap-12 lg:gap-20">
          {steps.map((step, i) => {
            const Icon = step.icon;
            return (
              <StaggerItem key={i}>
                <div className="relative text-center">
                  <div className="relative z-10">
                    <div className="w-16 h-16 bg-white border border-[#E5E5E5] rounded-2xl flex items-center justify-center mx-auto mb-10 shadow-sm">
                      <Icon size={28} strokeWidth={1.5} className="text-[#DC2626]" />
                    </div>
                    <div className="text-7xl font-extrabold text-[#DC2626]/[0.06] mb-6 select-none">{step.num}</div>
                    <h3 className="text-2xl font-bold text-[#171717] mb-5">{step.title}</h3>
                    <p className="text-[15px] text-[#737373] leading-relaxed max-w-[320px] mx-auto">{step.desc}</p>
                  </div>
                  {i < 2 && (
                    <div className="hidden md:block absolute top-8 right-0 translate-x-1/2 w-1/2">
                      <div className="h-px bg-gradient-to-r from-[#E5E5E5] via-[#DC2626]/20 to-[#E5E5E5]" />
                    </div>
                  )}
                </div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
