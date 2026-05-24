import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import Reveal from "@/components/effects/Reveal";

const testimonials = [
  {
    quote: "I went from barely passing to the top 10% of my class. The AI pulls questions straight from my course slides. Every question feels like it came from my professor.",
    name: "Sarah Chen",
    role: "Computer Science",
    avatar: "/avatar-sarah.jpg",
    rating: 5,
  },
  {
    quote: "Flashcards used to take me four hours every weekend. Now I upload my lecture notes and the AI generates practice questions instantly. Best study tool I have ever used.",
    name: "Marcus Johnson",
    role: "Pre-Med",
    avatar: "/avatar-marcus.jpg",
    rating: 5,
  },
  {
    quote: "The analytics page showed me I was scoring 80% on everything except molecular biology. I spent two days drilling that topic and scored a 94 on the final.",
    name: "Aisha Patel",
    role: "Economics",
    avatar: "/avatar-aisha.jpg",
    rating: 5,
  },
];

function GiantQuoteSVG({ className }) {
  return (
    <svg className={className} viewBox="0 0 120 96" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 56.4V32.8C0 21.6 3.2 12.8 9.6 6.4C16 2.13 24.8 0 36 0H38.4V18.4C32 18.4 27.2 19.73 24 22.4C20.8 25.07 19.2 29.07 19.2 34.4V37.6H38.4V96H0V56.4ZM72 56.4V32.8C72 21.6 75.2 12.8 81.6 6.4C88 2.13 96.8 0 108 0H110.4V18.4C104 18.4 99.2 19.73 96 22.4C92.8 25.07 91.2 29.07 91.2 34.4V37.6H110.4V96H72V56.4Z" fill="currentColor" />
    </svg>
  );
}

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [direction, setDirection] = useState(1);

  const go = useCallback((idx) => {
    setDirection(idx > active ? 1 : -1);
    setActive(idx);
  }, [active]);

  const next = useCallback(() => {
    setDirection(1);
    setActive((p) => (p + 1) % testimonials.length);
  }, []);

  const prev = useCallback(() => {
    setDirection(-1);
    setActive((p) => (p - 1 + testimonials.length) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  const t = testimonials[active];

  const slideVariants = {
    enter: (dir) => ({ opacity: 0, x: dir * 60, scale: 0.97 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir) => ({ opacity: 0, x: dir * -60, scale: 0.97 }),
  };

  return (
    <section className="bg-[#FAFAFA] py-24 sm:py-32 overflow-hidden">
      <div className="max-w-[900px] mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="text-center mb-16">
          <Reveal>
            <span className="inline-flex items-center px-5 py-2 bg-[#FEF2F2] text-[#DC2626] text-xs font-semibold uppercase tracking-widest rounded-full mb-6">
              Testimonials
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#171717] tracking-tight">
              Students are passing because of this
            </h2>
          </Reveal>
        </div>

        {/* Carousel */}
        <Reveal delay={0.2}>
          <div className="relative">
            {/* Red glow behind */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(220,38,38,0.04) 0%, transparent 70%)", filter: "blur(40px)" }} />

            {/* Giant quote mark */}
            <GiantQuoteSVG className="absolute -top-6 left-1/2 -translate-x-1/2 w-16 h-12 sm:w-20 sm:h-14 text-[#DC2626]/[0.08] pointer-events-none" />

            {/* Quote content */}
            <div className="relative min-h-[280px] sm:min-h-[240px] flex items-center justify-center">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={active}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.25, 0.1, 0.25, 1] }}
                  className="text-center w-full"
                >
                  {/* Stars */}
                  <div className="flex items-center justify-center gap-1 mb-6">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={16} className="text-[#F59E0B] fill-[#F59E0B]" />
                    ))}
                  </div>

                  {/* Quote */}
                  <blockquote className="text-xl sm:text-2xl lg:text-[28px] font-medium text-[#171717] leading-relaxed mb-10 max-w-[680px] mx-auto">
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>

                  {/* Author */}
                  <div className="flex items-center justify-center gap-4">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#DC2626]/20"
                    />
                    <div className="text-left">
                      <p className="text-sm font-semibold text-[#171717]">{t.name}</p>
                      <p className="text-xs text-[#737373]">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Side arrows */}
            <button
              onClick={prev}
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 sm:-translate-x-6 w-10 h-10 rounded-full border border-[#E5E5E5] bg-white flex items-center justify-center text-[#737373] hover:border-[#DC2626] hover:text-[#DC2626] transition-all shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={next}
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 sm:translate-x-6 w-10 h-10 rounded-full border border-[#E5E5E5] bg-white flex items-center justify-center text-[#737373] hover:border-[#DC2626] hover:text-[#DC2626] transition-all shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </Reveal>

        {/* Avatar nav */}
        <div className="flex items-center justify-center gap-4 mt-12">
          {testimonials.map((person, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`relative rounded-full transition-all duration-300 ${
                i === active
                  ? "scale-110 ring-2 ring-[#DC2626] ring-offset-2"
                  : "opacity-50 hover:opacity-80 scale-95"
              }`}
            >
              <img
                src={person.avatar}
                alt={person.name}
                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover"
              />
            </button>
          ))}
        </div>

        {/* Dot indicators */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === active ? "w-8 bg-[#DC2626]" : "w-2 bg-[#E5E5E5] hover:bg-[#DC2626]/30"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
