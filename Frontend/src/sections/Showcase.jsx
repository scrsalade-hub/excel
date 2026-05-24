import { motion } from "framer-motion";
import Reveal from "@/components/effects/Reveal";
import { TrendingUp, Zap, BarChart3, BookOpen, Upload, ClipboardCheck, Award } from "lucide-react";

export default function Showcase() {
  return (
    <section className="bg-[#0A0A0A] py-32 lg:py-40 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center mb-20">
          <Reveal>
            <span className="inline-flex items-center px-5 py-2 bg-[#FEF2F2] text-[#DC2626] text-xs font-semibold uppercase tracking-widest rounded-full mb-8">
              Product
            </span>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-white tracking-tight leading-tight">See it in action</h2>
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <motion.div className="relative max-w-[1000px] mx-auto" whileHover={{ y: -8 }} transition={{ duration: 0.4 }}>
            <div className="absolute -inset-10 rounded-[40px] pointer-events-none" style={{ background: "radial-gradient(circle at 50% 40%, rgba(220,38,38,0.1) 0%, transparent 60%)", filter: "blur(60px)" }} />

            <div className="relative bg-[#141414] rounded-3xl border border-[#2A2A2A] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
              {/* Browser Header */}
              <div className="flex items-center gap-3 px-6 py-4 border-b border-[#2A2A2A] bg-[#1A1A1A]">
                <div className="flex gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FF5F57]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#FEBC2E]" />
                  <div className="w-3.5 h-3.5 rounded-full bg-[#28C840]" />
                </div>
                <div className="flex-1 mx-6 max-w-[360px]">
                  <div className="bg-[#0A0A0A] rounded-lg px-4 py-2 text-xs text-[#525252] text-center font-mono">excel.app/dashboard</div>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-8 bg-[#0E0E0E]">
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-5 mb-8">
                  {[
                    { label: "Exam Readiness", value: "87%", icon: Award, color: "#DC2626", bg: "rgba(220,38,38,0.1)" },
                    { label: "Study Streak", value: "12 days", icon: Zap, color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
                    { label: "Avg Score", value: "78%", icon: TrendingUp, color: "#10B981", bg: "rgba(16,185,129,0.1)" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-[#141414] rounded-xl p-6 border border-[#2A2A2A]">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: stat.bg }}>
                          <stat.icon size={18} style={{ color: stat.color }} strokeWidth={1.5} />
                        </div>
                        <span className="text-xs text-[#525252] font-medium">{stat.label}</span>
                      </div>
                      <p className="text-3xl font-bold text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Quick Actions */}
                <div className="bg-[#141414] rounded-xl p-6 border border-[#2A2A2A] mb-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm font-semibold text-white">Quick Actions</p>
                      <p className="text-xs text-[#525252] mt-1">Start learning in one click</p>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-[#DC2626]/10 rounded-full">
                      <div className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse" />
                      <span className="text-xs font-medium text-[#DC2626]">AI Ready</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {[
                      { label: "Study Session", icon: BookOpen, desc: "Practice quizzes" },
                      { label: "Upload Materials", icon: Upload, desc: "PDF or PPTX" },
                      { label: "Mock Exam", icon: ClipboardCheck, desc: "Timed simulation" },
                    ].map((action) => (
                      <div key={action.label} className="bg-[#1A1A1A] rounded-xl p-5 border border-[#2A2A2A] hover:border-[#DC2626]/30 hover:bg-[#1E1E1E] transition-all cursor-pointer group">
                        <div className="w-11 h-11 bg-[#2A2A2A] rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#DC2626]/10 transition-colors">
                          <action.icon size={20} className="text-[#737373] group-hover:text-[#DC2626] transition-colors" strokeWidth={1.5} />
                        </div>
                        <p className="text-sm font-medium text-white mb-1">{action.label}</p>
                        <p className="text-xs text-[#525252]">{action.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chart */}
                <div className="bg-[#141414] rounded-xl p-6 border border-[#2A2A2A]">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm font-semibold text-white">Performance Overview</p>
                      <p className="text-xs text-[#525252] mt-1">Last 7 days</p>
                    </div>
                    <BarChart3 size={18} className="text-[#525252]" strokeWidth={1.5} />
                  </div>
                  <div className="flex items-end gap-3 h-[90px]">
                    {[40, 55, 45, 70, 60, 85, 78].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-[#DC2626] rounded-t-md transition-all" style={{ height: `${h}px`, opacity: 0.3 + (i * 0.1) }} />
                        <span className="text-[10px] text-[#525252]">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </Reveal>
      </div>
    </section>
  );
}
