'use client';

import { useMathStore } from '@/store/useMathStore';
import { motion } from 'framer-motion';
import { BookOpen, X, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { KNOWLEDGE_DB } from '@/lib/game/knowledgeContent';

export default function DataLogOverlay() {
  const level = useMathStore((state) => state.level);
  const maxLevel = useMathStore((state) => state.maxLevel);
  const isDataLogOpen = useMathStore((state) => state.isDataLogOpen);
  const closeDataLog = useMathStore((state) => state.closeDataLog);
  const jumpToLevel = useMathStore((state) => state.jumpToLevel);

  const [selectedLog, setSelectedLog] = useState<number | null>(null);

  if (!isDataLogOpen) return null;

  // Unlocked items: All levels strictly <= maxLevel
  const maxUnlock = maxLevel;

  const handleSelect = (idx: number) => {
    if (idx <= maxUnlock) {
      setSelectedLog(idx);
    }
  };

  const currentLog = selectedLog !== null ? KNOWLEDGE_DB[selectedLog] : null;

  return (
    <div className="absolute inset-0 z-40 bg-black/80 backdrop-blur-md flex items-center justify-center p-8 select-none">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="w-full max-w-5xl h-[85vh] bg-slate-950/95 border border-slate-700 flex shadow-2xl relative backdrop-blur-xl"
      >
        {/* Tech Corners */}
        <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-green-500 z-50" />
        <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-green-500 z-50" />
        <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-green-500 z-50" />
        <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-green-500 z-50" />

        {/* Sidebar */}
        <div className="w-80 border-r border-slate-800 bg-slate-900/50 flex flex-col font-mono">
          <div className="p-6 border-b border-slate-800 flex items-center gap-3 bg-black/20">
            <BookOpen className="w-5 h-5 text-green-500" />
            <span className="text-green-500 font-bold tracking-[0.2em] uppercase text-sm">航行日志 (LOGS)</span>
            {/* Show Level Status */}
            <span className="ml-auto text-[10px] text-slate-500 border border-slate-700 px-2 py-0.5">
              L:{level.toString().padStart(2, '0')} / M:{maxLevel.toString().padStart(2, '0')}
            </span>
          </div>
          <div className="flex-1 overflow-y-auto p-0 space-y-px">
            {Object.keys(KNOWLEDGE_DB).map((keyStr) => {
              const key = Number(keyStr);
              const entry = KNOWLEDGE_DB[key];
              const isUnlocked = key <= maxUnlock; // Unlock condition
              const isSelected = selectedLog === key;
              const isCurrentLevel = level === key;

              return (
                <button
                  key={key}
                  disabled={!isUnlocked}
                  onClick={() => handleSelect(key)}
                  className={`w-full text-left p-4 text-xs font-mono transition-all flex items-center justify-between border-l-4 group hover:pl-5
                    ${!isUnlocked
                      ? 'opacity-30 cursor-not-allowed border-transparent'
                      : isSelected
                        ? 'bg-green-900/20 text-green-400 border-green-500'
                        : 'hover:bg-slate-800/50 text-slate-400 border-transparent hover:border-slate-600'
                    }
                  `}
                >
                  <div className="flex flex-col gap-1">
                    <span className="font-bold tracking-wider">记录_{key.toString().padStart(3, '0')} //</span>
                    <span className="opacity-70 uppercase text-[10px] tracking-widest">{isUnlocked ? entry.title : "加密数据 (ENCRYPTED)"}</span>
                  </div>
                  {isCurrentLevel && <div className="w-1.5 h-1.5 bg-green-500 animate-pulse shadow-[0_0_5px_rgba(34,197,94,0.8)]" title="Current Location" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative flex flex-col bg-slate-950/50">
          {/* Scanline */}
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

          <button
            onClick={closeDataLog}
            className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-400 transition-colors z-10 border border-transparent hover:border-red-500/30"
          >
            <X className="w-6 h-6" />
          </button>

          {currentLog ? (
            <div className="flex-1 p-10 overflow-y-auto select-text cursor-text flex flex-col relative z-0">
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-300 flex-1">
                <div className="flex items-center gap-4 border-b border-slate-800 pb-6">
                  <h2 className="text-3xl font-bold text-white uppercase tracking-widest font-mono">
                    {currentLog.title}
                  </h2>
                </div>

                <div className="flex gap-4">
                  <div className="w-1 bg-green-600/50" />
                  <div className="flex-1 text-green-400 font-mono bg-green-950/10 p-6 border border-green-500/20 text-lg">
                    {currentLog.concept}
                  </div>
                </div>

                <div className="text-slate-300 leading-relaxed text-sm font-sans border-t border-slate-800 pt-6">
                  {currentLog.body}
                </div>
              </div>

              {/* Replay Button - Only if level is different from current */}
              {selectedLog !== null && level !== selectedLog && (
                <div className="mt-8 pt-6 border-t border-slate-800 flex justify-end">
                  <button
                    onClick={() => jumpToLevel(selectedLog)}
                    className="flex items-center gap-3 px-6 py-3 bg-slate-900 hover:bg-green-900/30 text-slate-300 hover:text-green-400 transition-all text-xs font-mono border border-slate-700 hover:border-green-500 uppercase tracking-widest group"
                  >
                    [ 重演模拟 (REPLAY) ]
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-700 font-mono">
              <BookOpen className="w-16 h-16 mb-4 opacity-10" />
              <div className="tracking-[0.5em] text-xs">等待指令 (AWAITING INPUT)</div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
