export default function AnimatedGraph() {
  return (
    <div className="w-[380px] h-[240px] bg-navy-light rounded-xl p-6 relative overflow-hidden border border-white/5">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-white/60 text-xs font-medium">Mastery Score</span>
        <span className="text-coral text-sm font-bold">+47%</span>
      </div>

      <svg width="100%" height="100%" viewBox="0 0 340 180" className="overflow-visible">
        {/* Grid lines */}
        {[60, 100, 140].map((y, i) => (
          <line
            key={i}
            x1="0"
            y1={y}
            x2="340"
            y2={y}
            stroke="#334155"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        ))}

        {/* Glow path */}
        <path
          d="M0 140 C 40 120, 80 150, 120 100 S 200 40, 340 20"
          className="animate-fadeGlow"
          fill="none"
          stroke="#ff6b4a"
          strokeWidth="8"
          strokeLinecap="round"
          style={{ filter: 'blur(4px)' }}
        />

        {/* Main path */}
        <path
          d="M0 140 C 40 120, 80 150, 120 100 S 200 40, 340 20"
          className="animate-drawLine"
          fill="none"
          stroke="#ff6b4a"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* End dot */}
        <circle cx="340" cy="20" r="0" fill="#fff" className="animate-popIn" />

        {/* Pulse ring */}
        <circle
          cx="340"
          cy="20"
          r="4"
          fill="none"
          stroke="#ff6b4a"
          strokeWidth="2"
          className="animate-pulse-ring"
          style={{ opacity: 0 }}
        />
      </svg>

      {/* Labels */}
      <div className="absolute bottom-4 left-6 right-6 flex justify-between">
        <span className="text-white/30 text-[10px]">Week 1</span>
        <span className="text-white/30 text-[10px]">Week 4</span>
        <span className="text-white/30 text-[10px]">Week 8</span>
      </div>
    </div>
  );
}
