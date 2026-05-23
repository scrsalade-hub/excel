import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowRight, Check, RotateCcw, Zap, AlertTriangle, Loader2, ChevronLeft, ChevronRight, BookOpen } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";

export default function Exam() {
  const [phase, setPhase] = useState("setup");
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [duration, setDuration] = useState(60);
  const [questionCount, setQuestionCount] = useState(60);
  const [maxQuestions, setMaxQuestions] = useState(60);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const timerRef = useRef(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      const data = await apiFetch("/api/quiz/topics");
      const t = data.topics || [];
      setTopics(t);
      setSelectedTopics(t);
      const maxQ = Math.max(60, data.totalMaxQuestions || 60);
      setMaxQuestions(maxQ);
      setQuestionCount(Math.min(60, maxQ));
    } catch {
      setError("Upload study materials first to take a mock exam.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (phase !== "exam") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((p) => {
        if (p <= 1) { finishExam(); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const startExam = async () => {
    if (selectedTopics.length === 0) { setError("Select at least one topic."); return; }
    setError("");
    setGenerating(true);
    try {
      const data = await apiFetch("/api/quiz/session", {
        method: "POST",
        body: JSON.stringify({
          type: "exam_simulation",
          difficulty: "hard",
          count: questionCount,
          selectedTopics,
          title: "Mock Exam",
        }),
      });
      setSession(data.session);
      setQuestions(data.questions || []);
      setPhase("exam");
      setCurrent(0);
      setAnswers({});
      setTimeLeft(duration * 60);
    } catch (err) {
      setError(err.message || "Failed to generate exam.");
    } finally {
      setGenerating(false);
    }
  };

  const pick = (i) => {
    if (answers[current] !== undefined) return;
    setAnswers((p) => ({ ...p, [current]: i }));
  };

  const finishExam = async () => {
    clearInterval(timerRef.current);
    try {
      const res = await apiFetch("/api/quiz/complete", {
        method: "POST",
        body: JSON.stringify({ sessionId: session.id, duration: duration * 60 - timeLeft }),
      });
      setResults(res.session);
    } catch {
      const correct = Object.entries(answers).filter(([i, a]) => a === questions[i]?.correctAnswer).length;
      setResults({ score: Math.round((correct / questions.length) * 100), correctCount: correct, wrongCount: questions.length - correct });
    }
    setPhase("done");
  };

  const reset = () => {
    setPhase("setup");
    setAnswers({});
    setCurrent(0);
    setQuestions([]);
    setSession(null);
    setResults(null);
    setTimeLeft(duration * 60);
  };

  if (phase === "done") {
    return (
      <AppShell>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[640px] mx-auto text-center py-12">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${results?.score >= 60 ? "bg-[#ECFDF5]" : "bg-[#FEF2F2]"}`}>
            {results?.score >= 60 ? <Check size={36} className="text-[#10B981]" /> : <AlertTriangle size={36} className="text-[#DC2626]" />}
          </div>
          <h2 className="text-3xl font-bold text-[#171717] mb-2">Exam Complete</h2>
          <p className="text-lg text-[#737373] mb-6">You scored <span className="font-bold text-[#DC2626]">{results?.score || 0}%</span></p>
          {results?.aiFeedback && <p className="text-sm text-[#525252] mb-8 max-w-[480px] mx-auto">{results.aiFeedback}</p>}
          <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5] mb-8 text-left">
            <h3 className="text-sm font-semibold text-[#171717] mb-4">Results</h3>
            <div className="space-y-3">
              {questions.map((q, i) => {
                const isCorrect = answers[i] === q.correctAnswer;
                return (
                  <div key={i} className={`flex items-center justify-between p-3 rounded-xl ${isCorrect ? "bg-[#ECFDF5]" : "bg-[#FEF2F2]"}`}>
                    <span className="text-sm text-[#171717] truncate pr-4">{i + 1}. {q.question}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${isCorrect ? "text-[#10B981] bg-white" : "text-[#DC2626] bg-white"}`}>{isCorrect ? "Correct" : "Wrong"}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <button onClick={reset} className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[14px] font-medium text-[#171717] bg-[#F5F5F5] rounded-full hover:bg-[#E5E5E5] transition-all"><RotateCcw size={16} /> Retake</button>
        </motion.div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {phase === "setup" ? (
        <div className="max-w-[640px] mx-auto">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#FEF2F2] rounded-xl flex items-center justify-center">
                <Zap size={20} className="text-[#DC2626]" strokeWidth={1.5} />
              </div>
              <h1 className="text-3xl font-bold text-[#171717]">Mock Exam</h1>
            </div>
            <p className="text-[#737373]">Simulate real exam conditions. Minimum 60 questions.</p>
          </div>

          {error && (
            <div className="bg-[#FEF2F2] text-[#DC2626] text-sm px-5 py-3.5 rounded-2xl mb-6 border border-[#DC2626]/10 flex items-center justify-between">
              {error}
              <button onClick={() => setError("")} className="p-1"><RotateCcw size={14} onClick={fetchTopics} /></button>
            </div>
          )}

          {loading ? (
            <div className="text-center py-16">
              <Loader2 size={28} className="text-[#DC2626] animate-spin mx-auto mb-3" />
              <p className="text-sm text-[#737373]">Loading your materials...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Topics */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5]">
                <h3 className="text-sm font-semibold text-[#171717] mb-4">Exam Topics ({topics.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {topics.map((t) => (
                    <button key={t} onClick={() => setSelectedTopics((p) => p.includes(t) ? p.filter(x => x !== t) : [...p, t])}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTopics.includes(t) ? "bg-[#DC2626] text-white" : "bg-[#F5F5F5] text-[#525252] hover:bg-[#E5E5E5]"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5]">
                <h3 className="text-sm font-semibold text-[#171717] mb-4">Duration: {duration} minutes</h3>
                <input type="range" min={30} max={180} step={5} value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full accent-[#DC2626]" />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-[#A3A3A3]">30m</span>
                  <span className="text-xs text-[#A3A3A3]">180m</span>
                </div>
              </div>

              {/* Question count */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#171717]">Number of Questions</h3>
                  <span className="text-xs text-[#DC2626] font-semibold">min: 60 | max: {maxQuestions}</span>
                </div>
                <input type="range" min={60} max={maxQuestions} step={5} value={questionCount}
                  onChange={(e) => setQuestionCount(Number(e.target.value))}
                  className="w-full accent-[#DC2626]" />
                <div className="flex justify-between mt-2">
                  <span className="text-xs text-[#A3A3A3]">60</span>
                  <span className="text-sm font-bold text-[#DC2626]">{questionCount} questions</span>
                  <span className="text-xs text-[#A3A3A3]">{maxQuestions}</span>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-[#0A0A0A] rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex gap-8">
                    <div><p className="text-xs text-[#737373]">Questions</p><p className="text-xl font-bold text-white">{questionCount}</p></div>
                    <div><p className="text-xs text-[#737373]">Duration</p><p className="text-xl font-bold text-white">{duration}m</p></div>
                    <div><p className="text-xs text-[#737373]">Topics</p><p className="text-xl font-bold text-white">{selectedTopics.length}</p></div>
                  </div>
                  <button onClick={startExam} disabled={generating || selectedTopics.length === 0}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[14px] font-semibold text-white bg-[#DC2626] rounded-full hover:bg-[#B91C1C] hover:shadow-[0_8px_24px_rgba(220,38,38,0.3)] transition-all disabled:opacity-50">
                    {generating ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : <>Start Exam <ArrowRight size={16} /></>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-[720px] mx-auto">
          {/* Header with timer */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#171717]">Question {current + 1} <span className="text-[#A3A3A3] font-normal">/ {questions.length}</span></h2>
              <p className="text-xs text-[#737373]">{questions[current]?.topic}</p>
            </div>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${timeLeft < 300 ? "bg-[#FEF2F2]" : "bg-[#F5F5F5]"}`}>
              <Clock size={16} className={timeLeft < 300 ? "text-[#DC2626]" : "text-[#737373]"} />
              <span className={`text-sm font-semibold tabular-nums ${timeLeft < 300 ? "text-[#DC2626]" : "text-[#171717]"}`}>{fmt(timeLeft)}</span>
            </div>
          </div>

          {/* Progress */}
          <div className="h-2 bg-[#F5F5F5] rounded-full mb-8">
            <div className="h-full bg-[#DC2626] rounded-full transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5] mb-6">
                <p className="text-base font-medium text-[#171717] mb-6 leading-relaxed">{questions[current]?.question}</p>
                <div className="space-y-3">
                  {questions[current]?.options?.map((opt, i) => (
                    <button key={i} onClick={() => pick(i)}
                      className={`w-full flex items-center gap-4 text-left px-5 py-4 rounded-xl border-[1.5px] transition-all ${answers[current] === i ? "bg-[#FEF2F2] border-[#DC2626]" : "bg-white border-[#E5E5E5] hover:border-[#DC2626]/40 hover:bg-[#FEF2F2]/30"}`}>
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${answers[current] === i ? "bg-[#DC2626] text-white" : "bg-[#F5F5F5] text-[#525252]"}`}>
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span className="text-[15px] text-[#171717]">{opt}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[#737373] rounded-full hover:bg-[#F5F5F5] transition-all disabled:opacity-40">
                  <ChevronLeft size={16} /> Prev
                </button>
                {current < questions.length - 1 ? (
                  <button onClick={() => setCurrent(current + 1)}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#DC2626] rounded-full hover:bg-[#B91C1C] hover:shadow-[0_8px_24px_rgba(220,38,38,0.25)] transition-all">
                    Next <ChevronRight size={16} />
                  </button>
                ) : (
                  <button onClick={finishExam}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#DC2626] rounded-full hover:bg-[#B91C1C] hover:shadow-[0_8px_24px_rgba(220,38,38,0.25)] transition-all">
                    Submit Exam <Check size={16} />
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </AppShell>
  );
}
