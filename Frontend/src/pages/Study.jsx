import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, RotateCcw, Loader2, Lightbulb, ChevronLeft, ChevronRight, BookOpen, Sparkles, X, BarChart3 } from "lucide-react";
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
            <button
              key={i}
              onClick={() => onNavigate(i)}
              className={`w-full aspect-square rounded-lg text-xs font-semibold transition-all ${
                isCurrent
                  ? "bg-[#DC2626] text-white shadow-lg shadow-[#DC2626]/25 scale-105"
                  : answered
                  ? "bg-[#ECFDF5] text-[#10B981] border border-[#10B981]/30 hover:bg-[#10B981] hover:text-white"
                  : "bg-[#F5F5F5] text-[#A3A3A3] hover:bg-[#E5E5E5] hover:text-[#525252]"
              }`}
            >
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
    correct: "bg-[#ECFDF5] border-[#10B981]",
    wrong: "bg-[#FEF2F2] border-[#EF4444]",
    correctReveal: "bg-[#ECFDF5] border-[#10B981] ring-2 ring-[#10B981]/30",
  };
  const letterStyles = {
    default: "bg-[#F5F5F5] text-[#525252]",
    selected: "bg-[#DC2626] text-white",
    correct: "bg-[#10B981] text-white",
    wrong: "bg-[#EF4444] text-white",
    correctReveal: "bg-[#10B981] text-white",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full flex items-center gap-4 text-left px-5 py-4 rounded-xl border-[1.5px] transition-all ${styles[state]} disabled:opacity-80`}
    >
      <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${letterStyles[state]}`}>
        {label}
      </span>
      <span className="text-[15px] text-[#171717]">{text}</span>
    </button>
  );
}

