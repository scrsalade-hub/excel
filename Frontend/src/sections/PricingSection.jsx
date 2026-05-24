import { Check, Sparkles } from "lucide-react";
import Reveal from "@/components/effects/Reveal";
import StaggerContainer, { StaggerItem } from "@/components/effects/StaggerContainer";

const plans = [
  {
    name: "Free", price: "$0", period: "forever", desc: "Perfect for trying out",
    features: ["5 uploads per month", "10 questions per quiz", "Basic analytics", "Email support"],
    highlighted: false,
  },
  {
    name: "Pro", price: "$9.99", period: "/month", desc: "Most popular",
    features: ["Unlimited uploads", "30 questions per quiz", "Advanced analytics", "Priority support", "Exam simulation", "AI repetition prevention"],
    highlighted: true,
  },
  {
    name: "Team", price: "$29.99", period: "/month", desc: "For study groups",
    features: ["Everything in Pro", "Up to 5 members", "Shared materials", "Team analytics", "Custom branding", "API access"],
    highlighted: false,
  },
];

export default function PricingSection() {
  return (
    <section className="bg-[#FAFAFA] py-24 sm:py-32">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-16">
          <Reveal><span className="inline-flex items-center px-5 py-2 bg-[#FEF2F2] text-[#DC2626] text-xs font-semibold uppercase tracking-widest rounded-full mb-6">Pricing</span></Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl sm:text-5xl font-bold text-[#171717] tracking-tight">Simple, transparent pricing</h2>
          </Reveal>
        </div>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-[1000px] mx-auto items-start">
          {plans.map((plan, i) => (
            <StaggerItem key={i}>
              <div className={`relative rounded-2xl p-8 h-full ${plan.highlighted ? "bg-[#0A0A0A] border-2 border-[#DC2626] shadow-2xl shadow-[#DC2626]/15" : "bg-white border border-[#E5E5E5]"}`}>
                {plan.highlighted && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-4 py-1.5 bg-[#DC2626] text-white text-xs font-bold rounded-full">
                    <Sparkles size={12} /> Most Popular
                  </div>
                )}

                <p className={`text-sm font-semibold mb-3 ${plan.highlighted ? "text-white/60" : "text-[#737373]"}`}>{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-3">
                  <span className={`text-4xl font-bold ${plan.highlighted ? "text-white" : "text-[#171717]"}`}>{plan.price}</span>
                  <span className={`text-sm ${plan.highlighted ? "text-white/40" : "text-[#A3A3A3]"}`}>{plan.period}</span>
                </div>
                <p className={`text-sm mb-8 ${plan.highlighted ? "text-white/40" : "text-[#A3A3A3]"}`}>{plan.desc}</p>

                <ul className="space-y-3.5 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.highlighted ? "bg-[#DC2626]" : "bg-[#ECFDF5]"}`}>
                        <Check size={12} strokeWidth={2.5} className={plan.highlighted ? "text-white" : "text-[#10B981]"} />
                      </div>
                      <span className={`text-sm ${plan.highlighted ? "text-white/70" : "text-[#525252]"}`}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3.5 rounded-xl text-sm font-semibold transition-all ${plan.highlighted ? "bg-[#DC2626] text-white hover:bg-[#B91C1C]" : "bg-[#F5F5F5] text-[#171717] hover:bg-[#E5E5E5]"}`}>
                  Get Started
                </button>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
