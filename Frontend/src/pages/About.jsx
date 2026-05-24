import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Target, Users, Lightbulb, Heart, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/effects/Reveal";

const values = [
  { icon: Target, title: "Student First", desc: "Every feature starts with one question: does this actually help students pass? If not, it does not ship." },
  { icon: Lightbulb, title: "Solve Real Problems", desc: "We built Excel because we saw people drowning in PDFs the night before exams. Every tool we add solves a specific study pain point." },
  { icon: Users, title: "Built With Feedback", desc: "Our students tell us what they need. We listen, build fast, and ship improvements weekly. No roadmap without user input." },
  { icon: Heart, title: "Built With Care", desc: "This started with helping one person pass a test. That same care goes into every quiz we generate and every feature we ship." },
];

const team = [
  {
    name: "Abdur-Rahim Abdus-Salam",
    role: "Founder & CEO",
    image: "/team-rahim.png",
    story: "I watched someone I care about stress over a 200-page PDF three days before a test. She was highlighting paragraphs, making notes on paper, and still felt lost. That is when it clicked: students do not need more study apps. They need a way to turn what they already have; lecture slides, textbooks, handouts into something active. Into questions. Into practice. Into confidence. I built Excel that weekend. Sixty students later, we are just getting started.",
  },
  {
    name: "Joyce Robson",
    role: "Product Manager",
    image: "/team-joyce.jpg",
    story: "I graduated top of my class from TechCrush's Product Management program. I have shipped features under pressure, led teams at buildathons, and learned that the best products are the ones that remove friction. At Excel, I make sure every screen, every button, every quiz flow feels obvious. If a student has to think about how to use the tool, we have failed. My job is to make studying feel effortless.",
  },
];

function SVGPortraitFrame({ children, className }) {
  return (
    <div className={`relative ${className}`}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
        <path d="M100,5 C145,5 182,32 192,72 C202,115 180,165 142,187 C104,209 55,202 28,170 C1,138 -4,88 18,50 C40,12 68,5 100,5Z"
          fill="none" stroke="#DC2626" strokeWidth="1" opacity="0.2" />
        <path d="M100,15 C135,15 167,38 176,73 C185,108 167,150 135,170 C103,190 62,185 40,158 C18,131 14,92 32,60 C50,28 72,15 100,15Z"
          fill="none" stroke="#DC2626" strokeWidth="0.5" opacity="0.12" />
      </svg>
      <div className="relative z-10 w-full h-full" style={{ clipPath: "polygon(50% 0%, 90% 10%, 100% 50%, 90% 90%, 50% 100%, 10% 90%, 0% 50%, 10% 10%)" }}>
        {children}
      </div>
    </div>
  );
}

