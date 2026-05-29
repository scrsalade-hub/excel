import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TrendingUp, Target, Award, Flame, BookOpen, BarChart3, ChevronRight, Calendar } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";

export default function Analytics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await apiFetch("/api/dashboard/stats");
      setData(res);
    } catch (err) {
      setError(err.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const sessions = data?.recentSessions || [];
  const weakTopics = data?.weakTopics || [];
  const strongTopics = data?.strongTopics || [];
  const weeklyData = data?.weeklyData || [
    { day: "Mon", score: 45 }, { day: "Tue", score: 62 }, { day: "Wed", score: 58 },
    { day: "Thu", score: 74 }, { day: "Fri", score: 68 }, { day: "Sat", score: 82 }, { day: "Sun", score: 88 },
  ];
  const maxScore = Math.max(...weeklyData.map(d => d.score), 100);

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
        <div className="bg-[#FEF2F2] text-[#DC2626] text-sm px-5 py-4 rounded-2xl border border-[#DC2626]/10">{error}</div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#171717] mb-1">Analytics</h1>
        <p className="text-sm text-[#737373]">Track your progress and identify areas to improve.</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Readiness", value: `${data?.readiness || 0}%`, icon: Award, color: "#DC2626", bg: "#FEF2F2" },
          { label: "Study Streak", value: `${data?.stats?.studyStreak || 0}d`, icon: Flame, color: "#F59E0B", bg: "#FFFBEB" },
          { label: "Avg Score", value: `${data?.stats?.avgScore || 0}%`, icon: TrendingUp, color: "#10B981", bg: "#ECFDF5" },
          { label: "Sessions", value: `${data?.stats?.totalSessions || 0}`, icon: BookOpen, color: "#8B5CF6", bg: "#F5F3FF" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 border border-[#E5E5E5]">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: s.bg }}>
                <s.icon size={18} style={{ color: s.color }} strokeWidth={1.5} />
              </div>
              <span className="text-xs text-[#737373] font-medium">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-[#171717]">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Weekly Chart */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-[#171717]">Weekly Performance</h3>
            <BarChart3 size={16} className="text-[#A3A3A3]" />
          </div>
          <div className="flex items-end gap-3 h-[160px]">
            {weeklyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <motion.div initial={{ height: 0 }} animate={{ height: `${(d.score / maxScore) * 140}px` }} transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="w-full bg-[#DC2626] rounded-t-lg" style={{ opacity: 0.3 + (i * 0.1) }} />
                <span className="text-[11px] text-[#A3A3A3] font-medium">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Topic Breakdown */}
        <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5]">
          <h3 className="text-sm font-semibold text-[#171717] mb-5">Topic Performance</h3>
          {strongTopics.length > 0 || weakTopics.length > 0 ? (
            <div className="space-y-4">
              {strongTopics.map((t, i) => (
                <div key={`strong-${i}`}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-[#171717]">{t.name}</span>
                    <span className="text-sm font-semibold text-[#10B981]">{t.score}%</span>
                  </div>
                  <div className="h-2 bg-[#F5F5F5] rounded-full">
                    <div className="h-full bg-[#10B981] rounded-full transition-all" style={{ width: `${t.score}%` }} />
                  </div>
                </div>
              ))}
              {weakTopics.map((t, i) => (
                <div key={`weak-${i}`}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-[#171717]">{t.name}</span>
                    <span className="text-sm font-semibold text-[#DC2626]">{t.score}%</span>
                  </div>
                  <div className="h-2 bg-[#F5F5F5] rounded-full">
                    <div className="h-full bg-[#DC2626] rounded-full transition-all" style={{ width: `${t.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Target size={28} className="text-[#A3A3A3] mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-sm text-[#737373]">Complete sessions to see topic breakdowns.</p>
            </div>
          )}
        </div>
      </div>

      {/* Session History */}
      <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden">
        <div className="p-6 border-b border-[#F5F5F5] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-[#171717]">Session History</h3>
          <Calendar size={16} className="text-[#A3A3A3]" />
        </div>
        {sessions.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen size={28} className="text-[#A3A3A3] mx-auto mb-3" strokeWidth={1.5} />
            <p className="text-sm text-[#737373]">No sessions yet. Start studying to see your history.</p>
          </div>
        ) : (
          <div className="divide-y divide-[#F5F5F5]">
            {sessions.map((s, i) => (
              <div key={s.id || i} className="flex items-center justify-between p-5 hover:bg-[#FAFAFA] transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${(s.score || 0) >= 60 ? "bg-[#ECFDF5]" : "bg-[#FEF2F2]"}`}>
                    <span className={`text-sm font-bold ${(s.score || 0) >= 60 ? "text-[#10B981]" : "text-[#DC2626]"}`}>{s.score || 0}%</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#171717]">{s.title || "Study Session"}</p>
                    <p className="text-xs text-[#737373]">{s.type || "Quiz"} {s.date && `\u00B7 ${s.date}`}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-[#A3A3A3]" />
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
