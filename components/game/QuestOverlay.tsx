'use client';

import { useMathStore } from '@/store/useMathStore';
import { useDialogueStore } from '@/store/useDialogueStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, CheckCircle, BookOpen, Circle } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function QuestOverlay() {
  const { level, isLevelComplete, targetA, openDataLog } = useMathStore();
  const { isOpen } = useDialogueStore();

  // Determine Quest Text based on Level
  const getQuestText = () => {
    switch (level) {
      case 0: return "第一章：起源站 (The Origin)";
      case 1: return "第二章：重力井 (Gravity Well)";
      case 2: return "第三章：漂流带 (The Drift)";
      case 3: return "第四章：奇点 (Singularity)";
      default: return "未知扇区 (Unknown Sector)";
    }
  };

  // Determine Quest Text based on Level

  return (
    <div className="absolute top-8 left-8 z-30 pointer-events-none">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 items-start"
      >
        {/* Main Quest Card */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-xl flex items-center gap-4 pointer-events-auto">
          <div className={`p-2 rounded-full ${isLevelComplete ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-400'}`}>
            {isLevelComplete ? <CheckCircle className="w-6 h-6" /> : <Circle className="w-6 h-6" />}
          </div>
          <div>
            <h2 className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Current Objective</h2>
            <div className="text-sm font-medium text-slate-200">
              {getQuestText()}
              {process.env.NODE_ENV === 'development' && (
                <span className="ml-2 text-xs text-yellow-500 font-mono bg-yellow-900/30 px-1 border border-yellow-700/50">
                  [DEV: L{level}]
                </span>
              )}
            </div>
          </div>

          {/* Handbook Toggle Button (Integrated into Card) */}
          <div className="h-8 w-[1px] bg-slate-700 mx-2" />
          <button
            onClick={openDataLog}
            className="p-2 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-green-400 transition-colors"
            title="查看数据日志 (Data Logs)"
          >
            <BookOpen className="w-5 h-5" />
          </button>
        </div>

        {/* Victory Message Extension */}
        <AnimatePresence>
          {isLevelComplete && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-900/80 backdrop-blur-md border border-green-500/50 p-4 rounded-xl shadow-xl w-full pointer-events-auto overflow-hidden"
            >
              <div className="text-sm font-bold text-yellow-400 mb-1">
                目标达成！(Objective Complete)
              </div>
              <div className="text-xs text-slate-300">
                当前板块常数已稳定。正在解析本区域数学日志...
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