export default function Study() {
  const [step, setStep] = useState("setup");
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState({});
  const [difficulty, setDifficulty] = useState("medium");
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [explanations, setExplanations] = useState({});
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [userName, setUserName] = useState("");

  useEffect(() => {
    fetchTopics();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const data = await apiFetch("/api/auth/me");
      setUserName(data.name || "");
    } catch { /* ignore */ }
  };

  const fetchTopics = async () => {
    try {
      setLoadingTopics(true);
      const data = await apiFetch("/api/quiz/topics");
      const topicList = data.topics || [];
      setTopics(topicList);
      const preselected = {};
      topicList.slice(0, 3).forEach(t => { preselected[t] = 5; });
      setSelectedTopics(preselected);
    } catch (err) {
      setError(err.message || "Failed to load topics. Upload materials first.");
    } finally {
      setLoadingTopics(false);
    }
  };

  const toggleTopic = (t) => {
    setSelectedTopics((prev) => {
      const next = { ...prev };
      if (next[t]) delete next[t];
      else next[t] = 5;
      return next;
    });
  };

  const changeCount = (topic, count) => setSelectedTopics((prev) => ({ ...prev, [topic]: count }));
  const totalQuestions = Object.values(selectedTopics).reduce((a, b) => a + b, 0);

  const startQuiz = async () => {
    const topicNames = Object.keys(selectedTopics);
    if (topicNames.length === 0) { setError("Select at least one topic."); return; }
    setError("");
    setGenerating(true);
    try {
      const data = await apiFetch("/api/quiz/session", {
        method: "POST",
        body: JSON.stringify({ type: "practice", difficulty, count: totalQuestions, selectedTopics: topicNames }),
      });
      setQuestions(data.questions || []);
      setStep("quiz");
      setCurrent(0);
      setAnswers({});
      setExplanations({});
    } catch (err) {
      setError(err.message || "Failed to generate quiz.");
    } finally {
      setGenerating(false);
    }
  };

  const submitAnswer = async (idx) => {
    if (answers[current] !== undefined) return;
    const q = questions[current];
    setAnswers((p) => ({ ...p, [current]: idx }));
    try {
      const res = await apiFetch("/api/quiz/answer", {
        method: "POST",
        body: JSON.stringify({ questionId: q.id, selectedAnswer: idx, question: q.question, options: q.options, correctAnswer: q.correctAnswer, topic: q.topic }),
      });
      setExplanations((p) => ({ ...p, [current]: res.explanation }));
    } catch {
      const isCorrect = idx === q.correctAnswer;
      setExplanations((p) => ({ ...p, [current]: isCorrect ? "Correct! Well done." : `The correct answer is ${String.fromCharCode(65 + q.correctAnswer)}: ${q.options[q.correctAnswer]}` }));
    }
  };

  const finish = async () => {
    const correct = Object.entries(answers).filter(([i, a]) => a === questions[i]?.correctAnswer).length;
    const pct = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    setResults({ score: pct, correctCount: correct, wrongCount: questions.length - correct, total: questions.length });
    setStep("done");
  };

  const reset = () => {
    setStep("setup");
    setAnswers({});
    setExplanations({});
    setCurrent(0);
    setQuestions([]);
    setResults(null);
  };

  const handleEndClick = () => setShowEndConfirm(true);

  // Get option state for feedback
  const getOptionState = (optIdx) => {
    const q = questions[current];
    const ans = answers[current];
    // Not answered yet: show selected highlight
    if (ans === undefined) return "default";
    // Answered: show correct (green) and wrong (red) immediately
    if (optIdx === q.correctAnswer) return "correctReveal";
    if (optIdx === ans) return "wrong";
    return "default";
  };

  // Results screen
  if (step === "done") {
    const correct = results?.correctCount || 0;
    const msg = results?.score >= 80
      ? `Excellent work${userName ? ", " + userName : ""}! You mastered this material.`
      : results?.score >= 60
      ? `Good job${userName ? ", " + userName : ""}! Keep practicing and you will get there.`
      : `Keep going${userName ? ", " + userName : ""}! Review your weak areas and try again.`;

    return (
      <AppShell>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[720px] mx-auto">
          <div className="text-center mb-10">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5 ${results?.score >= 60 ? "bg-[#ECFDF5]" : "bg-[#FEF2F2]"}`}>
              <BarChart3 size={36} className={results?.score >= 60 ? "text-[#10B981]" : "text-[#DC2626]"} />
            </div>
            <h2 className="text-2xl font-bold text-[#171717] mb-1">Session Complete</h2>
            <p className="text-lg text-[#737373]">You scored <span className="font-bold text-[#DC2626]">{results?.score}%</span></p>
            <p className="text-sm text-[#525252] mt-3 max-w-[480px] mx-auto">{msg}</p>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5] mb-6">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="text-center p-4 bg-[#ECFDF5] rounded-xl">
                <p className="text-2xl font-bold text-[#10B981]">{correct}</p>
                <p className="text-xs text-[#525252]">Correct</p>
              </div>
              <div className="text-center p-4 bg-[#FEF2F2] rounded-xl">
                <p className="text-2xl font-bold text-[#DC2626]">{results?.wrongCount}</p>
                <p className="text-xs text-[#525252]">Wrong</p>
              </div>
              <div className="text-center p-4 bg-[#FAFAFA] rounded-xl">
                <p className="text-2xl font-bold text-[#171717]">{results?.total}</p>
                <p className="text-xs text-[#525252]">Total</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden mb-8">
            <div className="p-4 border-b border-[#F5F5F5]">
              <h3 className="text-sm font-semibold text-[#171717]">Review All Answers</h3>
            </div>
            <div className="divide-y divide-[#F5F5F5]">
              {questions.map((q, i) => {
                const isCorrect = answers[i] === q.correctAnswer;
                return (
                  <button key={i} onClick={() => { setCurrent(i); setStep("review"); }} className="w-full flex items-center gap-4 p-4 hover:bg-[#FAFAFA] transition-all text-left">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${isCorrect ? "bg-[#ECFDF5] text-[#10B981]" : "bg-[#FEF2F2] text-[#DC2626]"}`}>
                      {i + 1}
                    </span>
                    <span className="text-sm text-[#171717] flex-1 truncate">{q.question}</span>
                    <span className={`text-xs font-semibold ${isCorrect ? "text-[#10B981]" : "text-[#DC2626]"}`}>{isCorrect ? "Correct" : "Wrong"}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={reset} className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-[#171717] bg-[#F5F5F5] rounded-full hover:bg-[#E5E5E5] transition-all flex-1">
              <RotateCcw size={16} /> New Session
            </button>
          </div>
        </motion.div>
      </AppShell>
    );
  }

  // Review mode (from results)
  if (step === "review") {
    const q = questions[current];
    return (
      <AppShell>
        <div className="max-w-[720px] mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setStep("done")} className="text-sm text-[#737373] hover:text-[#171717]">&larr; Back to results</button>
            <span className="text-xs text-[#A3A3A3]">Reviewing {current + 1} / {questions.length}</span>
          </div>
          <div className="h-2 bg-[#F5F5F5] rounded-full mb-6">
            <div className="h-full bg-[#DC2626] rounded-full transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
          </div>
          <QuestionGrid total={questions.length} current={current} answers={answers} onNavigate={setCurrent} />
          <div className="mt-6 bg-white rounded-2xl p-6 border border-[#E5E5E5]">
            <p className="text-base font-medium text-[#171717] mb-4">{q.question}</p>
            <div className="space-y-2 mb-4">
              {q.options.map((opt, i) => (
                <OptionButton key={i} label={String.fromCharCode(65 + i)} text={opt} state={getOptionState(i)} disabled />
              ))}
            </div>
            <div className="bg-[#FEF2F2] rounded-xl p-4 border border-[#DC2626]/15">
              <div className="flex items-center gap-2 mb-1">
                <Lightbulb size={16} className="text-[#DC2626]" />
                <span className="text-sm font-semibold text-[#DC2626]">Explanation</span>
              </div>
              <p className="text-sm text-[#525252]">{explanations[current] || `Correct answer: ${String.fromCharCode(65 + q.correctAnswer)}`}</p>
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0} className="px-4 py-2 text-sm text-[#737373] rounded-full hover:bg-[#F5F5F5] disabled:opacity-40">Prev</button>
            <button onClick={() => setCurrent(Math.min(questions.length - 1, current + 1))} disabled={current === questions.length - 1} className="px-4 py-2 text-sm text-[#737373] rounded-full hover:bg-[#F5F5F5] disabled:opacity-40">Next</button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ConfirmDialog
        open={showEndConfirm}
        title="End Practice Session?"
        message={answers[questions.length - 1] !== undefined
          ? "You have answered all questions. Ending now will save your results."
          : `You have answered ${Object.keys(answers).length} of ${questions.length} questions. Are you sure you want to end? Your progress will be saved.`}
        confirmLabel="End Session"
        cancelLabel="Continue"
        danger
        onConfirm={() => { setShowEndConfirm(false); finish(); }}
        onCancel={() => setShowEndConfirm(false)}
      />

      {step === "setup" ? (
        <div className="max-w-[720px] mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#171717] mb-1">Study Session</h1>
            <p className="text-sm text-[#737373]">{userName ? `Ready to learn, ${userName}? ` : ""}Select topics and start practicing.</p>
          </div>

          {error && <div className="bg-[#FEF2F2] text-[#DC2626] text-sm px-5 py-3 rounded-2xl mb-6 border border-[#DC2626]/10">{error}</div>}

          {loadingTopics ? (
            <div className="text-center py-20"><Loader2 size={32} className="text-[#DC2626] animate-spin mx-auto mb-4" /><p className="text-[#737373]">Loading topics...</p></div>
          ) : topics.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E5E5]">
              <BookOpen size={40} className="text-[#A3A3A3] mx-auto mb-4" strokeWidth={1.5} />
              <p className="text-[#171717] font-semibold mb-2">No topics found</p>
              <p className="text-sm text-[#737373]">Upload study materials first.</p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#171717]"><Sparkles size={14} className="inline mr-1.5 text-[#DC2626]" />Detected Topics ({topics.length})</h3>
                  <span className="text-xs text-[#737373]">{Object.keys(selectedTopics).length} selected &middot; {totalQuestions} questions</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {topics.map((t) => (
                    <div key={t} onClick={() => toggleTopic(t)} className={`cursor-pointer rounded-2xl p-5 border transition-all ${selectedTopics[t] ? "bg-[#FEF2F2] border-[#DC2626]/30 shadow-[0_4px_20px_rgba(220,38,38,0.08)]" : "bg-white border-[#E5E5E5] hover:border-[#DC2626]/15"}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center ${selectedTopics[t] ? "bg-[#DC2626]" : "bg-[#F5F5F5]"}`}>
                          {selectedTopics[t] && <svg width="12" height="12" viewBox="0 0 12 12"><path d="M2 6L5 9L10 3" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                        </div>
                        <span className={`text-sm font-semibold ${selectedTopics[t] ? "text-[#DC2626]" : "text-[#171717]"}`}>{t}</span>
                      </div>
                      {selectedTopics[t] && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 pl-9">
                          <span className="text-xs text-[#737373]">Questions:</span>
                          <div className="flex items-center gap-1">
                            <button onClick={(e) => { e.stopPropagation(); changeCount(t, Math.max(1, selectedTopics[t] - 1)); }} className="w-6 h-6 rounded-full bg-white border border-[#E5E5E5] text-xs font-bold text-[#525252] hover:bg-[#DC2626] hover:text-white">-</button>
                            <span className="text-sm font-semibold w-5 text-center">{selectedTopics[t]}</span>
                            <button onClick={(e) => { e.stopPropagation(); changeCount(t, Math.min(30, selectedTopics[t] + 1)); }} className="w-6 h-6 rounded-full bg-white border border-[#E5E5E5] text-xs font-bold text-[#525252] hover:bg-[#DC2626] hover:text-white">+</button>
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5] mb-6">
                <h3 className="text-sm font-semibold text-[#171717] mb-4">Difficulty</h3>
                <div className="flex gap-3">
                  {["easy", "medium", "hard"].map((d) => (
                    <button key={d} onClick={() => setDifficulty(d)} className={`flex-1 py-3 rounded-full text-sm font-medium capitalize transition-all ${difficulty === d ? "bg-[#DC2626] text-white shadow-lg shadow-[#DC2626]/20" : "bg-[#F5F5F5] text-[#525252] hover:bg-[#E5E5E5]"}`}>{d}</button>
                  ))}
                </div>
              </div>

              <div className="bg-[#0A0A0A] rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex gap-8">
                    <div><p className="text-xs text-[#737373]">Questions</p><p className="text-2xl font-bold text-white">{totalQuestions}</p></div>
                    <div><p className="text-xs text-[#737373]">Topics</p><p className="text-2xl font-bold text-white">{Object.keys(selectedTopics).length}</p></div>
                  </div>
                  <button onClick={startQuiz} disabled={totalQuestions === 0 || generating} className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#DC2626] rounded-full hover:bg-[#B91C1C] transition-all disabled:opacity-50">
                    {generating ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : <>Start <ArrowRight size={16} /></>}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="max-w-[720px] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-xs text-[#A3A3A3]">{questions[current]?.topic || "General"}</p>
            </div>
            <button onClick={handleEndClick} className="text-xs text-[#DC2626] font-medium px-3 py-1.5 rounded-full bg-[#FEF2F2] hover:bg-[#FEE2E2] transition-all">End Session</button>
          </div>

          <div className="h-2 bg-[#F5F5F5] rounded-full mb-5">
            <div className="h-full bg-[#DC2626] rounded-full transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
          </div>

          <div className="grid lg:grid-cols-[1fr_200px] gap-5">
            {/* Question area */}
            <div>
              <AnimatePresence mode="wait">
                <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5] mb-4">
                    <p className="text-sm text-[#A3A3A3] mb-2">Question {current + 1} of {questions.length}</p>
                    <p className="text-base font-medium text-[#171717] mb-5 leading-relaxed">{questions[current]?.question}</p>
                    <div className="space-y-2">
                      {questions[current]?.options?.map((opt, i) => (
                        <OptionButton key={i} label={String.fromCharCode(65 + i)} text={opt} state={getOptionState(i)} onClick={() => submitAnswer(i)} disabled={answers[current] !== undefined} />
                      ))}
                    </div>
                  </div>

                  {explanations[current] && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#FEF2F2] rounded-2xl p-5 border border-[#DC2626]/15 mb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb size={16} className="text-[#DC2626]" />
                        <span className="text-sm font-semibold text-[#DC2626]">Explanation</span>
                      </div>
                      <p className="text-sm text-[#525252] leading-relaxed">{explanations[current]}</p>
                    </motion.div>
                  )}

                  <div className="flex justify-between">
                    <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0} className="inline-flex items-center gap-1 px-4 py-2 text-sm font-medium text-[#737373] rounded-full hover:bg-[#F5F5F5] disabled:opacity-40">
                      <ChevronLeft size={16} /> Prev
                    </button>
                    {current < questions.length - 1 ? (
                      <button onClick={() => setCurrent(current + 1)} className="inline-flex items-center gap-1 px-5 py-2.5 text-sm font-semibold text-white bg-[#DC2626] rounded-full hover:bg-[#B91C1C]">
                        Next <ChevronRight size={16} />
                      </button>
                    ) : (
                      <button onClick={handleEndClick} className="inline-flex items-center gap-1 px-5 py-2.5 text-sm font-semibold text-white bg-[#DC2626] rounded-full hover:bg-[#B91C1C]">
                        Finish <ArrowRight size={16} />
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Question Grid Sidebar */}
            <div className="hidden lg:block">
              <QuestionGrid total={questions.length} current={current} answers={answers} onNavigate={setCurrent} />
            </div>
          </div>

          {/* Mobile question grid */}
          <div className="lg:hidden mt-5">
            <QuestionGrid total={questions.length} current={current} answers={answers} onNavigate={setCurrent} />
          </div>
        </div>
      )}
    </AppShell>
  );
}
