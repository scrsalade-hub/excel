import { motion } from "framer-motion";
import { Check, Sparkles, ArrowRight, HelpCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/effects/Reveal";

const plans = [
  {
    name: "Free", price: "$0", period: "forever", desc: "Perfect for trying out",
    features: ["5 uploads per month", "10 questions per quiz", "Basic analytics", "Email support"],
    highlighted: false,
  },
  {
    name: "Pro", price: "$9.99", period: "/month", desc: "Most popular",
    features: ["Unlimited uploads", "30 questions per quiz", "Advanced analytics", "Priority support", "Exam simulation", "No repetition AI"],
    highlighted: true,
  },
  {
    name: "Team", price: "$29.99", period: "/month", desc: "For study groups",
    features: ["Everything in Pro", "Up to 5 members", "Shared materials", "Team analytics", "Custom branding", "API access"],
    highlighted: false,
  },
];

const faqs = [
  { q: "Can I upgrade or downgrade anytime?", a: "Yes, you can change your plan at any time. Changes take effect at the start of your next billing cycle." },
  { q: "Is there a free trial for Pro?", a: "Pro includes a 14-day free trial. No credit card required." },
  { q: "What file formats are supported?", a: "We support PDF and PPTX files. Direct upload to AI with no conversion needed." },
  { q: "Can I cancel my subscription?", a: "Yes, cancel anytime from your account settings. You'll keep access until the end of your billing period." },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#0A0A0A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(220,38,38,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />

        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center px-5 py-2 bg-[#FEF2F2] text-[#DC2626] text-xs font-semibold uppercase tracking-widest rounded-full mb-6">Pricing</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-[#A3A3A3] max-w-[520px] mx-auto leading-relaxed">
              Start free, upgrade when you need more. No hidden fees.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 sm:py-32">
        <div className="max-w-[1000px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {plans.map((plan, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className={`relative rounded-2xl p-8 h-full ${plan.highlighted ? "bg-[#0A0A0A] border-2 border-[#DC2626] shadow-2xl shadow-[#DC2626]/15 scale-[1.02]" : "bg-white border border-[#E5E5E5]"}`}>
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
                    {plan.price === "$0" ? "Start Free" : "Start Trial"}
                  </button>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-[#FAFAFA] py-24 sm:py-32">
        <div className="max-w-[720px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <Reveal>
              <span className="inline-flex items-center px-5 py-2 bg-[#FEF2F2] text-[#DC2626] text-xs font-semibold uppercase tracking-widest rounded-full mb-6">FAQ</span>
            </Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#171717] tracking-tight">Frequently asked questions</h2>
            </Reveal>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5]">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-[#FEF2F2] rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <HelpCircle size={16} className="text-[#DC2626]" strokeWidth={1.5} />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-[#171717] mb-2">{faq.q}</h3>
                      <p className="text-sm text-[#737373] leading-relaxed">{faq.a}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.3}>
            <div className="text-center mt-12">
              <p className="text-sm text-[#737373] mb-4">Still have questions?</p>
              <a href="#" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-[#171717] bg-[#F5F5F5] rounded-xl hover:bg-[#E5E5E5] transition-all">
                Contact Support <ArrowRight size={16} />
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
