import { useState, useEffect } from 'react';
import { api } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Loader2, AlertCircle, CheckCircle, XCircle, ChevronLeft, ChevronRight,
  Sliders, Zap, RotateCcw, Save, Sparkles, Clock
} from 'lucide-react';

export default function StudySession() {
  const [step, setStep] = useState('setup');
  const [topics, setTopics] = useState([]);
  const [selectedTopics, setSelectedTopics] = useState([]);
  const [questionCount, setQuestionCount] = useState(5);
  const [maxQuestions, setMaxQuestions] = useState(30);
  const [difficulty, setDifficulty] = useState('medium');
  const [error, setError] = useState('');

  const [sessionId, setSessionId] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [explanations, setExplanations] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    api.get('/api/quiz/topics')
      .then(res => {
        setTopics(res.data.topics || []);
        setMaxQuestions(res.data.totalMaxQuestions || 30);
        setQuestionCount(Math.min(10, res.data.totalMaxQuestions || 10));
        setDifficulty(res.data.defaultDifficulty || 'medium');
      })
      .catch(err => setError(err.response?.data?.message || 'Upload materials first.'));
  }, []);

  const toggleTopic = t => {
    setSelectedTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };
  const selectAll = () => setSelectedTopics(topics);
  const clearAll = () => setSelectedTopics([]);

  const startSession = async () => {
    setError('');
    setLoading(true);
    setStep('loading');
    try {
      const res = await api.post('/api/quiz/session', {
        count: questionCount,
        difficulty,
        selectedTopics: selectedTopics.length > 0 ? selectedTopics : undefined,
      });
      setSessionId(res.data.session.id);
      setQuestions(res.data.questions || []);
      setCurrent(0);
      setAnswers({});
      setExplanations({});
      setResult(null);
      setStep('quiz');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to start session');
      setStep('setup');
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async (optionIndex) => {
    if (answers[current] !== undefined) return;
    const q = questions[current];
    setAnswers(prev => ({ ...prev, [current]: optionIndex }));
    try {
      const res = await api.post('/api/quiz/answer', {
        sessionId, questionId: q.id, selectedAnswer: optionIndex,
        question: q.question, options: q.options, correctAnswer: q.correctAnswer, topic: q.topic,
      });
      setExplanations(prev => ({ ...prev, [current]: res.data.explanation }));
    } catch (e) {
      setExplanations(prev => ({ ...prev, [current]: `Correct: ${q.options[q.correctAnswer]}` }));
    }
  };

  const finishSession = async () => {
    setLoading(true);
    try {
      const res = await api.post('/api/quiz/complete', { sessionId, duration: 0 });
      setResult(res.data.session);
      setStep('done');
    } catch { setStep('done'); }
    finally { setLoading(false); }
  };

  const generateNewSet = async () => {
    setError('');
    setLoading(true);
    setStep('loading');
    try {
      const res = await api.post('/api/quiz/new-set', {
        sessionId,
        selectedTopics: selectedTopics.length > 0 ? selectedTopics : undefined,
      });
      setQuestions(res.data.questions || []);
      setCurrent(0);
      setAnswers({});
      setExplanations({});
      setStep('quiz');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate new questions');
      setStep('done');
    } finally { setLoading(false); }
  };

  const correctCount = Object.keys(answers).filter(i => answers[i] === questions[i]?.correctAnswer).length;
  const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;

  // ─── SETUP ───
  if (step === 'setup') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-12">
          <h1 className="text-2xl font-bold text-[#1e293b] mb-3">Study Session</h1>
          <p className="text-sm text-[#94a3b8]">Configure your practice quiz</p>
        </div>

        {error && (
          <div className="mb-10 p-5 rounded-xl bg-red-50 border border-red-100 flex items-start gap-4">
            <AlertCircle size={18} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-[#DC2626] font-medium">{error}</p>
              <button onClick={() => setError('')} className="text-xs text-[#94a3b8] mt-2 hover:text-[#DC2626]">Dismiss</button>
            </div>
          </div>
        )}

        <div className="card p-10 space-y-12">
          {/* Topics */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <label className="text-sm font-semibold text-[#1e293b]">Topic Areas</label>
              <div className="flex gap-4">
                <button onClick={selectAll} className="text-xs text-[#DC2626] font-medium hover:underline">Select All</button>
                <button onClick={clearAll} className="text-xs text-[#94a3b8] hover:text-[#64748b]">Clear</button>
              </div>
            </div>
            {topics.length === 0 ? (
              <p className="text-sm text-[#94a3b8]">No topics detected. Upload materials first.</p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {topics.map(t => (
                  <button key={t} onClick={() => toggleTopic(t)}
                    className={`px-5 py-2.5 rounded-xl text-sm border-[1.5px] transition-all ${selectedTopics.includes(t) ? 'border-[#DC2626] text-[#DC2626] bg-[#FEF2F2] font-medium' : 'border-[#e2e8f0] text-[#64748b] hover:border-[#cbd5e1]'}`}>
                    {t}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Question Count */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <label className="text-sm font-semibold text-[#1e293b]">Number of Questions</label>
              <span className="px-4 py-1.5 bg-[#FEF2F2] rounded-lg text-sm font-bold text-[#DC2626]">{questionCount}</span>
            </div>
            <input type="range" min={3} max={maxQuestions} value={questionCount}
              onChange={e => setQuestionCount(Number(e.target.value))} className="w-full" />
            <div className="flex justify-between text-xs text-[#94a3b8] mt-3">
              <span>3</span>
              <span>{maxQuestions}</span>
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="text-sm font-semibold text-[#1e293b] mb-5 block">Difficulty</label>
            <div className="flex gap-4">
              {['easy', 'medium', 'hard'].map(d => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`flex-1 py-3.5 text-sm capitalize rounded-xl border-[1.5px] transition-all font-medium ${difficulty === d ? 'border-[#DC2626] text-[#DC2626] bg-[#FEF2F2]' : 'border-[#e2e8f0] text-[#64748b] hover:border-[#cbd5e1]'}`}>
                  {d}
                </button>
              ))}
            </div>
          </div>

          <button onClick={startSession} disabled={loading || topics.length === 0} className="btn-red w-full">
            {loading ? <><Loader2 size={16} className="animate-spin" /> Starting...</> : <><Zap size={16} /> Start Study Session</>}
          </button>
        </div>
      </div>
    );
  }

  // ─── LOADING ───
  if (step === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh]">
        <div className="w-14 h-14 border-4 border-[#DC2626] border-t-transparent rounded-full animate-spin mb-6" />
        <p className="text-sm text-[#94a3b8]">AI is generating questions from your materials...</p>
      </div>
    );
  }

  // ─── DONE ───
  if (step === 'done') {
    return (
      <div className="max-w-lg mx-auto">
        <div className="card p-12 text-center">
          <div className="w-20 h-20 bg-[#FEF2F2] rounded-2xl flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={36} strokeWidth={1.5} className="text-[#DC2626]" />
          </div>
          <h2 className="text-2xl font-bold text-[#1e293b] mb-3">Session Complete</h2>
          <p className="text-sm text-[#94a3b8] mb-10">Here is how you performed</p>

          <div className="relative w-36 h-36 mx-auto mb-10">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="8" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="#DC2626" strokeWidth="8"
                strokeDasharray={`${score * 2.51} ${251 - score * 2.51}`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-[#1e293b]">{score}%</span>
            </div>
          </div>

          <div className="flex justify-center gap-12 mb-10">
            <div className="text-center"><p className="font-bold text-[#10b981] text-xl">{correctCount}</p><p className="text-xs text-[#94a3b8] mt-2">Correct</p></div>
            <div className="text-center"><p className="font-bold text-[#DC2626] text-xl">{questions.length - correctCount}</p><p className="text-xs text-[#94a3b8] mt-2">Wrong</p></div>
            <div className="text-center"><p className="font-bold text-[#1e293b] text-xl">{questions.length}</p><p className="text-xs text-[#94a3b8] mt-2">Total</p></div>
          </div>

          {result?.aiFeedback && (
            <div className="p-6 bg-[#FEF2F2] rounded-xl mb-10 text-left">
              <div className="flex items-start gap-3">
                <Sparkles size={16} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
                <p className="text-sm text-[#475569] leading-relaxed">{result.aiFeedback}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <button onClick={generateNewSet} disabled={loading} className="btn-red flex-1">
              {loading ? <><Loader2 size={14} className="animate-spin" /> Generating...</> : <><RotateCcw size={14} /> New Question Set</>}
            </button>
            <button onClick={() => setStep('setup')} className="btn-outline flex-1">
              <Sliders size={14} /> Change Settings
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ─── QUIZ ───
  const q = questions[current];
  if (!q) return null;
  const answered = answers[current] !== undefined;
  const explanation = explanations[current];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-10">
        {/* ─── LEFT PANEL ─── */}
        <div className="lg:w-[280px] flex-shrink-0 space-y-8">
          <div className="card p-8">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={14} strokeWidth={1.5} className="text-[#94a3b8]" />
              <span className="text-xs text-[#94a3b8]">Progress</span>
            </div>
            <p className="text-2xl font-bold text-[#1e293b] mb-2">{Object.keys(answers).length} / {questions.length}</p>
            <p className="text-xs text-[#94a3b8]">questions answered</p>
            <div className="w-full h-2 bg-[#F1F5F9] rounded-full mt-6 overflow-hidden">
              <div className="h-full bg-[#DC2626] rounded-full transition-all" style={{ width: `${(Object.keys(answers).length / questions.length) * 100}%` }} />
            </div>
          </div>

          <div className="card p-8">
            <p className="text-xs text-[#94a3b8] mb-5 font-medium uppercase tracking-wider">Question Navigator</p>
            <div className="grid grid-cols-5 gap-2.5">
              {questions.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`q-nav-btn ${i === current ? 'current' : answers[i] !== undefined ? 'answered' : 'unanswered'}`}>
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ─── RIGHT PANEL ─── */}
        <div className="flex-1 min-w-0">
          <div className="card p-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-10">
              <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
                className="flex items-center gap-1 text-sm text-[#94a3b8] hover:text-[#1e293b] disabled:opacity-30 transition-colors">
                <ChevronLeft size={16} /> Prev
              </button>
              <div className="text-center">
                <span className="text-xs text-[#94a3b8]">Question</span>
                <p className="text-xl font-bold text-[#1e293b]">{current + 1} <span className="text-[#94a3b8] font-normal">/ {questions.length}</span></p>
              </div>
              <button onClick={() => setCurrent(Math.min(questions.length - 1, current + 1))} disabled={current === questions.length - 1}
                className="flex items-center gap-1 text-sm text-[#94a3b8] hover:text-[#1e293b] disabled:opacity-30 transition-colors">
                Next <ChevronRight size={16} />
              </button>
            </div>

            {/* Topic */}
            <span className="inline-block px-4 py-1.5 bg-[#FEF2F2] rounded-lg text-xs font-semibold text-[#DC2626] mb-8">{q.topic}</span>

            {/* Question */}
            <h2 className="text-xl font-bold text-[#1e293b] mb-10 leading-relaxed">{q.question}</h2>

            {/* Options */}
            <div className="space-y-4 mb-10">
              {q.options.map((opt, i) => {
                let cls = 'quiz-option';
                if (answered) {
                  if (i === q.correctAnswer) cls += ' correct';
                  else if (i === answers[current]) cls += ' wrong';
                  else cls += ' opacity-40';
                }
                return (
                  <button key={i} onClick={() => submitAnswer(i)} disabled={answered} className={cls}>
                    <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                    <span className="text-sm text-[#1e293b]">{opt}</span>
                    {answered && i === q.correctAnswer && <CheckCircle size={16} className="text-[#10b981] ml-auto flex-shrink-0" />}
                    {answered && i === answers[current] && i !== q.correctAnswer && <XCircle size={16} className="text-[#DC2626] ml-auto flex-shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation */}
            <AnimatePresence>
              {explanation && (
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="p-8 bg-[#FEF2F2] rounded-xl mb-10">
                  <div className="flex items-start gap-3">
                    <Sparkles size={16} className="text-[#DC2626] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-[#475569] leading-relaxed">{explanation}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Bottom Nav */}
            <div className="flex items-center justify-between pt-6 border-t border-[#F1F5F9]">
              <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
                className="flex items-center gap-1.5 text-sm text-[#94a3b8] hover:text-[#1e293b] disabled:opacity-30 px-5 py-2.5 rounded-xl hover:bg-[#F8FAFC] transition-colors">
                <ChevronLeft size={16} /> Prev
              </button>
              {current === questions.length - 1 ? (
                <button onClick={finishSession} disabled={loading} className="btn-red text-sm">
                  {loading ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : <><Save size={14} /> Finish Session</>}
                </button>
              ) : (
                <button onClick={() => setCurrent(current + 1)}
                  className="flex items-center gap-1.5 text-sm font-medium text-[#DC2626] hover:text-[#B91C1C] px-6 py-3 rounded-xl hover:bg-[#FEF2F2] transition-colors">
                  Next <ChevronRight size={16} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
