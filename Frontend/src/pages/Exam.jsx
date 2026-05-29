import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, ArrowRight, Check, RotateCcw, Zap, AlertTriangle, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { apiFetch } from "@/lib/api";

function QuestionGrid({ total, current, answers, onNavigate }) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E5E5E5]">
      <p className="text-xs font-semibold text-[#171717] uppercase tracking-wider mb-4">Questions</p>
      <div className="grid grid-cols-5 gap-2">
        {Array.from({ length: total }, (_, i) => {
          const answered = answers[i] !== undefined;
          const isCurrent = i === current;
          return (
            <button key={i} onClick={() => onNavigate(i)}
              className={`w-full aspect-square rounded-lg text-xs font-semibold transition-all ${
                isCurrent ? "bg-[#DC2626] text-white shadow-lg shadow-[#DC2626]/25 scale-105"
                : answered ? "bg-[#ECFDF5] text-[#10B981] border border-[#10B981]/30 hover:bg-[#10B981] hover:text-white"
                : "bg-[#F5F5F5] text-[#A3A3A3] hover:bg-[#E5E5E5] hover:text-[#525252]"
              }`}>
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function OptionButton({ label, text, state, onClick, disabled }) {
  const styles = {
    default: "bg-white border-[#E5E5E5] hover:border-[#DC2626]/40 hover:bg-[#FEF2F2]/30",
    selected: "bg-[#FEF2F2] border-[#DC2626]",
    correct: "bg-[#ECFDF5] border-[#10B981] ring-2 ring-[#10B981]/30",
    wrong: "bg-[#FEF2F2] border-[#EF4444]",
  };
  const letterStyles = {
    default: "bg-[#F5F5F5] text-[#525252]",
    selected: "bg-[#DC2626] text-white",
    correct: "bg-[#10B981] text-white",
    wrong: "bg-[#EF4444] text-white",
  };
  return (
    <button onClick={onClick} disabled={disabled}
      className={`w-full flex items-center gap-4 text-left px-5 py-4 rounded-xl border-[1.5px] transition-all ${styles[state]} disabled:opacity-80`}>
      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${letterStyles[state]}`}>{label}</span>
      <span className="text-[15px] text-[#171717]">{text}</span>
    </button>
  );
}

export default function Exam() {
  const [phase, setPhase] = useState("setup");
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [duration, setDuration] = useState(60);
  const [questionCount, setQuestionCount] = useState(60);
  const [maxQuestions, setMaxQuestions] = useState(60);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [results, setResults] = useState(null);
  const [error, setError] = useState("");
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [userName, setUserName] = useState("");
  const timerRef = useRef(null);

  useEffect(() => { fetchTopics(); fetchUser(); }, []);

  const fetchUser = async () => {
    try { const data = await apiFetch("/api/auth/me"); setUserName(data.name || ""); } catch { }
  };

  const fetchTopics = async () => {
    try {
      const data = await apiFetch("/api/quiz/topics");
      const t = data.topics || [];
      setTopics(t);
      setSelectedTopics(t);
      const maxQ = Math.max(60, data.totalMaxQuestions || 60);
      setMaxQuestions(maxQ);
      setQuestionCount(Math.min(60, maxQ));
    } catch { setError("Upload study materials first to take a mock exam."); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    if (phase !== "exam") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((p) => { if (p <= 1) { handleTimeUp(); return 0; } return p - 1; });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [phase]);

  const fmt = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;

  const startExam = async () => {
    if (selectedTopics.length === 0) { setError("Select at least one topic."); return; }
    setError(""); setGenerating(true);
    try {
      const data = await apiFetch("/api/quiz/session", {
        method: "POST",
        body: JSON.stringify({ type: "exam_simulation", difficulty: "hard", count: questionCount, selectedTopics }),
      });
      setQuestions(data.questions || []);
      setPhase("exam");
      setCurrent(0);
      setAnswers({});
      setTimeLeft(duration * 60);
    } catch (err) { setError(err.message || "Failed to generate exam."); }
    finally { setGenerating(false); }
  };

  const handleTimeUp = useCallback(() => {
    clearInterval(timerRef.current);
    finishExam();
  }, []);

  const pick = (i) => { if (answers[current] !== undefined) return; setAnswers((p) => ({ ...p, [current]: i })); };

  const finishExam = async () => {
    clearInterval(timerRef.current);
    const correct = Object.entries(answers).filter(([i, a]) => a === questions[i]?.correctAnswer).length;
    const pct = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    setResults({ score: pct, correctCount: correct, wrongCount: questions.length - correct, total: questions.length, timeUsed: duration * 60 - timeLeft });
    setPhase("done");
  };

  const reset = () => {
    setPhase("setup"); setAnswers({}); setCurrent(0); setQuestions([]); setResults(null);
    setTimeLeft(duration * 60); setShowSubmitConfirm(false);
  };

  const getOptionState = (optIdx) => {
    if (phase === "exam") return answers[current] === optIdx ? "selected" : "default";
    const q = questions[current];
    const ans = answers[current];
    if (optIdx === q.correctAnswer) return "correct";
    if (optIdx === ans && ans !== q.correctAnswer) return "wrong";
    return "default";
  };

  if (phase === "done") {
    const msg = results?.score >= 70
      ? `Strong performance${userName ? ", " + userName : ""}! You are exam-ready.`
      : results?.score >= 50
      ? `Keep pushing${userName ? ", " + userName : ""}! Review the weak spots and try again.`
      : `Do not give up${userName ? ", " + userName : ""}! Focus on understanding the material better.`;

    return (
      <AppShell>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[720px] mx-auto">
          <div className="text-center mb-10">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${results?.score >= 60 ? "bg-[#ECFDF5]" : "bg-[#FEF2F2]"}`}>
              {results?.score >= 60 ? <Check size={36} className="text-[#10B981]" /> : <AlertTriangle size={36} className="text-[#DC2626]" />}
            </div>
            <h2 className="text-2xl font-bold text-[#171717] mb-1">Exam Complete</h2>
            <p className="text-lg text-[#737373]">You scored <span className="font-bold text-[#DC2626]">{results?.score}%</span></p>
            <p className="text-sm text-[#525252] mt-3 max-w-[480px] mx-auto">{msg}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5] mb-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-[#ECFDF5] rounded-xl">
                <p className="text-2xl font-bold text-[#10B981]">{results?.correctCount}</p><p className="text-xs text-[#525252]">Correct</p>
              </div>
              <div className="text-center p-4 bg-[#FEF2F2] rounded-xl">
                <p className="text-2xl font-bold text-[#DC2626]">{results?.wrongCount}</p><p className="text-xs text-[#525252]">Wrong</p>
              </div>
              <div className="text-center p-4 bg-[#FAFAFA] rounded-xl">
                <p className="text-2xl font-bold text-[#171717]">{results?.total}</p><p className="text-xs text-[#525252]">Questions</p>
              </div>
            </div>
            <div className="text-center pt-4 border-t border-[#F5F5F5]">
              <p className="text-xs text-[#A3A3A3]">Time used: {fmt(results?.timeUsed || 0)}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden mb-8">
            <div className="p-4 border-b border-[#F5F5F5]"><h3 className="text-sm font-semibold text-[#171717]">Answer Review</h3></div>
            <div className="divide-y divide-[#F5F5F5]">
              {questions.map((q, i) => {
                const isCorrect = answers[i] === q.correctAnswer;
                return (
                  <div key={i} className="flex items-center gap-4 p-4">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${isCorrect ? "bg-[#ECFDF5] text-[#10B981]" : "bg-[#FEF2F2] text-[#DC2626]"}`}>{i + 1}</span>
                    <span className="text-sm text-[#171717] flex-1 truncate">{q.question}</span>
                    <span className={`text-xs font-semibold ${isCorrect ? "text-[#10B981]" : "text-[#DC2626]"}`}>{isCorrect ? "Correct" : answers[i] !== undefined ? "Wrong" : "Unanswered"}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button onClick={reset} className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-[#171717] bg-[#F5F5F5] rounded-full hover:bg-[#E5E5E5] transition-all">
            <RotateCcw size={16} /> Retake Exam
          </button>
        </motion.div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ConfirmDialog open={showSubmitConfirm} title="Submit Exam?"
        message={`You have answered ${Object.keys(answers).length} of ${questions.length} questions. Once submitted, you cannot change your answers.`}
        confirmLabel="Submit" cancelLabel="Keep Working" danger
        onConfirm={() => { setShowSubmitConfirm(false); finishExam(); }}
        onCancel={() => setShowSubmitConfirm(false)} />

      {phase === "setup" ? (
        <div className="max-w-[640px] mx-auto">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-[#FEF2F2] rounded-xl flex items-center justify-center"><Zap size={20} className="text-[#DC2626]" strokeWidth={1.5} /></div>
              <h1 className="text-2xl font-bold text-[#171717]">Mock Exam</h1>
            </div>
            <p className="text-sm text-[#737373]">Simulate real exam conditions. Minimum 60 questions.</p>
          </div>

          {error && <div className="bg-[#FEF2F2] text-[#DC2626] text-sm px-5 py-3 rounded-2xl mb-6 border border-[#DC2626]/10">{error}</div>}

          {loading ? (
            <div className="text-center py-16"><Loader2 size={28} className="text-[#DC2626] animate-spin mx-auto mb-3" /><p className="text-sm text-[#737373]">Loading materials...</p></div>
          ) : (
            <div className="space-y-5">
              <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5]">
                <h3 className="text-sm font-semibold text-[#171717] mb-4">Topics ({topics.length})</h3>
                <div className="flex flex-wrap gap-2">
                  {topics.map((t) => (
                    <button key={t} onClick={() => setSelectedTopics((p) => p.includes(t) ? p.filter(x => x !== t) : [...p, t])}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedTopics.includes(t) ? "bg-[#DC2626] text-white" : "bg-[#F5F5F5] text-[#525252] hover:bg-[#E5E5E5]"}`}>{t}</button>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5]">
                <h3 className="text-sm font-semibold text-[#171717] mb-4">Duration: {duration} minutes</h3>
                <input type="range" min={30} max={180} step={5} value={duration} onChange={(e) => setDuration(Number(e.target.value))} className="w-full accent-[#DC2626]" />
                <div className="flex justify-between mt-2"><span className="text-xs text-[#A3A3A3]">30m</span><span className="text-xs text-[#A3A3A3]">180m</span></div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5]">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#171717]">Number of Questions</h3>
                  <span className="text-xs text-[#DC2626] font-semibold">min: 60 | max: {maxQuestions}</span>
                </div>
                <input type="range" min={60} max={maxQuestions} step={5} value={questionCount} onChange={(e) => setQuestionCount(Number(e.target.value))} className="w-full accent-[#DC2626]" />
                <div className="flex justify-between mt-2"><span className="text-xs text-[#A3A3A3]">60</span><span className="text-sm font-bold text-[#DC2626]">{questionCount}</span><span className="text-xs text-[#A3A3A3]">{maxQuestions}</span></div>
              </div>

              <div className="bg-[#0A0A0A] rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex gap-8">
                    <div><p className="text-xs text-[#737373]">Questions</p><p className="text-xl font-bold text-white">{questionCount}</p></div>
                    <div><p className="text-xs text-[#737373]">Duration</p><p className="text-xl font-bold text-white">{duration}m</p></div>
                  </div>
                  <button onClick={startExam} disabled={generating || selectedTopics.length === 0}
                    className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#DC2626] rounded-full hover:bg-[#B91C1C] transition-all disabled:opacity-50">
                    {generating ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : <>Start Exam <ArrowRight size={16} /></>}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-[720px] mx-auto">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-[#A3A3A3]">{questions[current]?.topic}</p>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${timeLeft < 300 ? "bg-[#FEF2F2]" : "bg-[#F5F5F5]"}`}>
                <Clock size={14} className={timeLeft < 300 ? "text-[#DC2626]" : "text-[#737373]"} />
                <span className={`text-sm font-semibold tabular-nums ${timeLeft < 300 ? "text-[#DC2626]" : "text-[#171717]"}`}>{fmt(timeLeft)}</span>
              </div>
            </div>
          </div>

          <div className="h-2 bg-[#F5F5F5] rounded-full mb-5">
            <div className="h-full bg-[#DC2626] rounded-full transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
          </div>

          <div className="grid lg:grid-cols-[1fr_200px] gap-5">
            <div>
              <AnimatePresence mode="wait">
                <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5] mb-4">
                    <p className="text-sm text-[#A3A3A3] mb-2">Question {current + 1} of {questions.length}</p>
                    <p className="text-base font-medium text-[#171717] mb-5 leading-relaxed">{questions[current]?.question}</p>
                    <div className="space-y-2">
                      {questions[current]?.options?.map((opt, i) => (
                        <OptionButton key={i} label={String.fromCharCode(65 + i)} text={opt} state={getOptionState(i)} onClick={() => pick(i)} disabled={answers[current] !== undefined} />
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0} className="px-4 py-2 text-sm text-[#737373] rounded-full hover:bg-[#F5F5F5] disabled:opacity-40">Prev</button>
                    {current < questions.length - 1 ? (
                      <button onClick={() => setCurrent(current + 1)} className="inline-flex items-center gap-1 px-5 py-2.5 text-sm font-semibold text-white bg-[#DC2626] rounded-full hover:bg-[#B91C1C]">Next <ChevronRight size={16} /></button>
                    ) : (
                      <button onClick={() => setShowSubmitConfirm(true)} className="inline-flex items-center gap-1 px-5 py-2.5 text-sm font-semibold text-white bg-[#DC2626] rounded-full hover:bg-[#B91C1C]">Submit Exam <Check size={16} /></button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="hidden lg:block space-y-4">
              <QuestionGrid total={questions.length} current={current} answers={answers} onNavigate={setCurrent} />
              <button onClick={() => setShowSubmitConfirm(true)} className="w-full py-3 text-sm font-semibold text-[#DC2626] bg-[#FEF2F2] rounded-xl hover:bg-[#FEE2E2] transition-all">Submit Early</button>
            </div>
          </div>

          <div className="lg:hidden mt-5 space-y-3">
            <QuestionGrid total={questions.length} current={current} answers={answers} onNavigate={setCurrent} />
            <button onClick={() => setShowSubmitConfirm(true)} className="w-full py-3 text-sm font-semibold text-[#DC2626] bg-[#FEF2F2] rounded-xl hover:bg-[#FEE2E2] transition-all">Submit Exam</button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
