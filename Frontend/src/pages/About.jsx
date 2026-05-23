import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Target, Users, Lightbulb, Heart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/effects/Reveal";

const values = [
  { icon: Target, title: "Student First", desc: "Every feature is designed with the student experience in mind. Your success is our success." },
  { icon: Lightbulb, title: "AI-Powered", desc: "We leverage cutting-edge AI to create personalized learning experiences that adapt to your needs." },
  { icon: Users, title: "Community Driven", desc: "We build with our users. Your feedback shapes the product roadmap and feature priorities." },
  { icon: Heart, title: "Passion for Learning", desc: "We believe education transforms lives. Our mission is to make effective study tools accessible to everyone." },
];

const team = [
  { name: "Alex Rivera", role: "CEO & Co-founder", color: "from-[#DC2626] to-[#EF4444]" },
  { name: "Jordan Lee", role: "CTO & Co-founder", color: "from-[#F59E0B] to-[#FBBF24]" },
  { name: "Priya Sharma", role: "Head of AI", color: "from-[#10B981] to-[#34D399]" },
  { name: "Noah Kim", role: "Lead Designer", color: "from-[#8B5CF6] to-[#A78BFA]" },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#0A0A0A] relative overflow-hidden">
        <div className="absolute inset-0 opacity-50" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] rounded-full pointer-events-none" style={{ background: "radial-gradient(circle, rgba(220,38,38,0.06) 0%, transparent 70%)", filter: "blur(60px)" }} />

        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
            <span className="inline-flex items-center px-5 py-2 bg-[#FEF2F2] text-[#DC2626] text-xs font-semibold uppercase tracking-widest rounded-full mb-6">About</span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-6">
              Built for students, by <span className="bg-gradient-to-br from-[#DC2626] to-[#EF4444] bg-clip-text text-transparent">students</span>
            </h1>
            <p className="text-lg text-[#A3A3A3] max-w-[600px] mx-auto leading-relaxed mb-10">
              We started Excel because we were frustrated with generic study tools. Now we are building the future of personalized learning.
            </p>
            <Link to="/register" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[14px] font-semibold text-white bg-[#DC2626] rounded-xl hover:bg-[#B91C1C] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(220,38,38,0.25)] transition-all">
              Join the Community <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <Reveal>
              <span className="inline-flex items-center px-5 py-2 bg-[#FEF2F2] text-[#DC2626] text-xs font-semibold uppercase tracking-widest rounded-full mb-6">Our Story</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#171717] mb-6 tracking-tight">
                Frustration turned into innovation
              </h2>
              <p className="text-[#737373] leading-relaxed mb-4">
                Excel was born in a college dorm room. Our founders were spending hours creating flashcards and practice questions manually when they realized AI could do this better.
              </p>
              <p className="text-[#737373] leading-relaxed">
                Today, we serve thousands of students worldwide who trust our AI to generate personalized study materials from their own course content.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="bg-[#FAFAFA] rounded-2xl p-10 border border-[#E5E5E5]">
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { value: "2024", label: "Founded" },
                    { value: "2,000+", label: "Students" },
                    { value: "50K+", label: "Quizzes" },
                    { value: "12", label: "Team Members" },
                  ].map((stat) => (
                    <div key={stat.label} className="text-center">
                      <p className="text-3xl font-bold text-[#DC2626] mb-1">{stat.value}</p>
                      <p className="text-sm text-[#737373]">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-[#FAFAFA] py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <Reveal><span className="inline-flex items-center px-5 py-2 bg-[#FEF2F2] text-[#DC2626] text-xs font-semibold uppercase tracking-widest rounded-full mb-6">Values</span></Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#171717] tracking-tight">What we believe in</h2>
            </Reveal>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5] h-full">
                    <div className="w-12 h-12 bg-[#FEF2F2] rounded-xl flex items-center justify-center mb-5">
                      <Icon size={22} className="text-[#DC2626]" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-semibold text-[#171717] mb-2">{v.title}</h3>
                    <p className="text-sm text-[#737373] leading-relaxed">{v.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 sm:py-32">
        <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-16">
            <Reveal><span className="inline-flex items-center px-5 py-2 bg-[#FEF2F2] text-[#DC2626] text-xs font-semibold uppercase tracking-widest rounded-full mb-6">Team</span></Reveal>
            <Reveal delay={0.1}>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#171717] tracking-tight">Meet the team</h2>
            </Reveal>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5] text-center hover:border-[#DC2626]/20 transition-all">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-2xl font-bold mx-auto mb-5`}>
                    {member.name[0]}
                  </div>
                  <h3 className="text-base font-semibold text-[#171717] mb-1">{member.name}</h3>
                  <p className="text-sm text-[#737373]">{member.role}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
