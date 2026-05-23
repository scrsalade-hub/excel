import { motion } from "framer-motion";
import { TrendingUp, BookOpen, Award, Clock, BarChart3, Target } from "lucide-react";
import AppShell from "@/components/layout/AppShell";

const weeklyData = [40, 55, 45, 70, 60, 85, 78];
const topicStats = [
  { topic: "Organic Chemistry", score: 82, total: 45 },
  { topic: "Calculus", score: 76, total: 38 },
  { topic: "Data Structures", score: 91, total: 22 },
  { topic: "Linear Algebra", score: 68, total: 30 },
];

export default function Analytics() {
  return (
    <AppShell>
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-[#171717] mb-3">Analytics</h1>
        <p className="text-[#737373] text-base">Track your learning progress and identify areas for improvement.</p>
      </div>

      <div className="grid sm:grid-cols-4 gap-5 mb-8">
        {[
          { icon: BookOpen, label: "Total Quizzes", value: "45", color: "#DC2626", bg: "#FEF2F2" },
          { icon: Target, label: "Avg Score", value: "78%", color: "#F59E0B", bg: "#FFFBEB" },
          { icon: Award, label: "Best Topic", value: "Data Structures", color: "#10B981", bg: "#ECFDF5" },
          { icon: Clock, label: "Study Time", value: "24h", color: "#8B5CF6", bg: "#F5F3FF" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-5 border border-[#E5E5E5]">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4" style={{ background: stat.bg }}>
                <Icon size={18} style={{ color: stat.color }} strokeWidth={1.5} />
              </div>
              <p className="text-sm text-[#737373] mb-1">{stat.label}</p>
              <p className="text-xl font-bold text-[#171717]">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#171717]">Weekly Performance</h2>
            <BarChart3 size={18} className="text-[#A3A3A3]" strokeWidth={1.5} />
          </div>
          <div className="flex items-end gap-3 h-[180px]">
            {weeklyData.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <motion.div initial={{ height: 0 }} animate={{ height: `${h * 1.8}px` }} transition={{ delay: i * 0.1, duration: 0.5 }} className="w-full bg-[#DC2626] rounded-t-md" style={{ opacity: 0.3 + (i * 0.1) }} />
                <span className="text-[11px] text-[#A3A3A3] font-medium">{["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5]">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-[#171717]">Topic Breakdown</h2>
            <TrendingUp size={18} className="text-[#A3A3A3]" strokeWidth={1.5} />
          </div>
          <div className="space-y-5">
            {topicStats.map((t, i) => (
              <div key={t.topic}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#171717] font-medium">{t.topic}</span>
                  <span className="text-sm text-[#DC2626] font-semibold">{t.score}%</span>
                </div>
                <div className="h-2.5 bg-[#F5F5F5] rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${t.score}%` }} transition={{ delay: i * 0.15, duration: 0.6 }} className="h-full bg-[#DC2626] rounded-full" />
                </div>
                <p className="text-xs text-[#A3A3A3] mt-1">{t.total} questions answered</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
