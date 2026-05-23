import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Clock, ChevronLeft, ChevronRight, Loader2, CheckCircle, RotateCcw, Home } from 'lucide-react';
import { api } from '../context/AuthContext';

export default function ExamSimulation() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState('setup');
  const [settings, setSettings] = useState({ duration: 60, difficulty: 'medium' });
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(3600);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (phase !== 'exam') return;
    const t = setInterval(() => {
      setTimeLeft(p => { if (p <= 1) { setPhase('done'); return 0; } return p - 1; });
    }, 1000);
    return () => clearInterval(t);
  }, [phase]);

  const fmt = s => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const start = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/api/quiz/session', { type: 'exam_simulation', count: 10, difficulty: settings.difficulty });
      setQuestions(res.data.questions || []);
      setPhase('exam');
      setCurrent(0);
      setAnswers({});
      setTimeLeft(settings.duration * 60);
    } catch (e) { setError(e.response?.data?.message || 'Failed to start exam'); }
    setLoading(false);
  };

  const pick = i => setAnswers(p => ({ ...p, [current]: i }));
  const submit = () => setPhase('done');

  const correct = questions.filter((q, i) => answers[i] === q.correctAnswer).length;
  const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;

  if (phase === 'setup') return (
    <div className="max-w-md mx-auto">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-[#1e293b] mb-2">Mock Exam</h1>
        <p className="text-sm text-[#94a3b8]">Test yourself under timed conditions</p>
      </div>
      {error && <div className="mb-6 p-5 rounded-xl bg-red-50 border border-red-100"><p className="text-sm text-[#DC2626]">{error}</p></div>}
      <div className="card p-8 space-y-8 mb-8">
        <div>
          <label className="text-sm font-semibold text-[#1e293b] mb-4 block">Duration</label>
          <div className="flex gap-3">
            {[{ v: 30, l: '30 min' }, { v: 60, l: '1 hour' }, { v: 120, l: '2 hours' }].map(d =>
              <button key={d.v} onClick={() => setSettings(p => ({ ...p, duration: d.v }))}
                className={`flex-1 py-3.5 text-sm rounded-xl border-[1.5px] transition-all font-medium ${settings.duration === d.v ? 'border-[#DC2626] text-[#DC2626] bg-[#FEF2F2]' : 'border-[#e2e8f0] text-[#64748b] hover:border-[#cbd5e1]'}`}>
                {d.l}
              </button>
            )}
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-[#1e293b] mb-4 block">Difficulty</label>
          <div className="flex gap-3">
            {['easy', 'medium', 'hard'].map(d =>
              <button key={d} onClick={() => setSettings(p => ({ ...p, difficulty: d }))}
                className={`flex-1 py-3.5 text-sm capitalize rounded-xl border-[1.5px] transition-all font-medium ${settings.difficulty === d ? 'border-[#DC2626] text-[#DC2626] bg-[#FEF2F2]' : 'border-[#e2e8f0] text-[#64748b] hover:border-[#cbd5e1]'}`}>
                {d}
              </button>
            )}
          </div>
        </div>
      </div>
      <p className="text-xs text-[#94a3b8] mb-4">10 questions · {settings.duration} minutes · Timed</p>
      <button onClick={start} disabled={loading} className="btn-red w-full">
        {loading ? <><Loader2 size={14} className="animate-spin" /> Loading...</> : <><Play size={14} /> Start Exam</>}
      </button>
    </div>
  );

  if (phase === 'done') return (
    <div className="max-w-lg mx-auto">
      <div className="card p-10 text-center">
        <div className="w-20 h-20 bg-[#FEF2F2] rounded-2xl flex items-center justify-center mx-auto mb-6">
          <CheckCircle size={32} strokeWidth={1.5} className="text-[#DC2626]" />
        </div>
        <h2 className="text-2xl font-bold text-[#1e293b] mb-2">Exam Complete</h2>
        <p className="text-sm text-[#94a3b8] mb-8">Here is how you performed</p>
        <div className="relative w-32 h-32 mx-auto mb-8">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#F1F5F9" strokeWidth="8" />
            <circle cx="50" cy="50" r="40" fill="none" stroke="#DC2626" strokeWidth="8"
              strokeDasharray={`${score * 2.51} ${251 - score * 2.51}`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-[#1e293b]">{score}%</span>
          </div>
        </div>
        <div className="flex justify-center gap-10 mb-8">
          <div className="text-center"><p className="font-bold text-[#10b981] text-xl">{correct}</p><p className="text-xs text-[#94a3b8] mt-1">Correct</p></div>
          <div className="text-center"><p className="font-bold text-[#DC2626] text-xl">{questions.length - correct}</p><p className="text-xs text-[#94a3b8] mt-1">Wrong</p></div>
          <div className="text-center"><p className="font-bold text-[#1e293b] text-xl">{questions.length - Object.keys(answers).length}</p><p className="text-xs text-[#94a3b8] mt-1">Skipped</p></div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <button onClick={() => { setPhase('setup'); setQuestions([]); setAnswers({}); }} className="btn-red flex-1"><RotateCcw size={14} /> Retake</button>
          <button onClick={() => navigate('/dashboard')} className="btn-outline flex-1"><Home size={14} /> Dashboard</button>
        </div>
      </div>

      <div className="mt-6 card p-6">
        <h3 className="text-sm font-semibold text-[#1e293b] mb-4">Review Answers</h3>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {questions.map((q, i) => {
            const ans = answers[i];
            const isC = ans === q.correctAnswer;
            return (
              <div key={i} className={`p-4 rounded-xl ${ans != null ? (isC ? 'bg-[#ECFDF5]' : 'bg-red-50') : 'bg-[#F8FAFC]'}`}>
                <div className="flex items-start gap-3">
                  <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${isC ? 'bg-[#10b981] text-white' : ans != null ? 'bg-[#DC2626] text-white' : 'bg-[#e2e8f0]'}`}>
                    {isC ? '✓' : ans != null ? '✗' : '?'}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm text-[#1e293b] mb-1">{q.question}</p>
                    {!isC && ans != null && <p className="text-xs text-[#10b981]">Correct: {q.options[q.correctAnswer]}</p>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const q = questions[current];
  if (!q) return null;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6 p-5 bg-[#1e293b] rounded-2xl">
        <div className="flex items-center gap-3">
          <Clock size={16} className={timeLeft < 300 ? 'text-[#DC2626]' : 'text-white'} />
          <span className={`text-sm font-mono font-bold ${timeLeft < 300 ? 'text-[#DC2626]' : 'text-white'}`}>{fmt(timeLeft)}</span>
        </div>
        <span className="text-xs text-slate-400">{current + 1} / {questions.length}</span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -12 }}>
          <div className="card p-8">
            <span className="inline-block px-4 py-1.5 bg-[#FEF2F2] rounded-lg text-xs font-semibold text-[#DC2626] mb-6">{q.topic}</span>
            <h2 className="text-lg font-bold text-[#1e293b] mb-8 leading-relaxed">{q.question}</h2>
            <div className="space-y-3 mb-8">
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => pick(i)} className={`quiz-option ${answers[current] === i ? 'selected' : ''}`}>
                  <span className={`opt-letter ${answers[current] === i ? '' : ''}`}>{String.fromCharCode(65 + i)}</span>
                  <span className="text-sm text-[#1e293b]">{opt}</span>
                </button>
              ))}
            </div>
            <div className="flex justify-between items-center pt-4 border-t border-[#F1F5F9]">
              <button onClick={() => setCurrent(Math.max(0, current - 1))} disabled={current === 0}
                className="flex items-center gap-1 text-sm text-[#94a3b8] hover:text-[#1e293b] disabled:opacity-30 px-4 py-2 rounded-xl hover:bg-[#F8FAFC] transition-colors">
                <ChevronLeft size={14} /> Prev
              </button>
              {current === questions.length - 1 ? (
                <button onClick={submit} className="btn-red text-sm">Submit Exam</button>
              ) : (
                <button onClick={() => setCurrent(current + 1)}
                  className="flex items-center gap-1 text-sm font-medium text-[#DC2626] hover:text-[#B91C1C] px-5 py-2.5 rounded-xl hover:bg-[#FEF2F2] transition-colors">
                  Next <ChevronRight size={14} />
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-6 card p-5">
        <div className="flex flex-wrap gap-2 items-center">
          {questions.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`q-nav-btn ${i === current ? 'current' : answers[i] != null ? 'answered' : 'unanswered'}`}>
              {i + 1}
            </button>
          ))}
          <button onClick={submit} className="ml-auto px-5 py-2.5 bg-[#DC2626] text-white text-xs font-semibold rounded-xl hover:bg-[#B91C1C] transition-colors">Finish</button>
        </div>
      </div>
    </div>
  );
}