function TeamSlideshow() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const timer = setInterval(() => {
      setDirection(1);
      setActive((p) => (p + 1) % team.length);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  const goTo = (idx) => {
    setDirection(idx > active ? 1 : -1);
    setActive(idx);
  };

  const member = team[active];

  return (
    <div className="max-w-[900px] mx-auto">
      <div className="grid md:grid-cols-[320px_1fr] gap-10 md:gap-16 items-center">
        {/* Image with SVG frame */}
        <div className="relative mx-auto md:mx-0">
          <SVGPortraitFrame className="w-[240px] h-[240px] sm:w-[300px] sm:h-[300px]">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.img
                key={active}
                src={member.image}
                alt={member.name}
                custom={direction}
                initial={{ opacity: 0, scale: 0.9, x: direction * 30 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9, x: direction * -30 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="w-full h-full object-cover"
              />
            </AnimatePresence>
          </SVGPortraitFrame>
          <div className="absolute -inset-4 border border-[#DC2626]/10 rounded-full pointer-events-none" />
          <div className="absolute -inset-8 border border-[#DC2626]/5 rounded-full pointer-events-none" />
        </div>

        {/* Text content */}
        <div>
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={active}
              custom={direction}
              initial={{ opacity: 0, y: direction * 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: direction * -20 }}
              transition={{ duration: 0.4 }}
            >
              <h3 className="text-xl sm:text-2xl font-bold text-[#171717] mb-1">{member.name}</h3>
              <p className="text-sm text-[#DC2626] font-semibold mb-5">{member.role}</p>
              <p className="text-[14px] sm:text-[15px] text-[#525252] leading-relaxed mb-8">{member.story}</p>
            </motion.div>
          </AnimatePresence>

          <div className="flex items-center gap-4">
            <button onClick={() => goTo((active - 1 + team.length) % team.length)}
              className="w-9 h-9 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#737373] hover:border-[#DC2626] hover:text-[#DC2626] transition-all">
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-2">
              {team.map((_, i) => (
                <button key={i} onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all ${i === active ? "w-8 bg-[#DC2626]" : "w-2 bg-[#E5E5E5] hover:bg-[#DC2626]/40"}`} />
              ))}
            </div>
            <button onClick={() => goTo((active + 1) % team.length)}
              className="w-9 h-9 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#737373] hover:border-[#DC2626] hover:text-[#DC2626] transition-all">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

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
              Built because students <span className="bg-gradient-to-br from-[#DC2626] to-[#EF4444] bg-clip-text text-transparent">deserve better</span>
            </h1>
            <p className="text-lg text-[#A3A3A3] max-w-[600px] mx-auto leading-relaxed mb-10">
              Most study tools give you generic questions from the internet. We give you quizzes built from your actual course materials.
            </p>
            <Link to="/register" className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[14px] font-semibold text-white bg-[#DC2626] rounded-xl hover:bg-[#B91C1C] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(220,38,38,0.25)] transition-all">
              Try It Free <ArrowRight size={18} />
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
                From a problem nobody was solving
              </h2>
              <p className="text-[#737373] leading-relaxed mb-4">
                It started with a PDF. A lecturer handed out a 200-page document and said "this is your test material." Three days to absorb it all. Highlighting, note-taking, flashcards; none of it was fast enough.
              </p>
              <p className="text-[#737373] leading-relaxed mb-4">
                That is the moment we realized: students do not need more generic quiz apps. They need a tool that takes what they already have; their slides, their notes, their textbooks , and uses AI to turn it into active practice.
              </p>
              <p className="text-[#737373] leading-relaxed">
                We built Excel to do exactly that. Upload your material. Our AI generates personalized quizzes. Track what you know and fix what you do not. Sixty students are already using it. We are building for the next thousand.
              </p>
            </Reveal>

            <Reveal delay={0.2}>
              <div className="bg-[#FAFAFA] rounded-2xl p-10 border border-[#E5E5E5]">
                <div className="grid grid-cols-2 gap-8">
                  {[
                    { value: "2026", label: "Founded" },
                    { value: "60+", label: "Students" },
                    { value: "2", label: "Team Members" },
                    { value: "1", label: "Mission" },
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
              <h2 className="text-3xl sm:text-4xl font-bold text-[#171717] tracking-tight">How we work</h2>
            </Reveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {values.map((v, i) => {
              const Icon = v.icon;
              return (
                <Reveal key={i} delay={i * 0.1}>
                  <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E5E5E5] h-full">
                    <div className="w-12 h-12 bg-[#FEF2F2] rounded-xl flex items-center justify-center mb-5">
                      <Icon size={22} className="text-[#DC2626]" strokeWidth={1.5} />
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-[#171717] mb-2">{v.title}</h3>
                    <p className="text-xs sm:text-sm text-[#737373] leading-relaxed">{v.desc}</p>
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
              <h2 className="text-3xl sm:text-4xl font-bold text-[#171717] tracking-tight">Small team, big impact</h2>
            </Reveal>
          </div>

          <Reveal>
            <TeamSlideshow />
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
