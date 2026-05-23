import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, ChevronDown, ChevronUp, BookOpen } from 'lucide-react';
import { api } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Review() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    api.get('/api/dashboard/weak-areas')
      .then(r => setItems(r.data.weakAreas || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-[#DC2626] border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-[#1e293b] mb-2">Review & Corrections</h1>
        <p className="text-sm text-[#94a3b8]">Learn from your mistakes and strengthen weak areas</p>
      </div>

      {items.length === 0 ? (
        <div className="card p-12 text-center">
          <BookOpen size={28} strokeWidth={1.5} className="text-[#e2e8f0] mx-auto mb-3" />
          <p className="text-sm text-[#94a3b8] mb-1">No mistakes to review yet</p>
          <p className="text-xs text-[#cbd5e1] mb-6">Complete quizzes to see weak areas here</p>
          <button onClick={() => navigate('/study')} className="btn-red text-sm">Start Studying</button>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="card overflow-hidden">
              <button onClick={() => setOpenId(openId === idx ? null : idx)} className="w-full flex items-start gap-4 p-6 text-left">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <AlertTriangle size={16} strokeWidth={1.5} className="text-[#DC2626]" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs font-semibold text-[#DC2626] uppercase tracking-wider">{item.topic}</span>
                  <p className="text-sm text-[#1e293b] mt-1 font-medium">{item.question}</p>
                </div>
                {openId === idx ? <ChevronUp size={16} strokeWidth={1.5} className="text-[#94a3b8] flex-shrink-0" /> : <ChevronDown size={16} strokeWidth={1.5} className="text-[#94a3b8] flex-shrink-0" />}
              </button>
              {openId === idx && (
                <div className="px-6 pb-6 pl-[5rem]">
                  <div className="space-y-3">
                    <div className="border-l-2 border-[#DC2626] pl-4 py-3 rounded-r-lg bg-red-50">
                      <p className="text-xs text-[#DC2626] mb-1 font-medium">Your answer</p>
                      <p className="text-sm text-[#1e293b]">{item.options?.[item.yourAnswer] || 'N/A'}</p>
                    </div>
                    <div className="border-l-2 border-[#10b981] pl-4 py-3 rounded-r-lg bg-[#ECFDF5]">
                      <p className="text-xs text-[#10b981] mb-1 font-medium">Correct answer</p>
                      <p className="text-sm text-[#1e293b]">{item.options?.[item.correctAnswer] || 'N/A'}</p>
                    </div>
                    {item.explanation && (
                      <div className="border-l-2 border-[#DC2626] pl-4 py-3 rounded-r-lg bg-[#FEF2F2]">
                        <p className="text-xs text-[#DC2626] mb-1 font-medium">Explanation</p>
                        <p className="text-sm text-[#475569] leading-relaxed">{item.explanation}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
