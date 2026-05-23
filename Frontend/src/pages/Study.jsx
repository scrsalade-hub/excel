import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, ArrowRight, RotateCcw, Loader2, Lightbulb, ChevronLeft, ChevronRight, BookOpen, Hash, Brain, Sparkles } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";
import { useSearchParams } from "react-router-dom";

function TopicCard({ topic, selected, questions, onToggle, onChangeCount }) {
  return (
    <div onClick={() => onToggle(topic)} className={`relative rounded-2xl p-5 cursor-pointer transition-all border ${selected ? "bg-[#FEF2F2] border-[#DC2626]/30 shadow-[0_4px_20px_rgba(220,38,38,0.08)]" : "bg-white border-[#E5E5E5] hover:border-[#DC2626]/15 hover:shadow-md"}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${selected ? "bg-[#DC2626]" : "bg-[#F5F5F5]"}`}>
            {selected ? <Check size={14} className="text-white" /> : <Brain size={14} className="text-[#A3A3A3]" />}
          </div>
          <span className={`text-sm font-semibold ${selected ? "text-[#DC2626]" : "text-[#171717]"}`}>{topic}</span>
        </div>
      </div>
      {selected && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="pt-2">
          <div className="flex items-center gap-3">
            <label className="text-xs text-[#737373] whitespace-nowrap">Questions:</label>
            <div className="flex items-center gap-2">
              <button onClick={(e) => { e.stopPropagation(); onChangeCount(Math.max(1, questions - 1)); }} className="w-7 h-7 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center text-[#525252] hover:bg-[#DC2626] hover:text-white hover:border-[#DC2626] transition-all text-xs font-bold">-</button>
              <span className="text-sm font-semibold text-[#171717] w-6 text-center">{questions}</span>
              <button onClick={(e) => { e.stopPropagation(); onChangeCount(Math.min(30, questions + 1)); }} className="w-7 h-7 rounded-full bg-white border border-[#E5E5E5] flex items-center justify-center text-[#525252] hover:bg-[#DC2626] hover:text-white hover:border-[#DC2626] transition-all text-xs font-bold">+</button>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default function Study() {
  const [searchParams] = useSearchParams();
  const fromUpload = searchParams.get("from") === "upload";

  const [step, setStep] = useState("setup");
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState({});
  const [difficulty, setDifficulty] = useState("medium");
  const [loadingTopics, setLoadingTopics] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [session, setSession] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [explanations, setExplanations] = useState({});
  const [error, setError] = useState("");
  const [results, setResults] = useState(null);

  useEffect(() => {
    fetchTopics();
  }, []);

  const fetchTopics = async () => {
    try {
      setLoadingTopics(true);
      const data = await apiFetch("/api/quiz/topics");
      const topicList = data.topics || [];
      setTopics(topicList);
      // Pre-select first 3 topics with 5 questions each
      const preselected = {};
      topicList.slice(0, 3).forEach(t => { preselected[t] = 5; });
      setSelectedTopics(preselected);
      if (data.defaultDifficulty) setDifficulty(data.defaultDifficulty);
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

  const changeCount = (topic, count) => {
    setSelectedTopics((prev) => ({ ...prev, [topic]: count }));
  };

  const totalQuestions = Object.values(selectedTopics).reduce((a, b) => a + b, 0);

  const startQuiz = async () => {
    const topicNames = Object.keys(selectedTopics);
    if (topicNames.length === 0) { setError("Select at least one topic."); return; }
    setError("");
    setGenerating(true);
    try {
      const data = await apiFetch("/api/quiz/session", {
        method: "POST",
        body: JSON.stringify({
          type: "practice",
          difficulty,
          count: totalQuestions,
          selectedTopics: topicNames,
          title: `${topicNames[0]} Quiz`,
        }),
      });
      setSession(data.session);
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

    // Call backend to submit and get explanation
    try {
      const res = await apiFetch("/api/quiz/answer", {
        method: "POST",
        body: JSON.stringify({
          sessionId: session.id,
          questionId: q.id,
          selectedAnswer: idx,
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer,
          topic: q.topic,
        }),
      });
      setExplanations((p) => ({ ...p, [current]: res.explanation }));
    } catch {
      const isCorrect = idx === q.correctAnswer;
      setExplanations((p) => ({ ...p, [current]: isCorrect ? "Correct! Well done." : `The correct answer is: ${q.options[q.correctAnswer]}` }));
    }
  };

  const finish = async () => {
    try {
      const res = await apiFetch("/api/quiz/complete", {
        method: "POST",
        body: JSON.stringify({ sessionId: session.id }),
      });
      setResults(res.session);
    } catch {
      const correct = Object.entries(answers).filter(([i, a]) => a === questions[i]?.correctAnswer).length;
      setResults({ score: Math.round((correct / questions.length) * 100), correctCount: correct, wrongCount: questions.length - correct });
    }
    setStep("done");
  };

  const reset = () => {
    setStep("setup");
    setAnswers({});
    setExplanations({});
    setCurrent(0);
    setQuestions([]);
    setSession(null);
    setResults(null);
  };

  const correctCount = results ? results.correctCount : Object.entries(answers).filter(([i, a]) => a === questions[i]?.correctAnswer).length;

  if (step === "done") {
    return (
      <AppShell>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-[640px] mx-auto text-center py-12">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${results?.score >= 60 ? "bg-[#ECFDF5]" : "bg-[#FEF2F2]"}`}>
            {results?.score >= 60 ? <Check size={36} className="text-[#10B981]" /> : <X size={36} className="text-[#DC2626]" />}
          </div>
          <h2 className="text-3xl font-bold text-[#171717] mb-2">Session Complete</h2>
          <p className="text-lg text-[#737373] mb-2">You scored <span className="font-bold text-[#DC2626]">{results?.score || 0}%</span></p>
          {results?.aiFeedback && <p className="text-sm text-[#525252] mb-8 max-w-[480px] mx-auto">{results.aiFeedback}</p>}
          <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5] mb-8 text-left">
            <h3 className="text-sm font-semibold text-[#171717] mb-4">Review</h3>
            <div className="space-y-3">
              {questions.map((q, i) => {
                const ans = answers[i];
                const isCorrect = ans === q.correctAnswer;
                return (
                  <div key={i} className={`flex items-center gap-3 p-3 rounded-xl ${isCorrect ? "bg-[#ECFDF5]" : "bg-[#FEF2F2]"}`}>
                    {isCorrect ? <Check size={16} className="text-[#10B981] flex-shrink-0" /> : <X size={16} className="text-[#DC2626] flex-shrink-0" />}
                    <span className="text-sm text-[#171717]">{q.question}</span>
                  </div>
                );
              })}
            </div>
          </div>
          <button onClick={reset} className="inline-flex items-center justify-center gap-2 px-6 py-3 text-[14px] font-medium text-[#171717] bg-[#F5F5F5] rounded-full hover:bg-[#E5E5E5] transition-all">
            <RotateCcw size={16} /> New Session
          </button>
        </motion.div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      {step === "setup" ? (
        <div className="max-w-[720px] mx-auto">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-[#171717] mb-3">
              {fromUpload ? "Your Material is Ready" : "Study Session"}
            </h1>
            <p className="text-[#737373]">
              {fromUpload
                ? "AI analyzed your upload. Select topics and adjust question counts below."
                : "Select topics from your materials and configure your quiz."}
            </p>
          </div>

          {error && (
            <div className="bg-[#FEF2F2] text-[#DC2626] text-sm px-5 py-3.5 rounded-2xl mb-6 border border-[#DC2626]/10 flex items-center justify-between">
              {error}
              <button onClick={() => setError("")} className="p-1 hover:bg-[#DC2626]/10 rounded-lg"><X size={16} /></button>
            </div>
          )}

          {loadingTopics ? (
            <div className="text-center py-20">
              <Loader2 size={32} className="text-[#DC2626] animate-spin mx-auto mb-4" />
              <p className="text-[#737373]">Loading detected topics...</p>
            </div>
          ) : topics.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E5E5]">
              <BookOpen size={40} className="text-[#A3A3A3] mx-auto mb-4" strokeWidth={1.5} />
              <p className="text-[#171717] font-semibold mb-2">No topics found</p>
              <p className="text-sm text-[#737373] mb-6">Upload study materials first to generate AI-detected topics.</p>
            </div>
          ) : (
            <>
              {/* Topics */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#171717]">
                    <Sparkles size={14} className="inline mr-1.5 text-[#DC2626]" />
                    AI-Detected Topics ({topics.length})
                  </h3>
                  <span className="text-xs text-[#737373]">{Object.keys(selectedTopics).length} selected &middot; {totalQuestions} questions</span>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {topics.map((t) => (
                    <TopicCard key={t} topic={t} selected={!!selectedTopics[t]} questions={selectedTopics[t] || 0} onToggle={toggleTopic} onChangeCount={(c) => changeCount(t, c)} />
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5] mb-6">
                <h3 className="text-sm font-semibold text-[#171717] mb-4">Difficulty</h3>
                <div className="flex gap-3">
                  {["easy", "medium", "hard"].map((d) => (
                    <button key={d} onClick={() => setDifficulty(d)} className={`flex-1 py-3 rounded-full text-sm font-medium capitalize transition-all ${difficulty === d ? "bg-[#DC2626] text-white shadow-lg shadow-[#DC2626]/20" : "bg-[#F5F5F5] text-[#525252] hover:bg-[#E5E5E5]"}`}>
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary bar */}
              <div className="bg-[#0A0A0A] rounded-2xl p-6 mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-[#737373] mb-1">Total Questions</p>
                    <p className="text-2xl font-bold text-white">{totalQuestions}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#737373] mb-1">Topics</p>
                    <p className="text-2xl font-bold text-white">{Object.keys(selectedTopics).length}</p>
                  </div>
                  <button onClick={startQuiz} disabled={totalQuestions === 0 || generating}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 text-[14px] font-semibold text-white bg-[#DC2626] rounded-full hover:bg-[#B91C1C] hover:shadow-[0_8px_24px_rgba(220,38,38,0.3)] transition-all disabled:opacity-50">
                    {generating ? <><Loader2 size={16} className="animate-spin" /> Generating...</> : <>Start Quiz <ArrowRight size={16} /></>}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <div className="max-w-[800px] mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-[#171717]">Question {current + 1} <span className="text-[#A3A3A3] font-normal">/ {questions.length}</span></h2>
              <p className="text-xs text-[#737373]">{questions[current]?.topic || "General"}</p>
            </div>
            <button onClick={finish} className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#737373] rounded-full hover:bg-[#F5F5F5] hover:text-[#171717] transition-all">End Session</button>
          </div>

          {/* Progress */}
          <div className="h-2 bg-[#F5F5F5] rounded-full mb-8">
            <div className="h-full bg-[#DC2626] rounded-full transition-all" style={{ width: `${((current + 1) / questions.length) * 100}%` }} />
          </div>

          <div className="grid lg:grid-cols-[180px_1fr] gap-8">
            {/* Question nav */}
            <div className="hidden lg:grid grid-cols-5 gap-2 content-start">
              {questions.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`w-9 h-9 rounded-lg text-xs font-semibold transition-all ${i === current ? "bg-[#DC2626] text-white" : answers[i] !== undefined ? "bg-[#ECFDF5] text-[#10B981]" : "bg-[#F5F5F5] text-[#A3A3A3] hover:bg-[#E5E5E5]"}`}>
                  {i + 1}
                </button>
              ))}
            </div>

            {/* Question area */}
            <div>
              <AnimatePresence mode="wait">
                <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                  <div className="bg-white rounded-2xl p-8 border border-[#E5E5E5] mb-5">
                    <p className="text-base font-medium text-[#171717] mb-6 leading-relaxed">{questions[current]?.question}</p>
                    <div className="space-y-3">
                      {questions[current]?.options?.map((opt, i) => {
                        const ans = answers[current];
                        const isCorrect = i === questions[current].correctAnswer;
                        let cls = "bg-white border-[#E5E5E5] hover:border-[#DC2626]/40 hover:bg-[#FEF2F2]/30";
                        if (ans !== undefined) {
                          if (i === ans && isCorrect) cls = "bg-[#ECFDF5] border-[#10B981]";
                          else if (i === ans && !isCorrect) cls = "bg-[#FEF2F2] border-[#EF4444]";
                          else if (isCorrect) cls = "bg-[#ECFDF5] border-[#10B981]";
                        }
                        return (
                          <button key={i} onClick={() => submitAnswer(i)} disabled={ans !== undefined}
                            className={`w-full flex items-center gap-4 text-left px-5 py-4 rounded-xl border-[1.5px] transition-all ${cls} disabled:opacity-80`}>
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${i === ans && isCorrect ? "bg-[#10B981] text-white" : i === ans && !isCorrect ? "bg-[#EF4444] text-white" : isCorrect && ans !== undefined ? "bg-[#10B981] text-white" : "bg-[#F5F5F5] text-[#525252]"}`}>
                              {String.fromCharCode(65 + i)}
                            </span>
                            <span className="text-[15px] text-[#171717]">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Explanation */}
                  {explanations[current] && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#FEF2F2] rounded-2xl p-6 border border-[#DC2626]/15 mb-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Lightbulb size={16} className="text-[#DC2626]" />
                        <span className="text-sm font-semibold text-[#DC2626]">Explanation</span>
                      </div>
                      <p className="text-sm text-[#525252] leading-relaxed">{explanations[current]}</p>
                    </motion.div>
                  )}

                  {/* Nav buttons */}
                  <div className="flex justify-between">
                    <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
                      className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-[#737373] rounded-full hover:bg-[#F5F5F5] hover:text-[#171717] transition-all disabled:opacity-40">
                      <ChevronLeft size={16} /> Prev
                    </button>
                    {current < questions.length - 1 ? (
                      <button onClick={() => setCurrent(current + 1)}
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#DC2626] rounded-full hover:bg-[#B91C1C] hover:shadow-[0_8px_24px_rgba(220,38,38,0.25)] transition-all">
                        Next <ChevronRight size={16} />
                      </button>
                    ) : (
                      <button onClick={finish}
                        className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#DC2626] rounded-full hover:bg-[#B91C1C] hover:shadow-[0_8px_24px_rgba(220,38,38,0.25)] transition-all">
                        Finish <Check size={16} />
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
