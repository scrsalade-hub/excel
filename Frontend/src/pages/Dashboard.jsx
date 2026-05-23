import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { TrendingUp, Zap, Award, BookOpen, Upload, ClipboardCheck, Clock, BarChart3 } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";

const quickActions = [
  { label: "Study Session", icon: BookOpen, desc: "Practice with AI quizzes", href: "/study" },
  { label: "Upload Materials", icon: Upload, desc: "Add PDF or PPTX files", href: "/uploads" },
  { label: "Mock Exam", icon: ClipboardCheck, desc: "Timed simulation test", href: "/exam" },
];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await apiFetch("/api/dashboard/stats");
      setData(res);
    } catch (err) {
      setError(err.message || "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  };

  const stats = data ? [
    { label: "Exam Readiness", value: `${data.readiness || 0}%`, icon: Award, color: "#DC2626", bg: "#FEF2F2" },
    { label: "Study Streak", value: `${data.stats?.studyStreak || 0} days`, icon: Zap, color: "#F59E0B", bg: "#FFFBEB" },
    { label: "Avg Score", value: `${data.stats?.avgScore || 0}%`, icon: TrendingUp, color: "#10B981", bg: "#ECFDF5" },
  ] : [];

  const recentSessions = data?.recentSessions || [];

  // Weekly bar chart data from API or fallback
  const weeklyScores = data?.weeklyData?.map(d => d.score) || [40, 55, 45, 70, 60, 85, 78];

  if (loading) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-[60vh]">
          <div className="w-8 h-8 border-2 border-[#DC2626] border-t-transparent rounded-full animate-spin" />
        </div>
      </AppShell>
    );
  }

  if (error) {
    return (
      <AppShell>
        <div className="bg-[#FEF2F2] text-[#DC2626] text-sm px-5 py-4 rounded-2xl border border-[#DC2626]/10">
          {error}
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mb-12">
        <h1 className="text-3xl font-bold text-[#171717] mb-3">Dashboard</h1>
        <p className="text-[#737373] text-base">Welcome back! Here&apos;s your learning overview.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-6 mb-10">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="bg-white rounded-2xl p-7 border border-[#E5E5E5]">
              <div className="flex items-center gap-4 mb-5">
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: stat.bg }}>
                  <Icon size={20} style={{ color: stat.color }} strokeWidth={1.5} />
                </div>
                <span className="text-sm text-[#737373] font-medium">{stat.label}</span>
              </div>
              <p className="text-3xl font-bold text-[#171717]">{stat.value}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5] mb-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg font-semibold text-[#171717] mb-1">Quick Actions</h2>
            <p className="text-sm text-[#737373]">Start learning in one click</p>
          </div>
          <div className="flex items-center gap-2.5 px-4 py-2 bg-[#FEF2F2] rounded-full">
            <div className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse" />
            <span className="text-xs font-semibold text-[#DC2626]">AI Ready</span>
          </div>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {quickActions.map((action) => (
            <Link key={action.label} to={action.href} className="bg-[#FAFAFA] rounded-xl p-6 border border-[#E5E5E5] hover:border-[#DC2626]/30 hover:bg-white hover:shadow-lg transition-all group">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mb-5 group-hover:bg-[#FEF2F2] transition-colors border border-[#E5E5E5]">
                <action.icon size={20} className="text-[#737373] group-hover:text-[#DC2626] transition-colors" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-semibold text-[#171717] mb-1">{action.label}</p>
              <p className="text-xs text-[#737373]">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-semibold text-[#171717]">Recent Sessions</h2>
            <Clock size={18} className="text-[#A3A3A3]" strokeWidth={1.5} />
          </div>
          {recentSessions.length === 0 ? (
            <p className="text-sm text-[#737373] text-center py-6">No sessions yet. Start studying!</p>
          ) : (
            <div className="space-y-4">
              {recentSessions.map((s, i) => (
                <div key={s.id || i} className="flex items-center justify-between py-4 px-5 bg-[#FAFAFA] rounded-xl">
                  <div>
                    <p className="text-sm font-semibold text-[#171717] mb-1">{s.title || "Study Session"}</p>
                    <p className="text-xs text-[#737373]">{s.type || "Quiz"} {s.score !== undefined && `\u00B7 ${s.score}%`}</p>
                  </div>
                  {s.score !== undefined && (
                    <span className="text-base font-bold text-[#10B981]">{s.score}%</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5]">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-lg font-semibold text-[#171717]">Weekly Performance</h2>
            <BarChart3 size={18} className="text-[#A3A3A3]" strokeWidth={1.5} />
          </div>
          <div className="flex items-end gap-4 h-[160px]">
            {weeklyScores.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-3">
                <motion.div initial={{ height: 0 }} animate={{ height: `${h * 1.6}px` }} transition={{ delay: i * 0.1, duration: 0.5 }} className="w-full bg-[#DC2626] rounded-t-lg" style={{ opacity: 0.3 + (i * 0.1) }} />
                <span className="text-[11px] text-[#A3A3A3] font-medium">{["M", "T", "W", "T", "F", "S", "S"][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
