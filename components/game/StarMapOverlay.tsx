'use client';

import { useMathStore } from '@/store/useMathStore';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, X, ChevronRight, Map, Globe, Anchor } from 'lucide-react';
import { useState, useMemo } from 'react';
import { KNOWLEDGE_DB } from '@/lib/game/knowledgeContent';

// Planet coordinates in % (x, y)
const PLANET_POSITIONS = [
  { x: 20, y: 70, name: "起源站 (The Origin)", type: "station" },
  { x: 40, y: 50, name: "重力井 (Gravity Well)", type: "planet" },
  { x: 60, y: 30, name: "漂流带 (The Drift)", type: "asteroid" },
  { x: 80, y: 50, name: "奇点 (Singularity)", type: "blackhole" }
];

export default function StarMapOverlay() {
  const level = useMathStore((state) => state.level);
  const maxLevel = useMathStore((state) => state.maxLevel);
  const isDataLogOpen = useMathStore((state) => state.isDataLogOpen); // Reusing this state for "Map Open"
  const closeDataLog = useMathStore((state) => state.closeDataLog);
  const jumpToLevel = useMathStore((state) => state.jumpToLevel);

  const [selectedPlanet, setSelectedPlanet] = useState<number | null>(null);

  // Auto-select current level on open if nothing selected
  // CHANGED: valid useEffect instead of useMemo for side-effects
  // CHANGED: Moved before early return
  useMemo(() => {
    if (isDataLogOpen && selectedPlanet === null) {
      setSelectedPlanet(Math.min(level, maxLevel));
    }
  }, [isDataLogOpen, level, maxLevel, selectedPlanet]);

  // Generate Path SVG
  // CHANGED: Moved before early return
  const pathD = useMemo(() => {
    return PLANET_POSITIONS.reduce((acc, pos, i) => {
      if (i === 0) return `M ${pos.x} ${pos.y}`;
      return `${acc} L ${pos.x} ${pos.y}`;
    }, "");
  }, []);

  if (!isDataLogOpen) return null;

  const currentLog = selectedPlanet !== null ? KNOWLEDGE_DB[selectedPlanet] : null;

  return (
    <div className="absolute inset-0 z-[60] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center select-none overflow-hidden">

      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}
      />

      {/* Close Button */}
      <button
        onClick={closeDataLog}
        className="absolute top-8 right-8 p-2 text-slate-500 hover:text-red-400 transition-colors z-50 border border-slate-700 hover:border-red-500 bg-slate-900"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="w-full h-full flex flex-col md:flex-row relative">

        {/* Left: Star Map Area */}
        <div className="flex-1 relative h-full">
          {/* Header */}
          <div className="absolute top-8 left-8 flex items-center gap-4 z-10">
            <Map className="w-6 h-6 text-cyan-400" />
            <div>
              <h2 className="text-xl font-bold text-white tracking-widest uppercase font-mono">星际导航 (NAV_SYSTEM)</h2>
              <div className="text-xs text-cyan-600 font-mono">SECTOR: PARABOLA // COORDS_LOCKED</div>
            </div>
          </div>

          {/* Map Interactive Area */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full max-w-4xl max-h-[600px]">
              <svg className="absolute inset-0 w-full h-full overflow-visible">
                {/* Connection Lines (Ghost) */}
                <path
                  d={pathD}
                  stroke="#1e293b"
                  strokeWidth="2"
                  fill="none"
                  strokeDasharray="4 4"
                />
                {/* Connection Lines (Progress) */}
                {PLANET_POSITIONS.map((pos, i) => {
                  if (i >= PLANET_POSITIONS.length - 1) return null;
                  const next = PLANET_POSITIONS[i + 1];
                  const isUnlocked = i < maxLevel;
                  return (
                    <line
                      key={`line-${i}`}
                      x1={`${pos.x}%`} y1={`${pos.y}%`}
                      x2={`${next.x}%`} y2={`${next.y}%`}
                      stroke={isUnlocked ? "#0ea5e9" : "#1e293b"}
                      strokeWidth="2"
                      className="transition-colors duration-500"
                    />
                  )
                })}
              </svg>

              {/* Planets */}
              {PLANET_POSITIONS.map((planet, i) => {
                const isUnlocked = i <= maxLevel;
                const isCompleted = i < maxLevel;
                const isCurrent = i === level;
                const isSelected = selectedPlanet === i;

                return (
                  <button
                    key={i}
                    onClick={() => isUnlocked && setSelectedPlanet(i)}
                    disabled={!isUnlocked}
                    className={`absolute transform -translate-x-1/2 -translate-y-1/2 group transition-all duration-300
                                        ${isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed grayscale opacity-50'}
                                    `}
                    style={{ left: `${planet.x}%`, top: `${planet.y}%` }}
                  >
                    {/* Planet Visual */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all relative
                                        ${isCurrent ? 'bg-cyan-900 border-cyan-400 shadow-[0_0_20px_cyan]' : ''}
                                        ${isSelected ? 'scale-125 border-yellow-400' : 'border-slate-600 bg-slate-900'}
                                    `}>
                      {i === 0 && <Anchor className={`w-6 h-6 ${isUnlocked ? 'text-cyan-400' : 'text-slate-600'}`} />}
                      {i > 0 && i < 3 && <Globe className={`w-6 h-6 ${isUnlocked ? 'text-cyan-400' : 'text-slate-600'}`} />}
                      {i === 3 && <div className={`w-4 h-4 rounded-full ${isUnlocked ? 'bg-purple-500 shadow-[0_0_10px_purple]' : 'bg-slate-700'}`} />}

                      {/* Orbit Ring for Selected */}
                      {isSelected && (
                        <motion.div
                          layoutId="orbit"
                          className="absolute inset-[-8px] rounded-full border border-dashed border-yellow-500/50"
                          animate={{ rotate: 360 }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                        />
                      )}
                    </div>

                    {/* Label */}
                    <div className={`absolute top-full mt-4 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs font-mono tracking-wider transition-colors
                                        ${isSelected ? 'text-yellow-400 scale-110' : 'text-slate-500'}
                                    `}>
                      {planet.name}
                    </div>

                    {/* Ship Icon (If Current) */}
                    {isCurrent && (
                      <motion.div
                        layoutId="ship"
                        className="absolute -top-6 left-1/2 -translate-x-1/2 text-yellow-400 drop-shadow-[0_0_5px_rgba(250,204,21,0.8)]"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="transform rotate-0">
                          <path d="M12 2L2 22L12 18L22 22L12 2Z" />
                        </svg>
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Info Panel (Sliding in) */}
        <AnimatePresence>
          {selectedPlanet !== null && currentLog && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="w-full md:w-[400px] h-full bg-slate-900 border-l border-slate-700 shadow-2xl relative z-20 flex flex-col"
            >
              <div className="p-8 border-b border-slate-800 bg-slate-950/50">
                <div className="text-xs text-yellow-500 font-mono mb-2 uppercase tracking-widest border border-yellow-900/50 inline-block px-2 py-0.5 bg-yellow-900/10">
                  Level {selectedPlanet.toString().padStart(2, '0')} Analysis
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">{currentLog.title}</h2>
                <div className="text-slate-400 text-xs font-mono">{PLANET_POSITIONS[selectedPlanet]?.name}</div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {/* Concept Box */}
                <div className="bg-cyan-950/20 border border-cyan-500/30 p-4 rounded-lg">
                  <h3 className="text-cyan-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4" /> 核心理论 (Core Concept)
                  </h3>
                  <div className="text-cyan-200 font-mono text-sm leading-relaxed">
                    {currentLog.concept}
                  </div>
                </div>

                {/* Body Text */}
                <div className="text-slate-300 text-sm leading-relaxed font-sans space-y-4">
                  {currentLog.body}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="p-8 border-t border-slate-800 bg-slate-950/50">
                {/* Replay / Warp Here */}
                {level !== selectedPlanet && (
                  <button
                    onClick={() => {
                      jumpToLevel(selectedPlanet);
                      closeDataLog();
                    }}
                    className="w-full py-3 bg-slate-800 hover:bg-cyan-900/50 text-slate-300 hover:text-cyan-400 transition-all font-mono text-xs uppercase tracking-widest border border-slate-600 hover:border-cyan-500 flex items-center justify-center gap-2 group"
                  >
                    <span>Initiate Jump</span>
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                )}

                {level === selectedPlanet && (
                  <div className="text-center text-xs text-green-500 font-mono flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    Current Location
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
