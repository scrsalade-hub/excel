import { Quote } from "lucide-react";
import Reveal from "@/components/effects/Reveal";
import StaggerContainer, { StaggerItem } from "@/components/effects/StaggerContainer";

const testimonials = [
  { quote: "My grades improved by 20% in just one semester. The AI understands my course material and asks exactly the right questions.", name: "Sarah Chen", role: "Computer Science, MIT", color: "from-[#DC2626] to-[#EF4444]" },
  { quote: "I used to spend hours making flashcards. Now I upload my slides and get personalized quizzes instantly. Game changer.", name: "Marcus Johnson", role: "Pre-Med, Stanford", color: "from-[#F59E0B] to-[#FBBF24]" },
  { quote: "The analytics showed me exactly which topics I was weak in. I focused my study time and aced my finals.", name: "Aisha Patel", role: "Economics, Harvard", color: "from-[#10B981] to-[#34D399]" },
];

export default function Testimonials() {
  return (
    <section className="bg-white py-32 lg:py-40">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-24">
          <Reveal>
            <span className="inline-flex items-center px-5 py-2 bg-[#FEF2F2] text-[#DC2626] text-xs font-semibold uppercase tracking-widest rounded-full mb-8">
              Testimonials
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-[#171717] tracking-tight leading-tight">Loved by students worldwide</h2>
          </Reveal>
        </div>

        <StaggerContainer className="grid md:grid-cols-3 gap-10">
          {testimonials.map((t, i) => (
            <StaggerItem key={i}>
              <div className="h-full bg-white border border-[#E5E5E5] rounded-2xl p-10 hover:border-[#DC2626]/20 hover:shadow-[0_24px_64px_rgba(0,0,0,0.1)] hover:-translate-y-2 transition-all duration-500">
                <Quote size={28} strokeWidth={1.5} className="text-[#DC2626]/15 mb-8" />
                <p className="text-[15px] text-[#525252] leading-relaxed mb-10">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-4 pt-8 border-t border-[#F5F5F5]">
                  <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white text-base font-bold flex-shrink-0`}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#171717]">{t.name}</p>
                    <p className="text-xs text-[#A3A3A3]">{t.role}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
