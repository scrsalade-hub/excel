import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, BookOpen, Sparkles, ChevronLeft, ChevronRight, RotateCcw, FlipHorizontal, Download } from "lucide-react";
import AppShell from "@/components/layout/AppShell";
import { apiFetch } from "@/lib/api";

export default function Flashcards() {
  const [step, setStep] = useState("select");
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState("");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [cards, setCards] = useState([]);
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => { fetchTopics(); }, []);

  const fetchTopics = async () => {
    try {
      const data = await apiFetch("/api/quiz/topics");
      setTopics(data.topics || []);
    } catch { setError("Upload materials first to generate flashcards."); }
    finally { setLoading(false); }
  };

  const generateCards = async () => {
    if (!selectedTopic) { setError("Select a topic first."); return; }
    setError(""); setGenerating(true);
    try {
      const data = await apiFetch("/api/quiz/flashcards", {
        method: "POST",
        body: JSON.stringify({ topic: selectedTopic }),
      });
      setCards(data.flashcards || []);
      setStep("study");
      setCurrent(0);
      setFlipped(false);
    } catch (err) { setError(err.message || "Failed to generate flashcards."); }
    finally { setGenerating(false); }
  };

  const next = () => { setFlipped(false); setTimeout(() => setCurrent((p) => (p + 1) % cards.length), 150); };
  const prev = () => { setFlipped(false); setTimeout(() => setCurrent((p) => (p - 1 + cards.length) % cards.length), 150); };

  return (
    <AppShell>
      {step === "select" ? (
        <div className="max-w-[640px] mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#171717] mb-1">Flashcards</h1>
            <p className="text-sm text-[#737373]">Pick a topic. Our AI generates visual flashcards from your materials.</p>
          </div>

          {error && <div className="bg-[#FEF2F2] text-[#DC2626] text-sm px-5 py-3 rounded-2xl mb-6 border border-[#DC2626]/10">{error}</div>}

          {loading ? (
            <div className="text-center py-16"><Loader2 size={28} className="text-[#DC2626] animate-spin mx-auto mb-3" /><p className="text-sm text-[#737373]">Loading topics...</p></div>
          ) : topics.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E5E5E5]">
              <BookOpen size={32} className="text-[#A3A3A3] mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-sm text-[#737373]">No topics yet. Upload your materials first.</p>
            </div>
          ) : (
            <>
              <div className="bg-white rounded-2xl p-6 border border-[#E5E5E5] mb-6">
                <h3 className="text-sm font-semibold text-[#171717] mb-4">
                  <Sparkles size={14} className="inline mr-1.5 text-[#DC2626]" />Select a Topic
                </h3>
                <div className="flex flex-wrap gap-2">
                  {topics.map((t) => (
                    <button key={t} onClick={() => setSelectedTopic(t)}
                      className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all ${selectedTopic === t ? "bg-[#DC2626] text-white shadow-lg shadow-[#DC2626]/20" : "bg-[#F5F5F5] text-[#525252] hover:bg-[#E5E5E5]"}`}>
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={generateCards} disabled={generating || !selectedTopic}
                className="w-full h-14 inline-flex items-center justify-center gap-2 text-sm font-semibold text-white bg-[#DC2626] rounded-full hover:bg-[#B91C1C] transition-all disabled:opacity-50">
                {generating ? <><Loader2 size={16} className="animate-spin" /> Generating Flashcards...</> : <>Generate Flashcards <Sparkles size={16} /></>}
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="max-w-[560px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <button onClick={() => setStep("select")} className="text-sm text-[#737373] hover:text-[#171717]">&larr; Pick another topic</button>
            <span className="text-xs text-[#A3A3A3]">{current + 1} / {cards.length}</span>
          </div>

          <div className="h-1.5 bg-[#F5F5F5] rounded-full mb-8">
            <div className="h-full bg-[#DC2626] rounded-full transition-all" style={{ width: `${((current + 1) / cards.length) * 100}%` }} />
          </div>

          {/* Flashcard */}
          <div className="relative h-[380px] mb-8" style={{ perspective: "1000px" }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={current + (flipped ? "-back" : "-front")}
                initial={{ rotateY: flipped ? -90 : 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                exit={{ rotateY: flipped ? 90 : -90, opacity: 0 }}
                transition={{ duration: 0.3 }}
                onClick={() => setFlipped(!flipped)}
                className="absolute inset-0 cursor-pointer"
                style={{ transformStyle: "preserve-3d", backfaceVisibility: "hidden" }}
              >
                <div className={`w-full h-full rounded-3xl border border-[#E5E5E5] p-8 flex flex-col justify-center items-center text-center transition-all hover:shadow-xl ${flipped ? "bg-[#0A0A0A]" : "bg-white"}`}>
                  {!flipped ? (
                    <>
                      <span className="text-xs font-semibold text-[#DC2626] uppercase tracking-widest mb-6">{cards[current]?.topic || selectedTopic}</span>
                      <h3 className="text-xl sm:text-2xl font-bold text-[#171717] leading-snug mb-6">{cards[current]?.front}</h3>
                      <div className="flex items-center gap-2 text-[#A3A3A3]">
                        <FlipHorizontal size={14} /><span className="text-xs">Tap to reveal</span>
                      </div>
                      {cards[current]?.image && (
                        <img src={cards[current].image} alt="" className="w-24 h-24 object-cover rounded-2xl mt-4" />
                      )}
                    </>
                  ) : (
                    <>
                      <span className="text-xs font-semibold text-[#DC2626] uppercase tracking-widest mb-6">Answer</span>
                      <p className="text-lg text-white/90 leading-relaxed">{cards[current]?.back}</p>
                      <div className="flex items-center gap-2 text-white/40 mt-6">
                        <FlipHorizontal size={14} /><span className="text-xs">Tap to flip back</span>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button onClick={prev} className="w-11 h-11 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#737373] hover:border-[#DC2626] hover:text-[#DC2626] transition-all">
              <ChevronLeft size={18} />
            </button>
            <button onClick={() => setFlipped(!flipped)} className="px-6 py-3 text-sm font-semibold text-white bg-[#DC2626] rounded-full hover:bg-[#B91C1C] transition-all">
              <FlipHorizontal size={16} className="inline mr-2" />Flip
            </button>
            <button onClick={next} className="w-11 h-11 rounded-full border border-[#E5E5E5] flex items-center justify-center text-[#737373] hover:border-[#DC2626] hover:text-[#DC2626] transition-all">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </AppShell>
  );
}
