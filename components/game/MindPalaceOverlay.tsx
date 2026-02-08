'use client';

import { useMathStore } from '@/store/useMathStore';
import { KNOWLEDGE_DB } from '@/lib/game/knowledgeContent';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, BrainCircuit, CheckCircle2, XCircle, ArrowRight, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { synth } from '@/lib/audio/synth';

export default function MindPalaceOverlay() {
  const { level, isMindPalaceOpen, setMindPalaceOpen } = useMathStore();
  const [step, setStep] = useState<'CONCEPT' | 'QUIZ' | 'SUCCESS'>('CONCEPT');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState(0); // New: Track attempts
  const [isHesitating, setIsHesitating] = useState(false); // New: Track hesitation
  const [feedback, setFeedback] = useState<React.ReactNode | null>(null);

  // Reset state when opening
  useEffect(() => {
    if (isMindPalaceOpen) {
      setStep('CONCEPT');
      setSelectedOption(null);
      setIsWrong(false);
      setWrongAttempts(0);
      setIsHesitating(false);
      setFeedback(null);
      // Play entry sound?
    }
  }, [isMindPalaceOpen, level]);

  // Hesitation Detection Timer
  useEffect(() => {
    if (step === 'QUIZ' && !selectedOption) {
      const timer = setTimeout(() => {
        setIsHesitating(true);
      }, 15000); // 15s hesitation
      return () => clearTimeout(timer);
    }
    // Clear hesitation if user selects something
    setIsHesitating(false);
  }, [step, selectedOption]);

  if (!isMindPalaceOpen) return null;

  const content = KNOWLEDGE_DB[level];
  if (!content) return null;

  const handleOptionSelect = (index: number) => {
    if (!content.quiz) return;

    setSelectedOption(index);
    synth.playClick();

    if (index === content.quiz.correctIndex) {
      // Correct
      setIsWrong(false);
      synth.playSuccess();
      setTimeout(() => {
        setStep('SUCCESS');
      }, 500);
    } else {
      // Wrong
      setIsWrong(true);
      setWrongAttempts(prev => prev + 1);
      synth.playError();
      // Show specific feedback if available
      if (content.quiz.wrongFeedback && content.quiz.wrongFeedback[index]) {
        setFeedback(content.quiz.wrongFeedback[index]);
      } else {
        setFeedback("逻辑错误。请重新检查参数关联。");
      }
    }
  };

  const handleResume = () => {
    synth.playClick();
    setMindPalaceOpen(false);
    // Optionally trigger a callback or next dialogue logic here handled by the level script watching the store
  };

  return (
    <div className="absolute inset-0 z-[60] flex items-center justify-center bg-blue-950/90 backdrop-blur-xl font-mono">
      {/* Blueprint Grid Background */}
      <div className="absolute inset-0 opacity-10 pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      <div className="max-w-5xl w-full mx-4 flex gap-8 relative">
        {/* Left: Holographic Deer Tutor - Tech Style */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="hidden md:flex flex-col items-center w-64 shrink-0 mt-12"
        >
          <div className="relative w-48 h-48 border-2 border-cyan-500/30 flex items-center justify-center group overflow-hidden bg-cyan-950/20">
            {/* Tech Corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400" />

            <img
              src="/deer.jpeg"
              alt="Deer Tutor"
              className="w-full h-full object-cover opacity-90 mix-blend-screen"
            />

            {/* Scanline */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent h-4 w-full animate-scan" />
          </div>

          <div className="mt-6 text-center w-full">
            <h2 className="text-cyan-400 font-mono text-2xl font-bold tracking-widest border-b border-cyan-500/30 pb-2">鹿 (DEER)</h2>
            <div className="flex justify-between text-[10px] text-cyan-600/80 uppercase mt-2 font-bold tracking-wider">
              <span>逻辑核心 (LOGIC CORE)</span>
              <span>在线 (ONLINE)</span>
            </div>
            <p className="text-cyan-600/60 text-xs uppercase mt-2 border-l-2 border-cyan-500/30 pl-2 text-left">
              神经连接接口 // v6.0
            </p>
          </div>

          {/* Avatar Hint Bubble */}
          <AnimatePresence>
            {(step === 'QUIZ' && (isWrong || isHesitating) && content.quiz?.hint) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 5 }}
                className="mt-6 mx-4 p-4 bg-cyan-950/40 border-l-2 border-cyan-500 text-cyan-200 text-xs font-mono relative leading-relaxed shadow-lg backdrop-blur-sm"
              >
                <div className="flex gap-2 mb-2 text-cyan-500 font-bold tracking-widest uppercase items-center">
                  <Sparkles className="w-3 h-3" />
                  <span>
                    {isHesitating ? '检测到思维停滞 (ANALYSIS)' : '辅助建议 (ADVICE)'}:
                  </span>
                </div>
                {/* Show Deep Hint if struggling (2+ wrong attempts) or hesitating for a long time? */}
                {/* Actually, show Hint first. If wrongAttempts >= 2, show Deep Hint if exists */}
                {
                  (wrongAttempts >= 2 && content.quiz.deepHint)
                    ? content.quiz.deepHint
                    : content.quiz.hint
                }
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Right: Interaction Panel - Tech Flat */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 bg-slate-950/80 border border-indigo-500/30 backdrop-blur-md shadow-2xl flex flex-col min-h-[400px] max-h-[85vh] relative"
        >
          {/* Panel Tech Corners */}
          <div className="absolute -top-1 -left-1 w-6 h-6 border-t-2 border-l-2 border-indigo-500" />
          <div className="absolute -top-1 -right-1 w-6 h-6 border-t-2 border-r-2 border-indigo-500" />
          <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-2 border-l-2 border-indigo-500" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-2 border-r-2 border-indigo-500" />

          {/* Header */}
          <div className="h-16 border-b border-white/10 flex items-center px-8 bg-black/20 justify-between">
            <div className="flex items-center gap-3 text-indigo-400">
              <BrainCircuit className="w-6 h-6" />
              <span className="font-bold tracking-[0.2em] uppercase">思维殿堂 (MIND PALACE) // Lv.{level}</span>
            </div>
            <div className="flex gap-1">
              <div className={`w-8 h-1 ${step === 'CONCEPT' ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]' : 'bg-white/10'}`} />
              <div className={`w-8 h-1 ${step === 'QUIZ' ? 'bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.8)]' : 'bg-white/10'}`} />
              <div className={`w-8 h-1 ${step === 'SUCCESS' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-white/10'}`} />
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8 flex-1 flex flex-col relative overflow-y-auto">
            <AnimatePresence mode="wait">
              {step === 'CONCEPT' && (
                <motion.div
                  key="concept"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <div>
                    <div className="text-xs text-slate-500 uppercase tracking-widest mb-2">当前课题 (SUBJECT)</div>
                    <h1 className="text-3xl font-bold text-white uppercase tracking-wide">{content.title}</h1>
                  </div>

                  <div className="flex gap-4 items-stretch">
                    <div className="w-1 bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]" />
                    <div className="flex-1 bg-cyan-950/20 p-6 border border-cyan-500/20">
                      <div className="text-xs text-cyan-500 mb-2 uppercase tracking-widest">可视化分析 (VISUALIZATION)</div>
                      <div className="text-2xl text-cyan-300 font-mono">
                        {content.concept}
                      </div>
                    </div>
                  </div>

                  <div className="prose prose-invert max-w-none text-slate-300 leading-relaxed text-sm border-t border-white/10 pt-6">
                    {content.body}
                  </div>

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => { synth.playClick(); setStep('QUIZ'); }}
                      className="group flex items-center gap-2 px-8 py-3 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500 transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] uppercase tracking-widest text-sm font-bold"
                    >
                      [ 启动测试程序 ] <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 'QUIZ' && content.quiz && (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <div className="border border-indigo-500/30 p-6 bg-indigo-950/10 relative">
                    <div className="absolute top-0 right-0 p-2 opacity-20">
                      <Activity className="w-12 h-12" />
                    </div>
                    <div className="text-indigo-400 text-xs uppercase tracking-widest mb-2">查询参数 (QUERY)</div>
                    <h3 className="text-xl text-indigo-100 font-medium mb-4 relative z-10 leading-relaxed">
                      {content.quiz.question}
                    </h3>

                    <div className="space-y-3 mt-6">
                      {content.quiz.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleOptionSelect(idx)}
                          disabled={selectedOption === idx && isWrong}
                          className={`w-full text-left p-4 border-l-4 border-r transition-all flex items-center justify-between group relative overflow-hidden
                            ${selectedOption === idx
                              ? isWrong
                                ? 'bg-red-500/20 border-red-500 border-r-red-500 text-red-200'
                                : 'bg-green-500/20 border-green-500 border-r-green-500 text-green-200'
                              : 'bg-white/5 border-white/20 border-r-transparent hover:bg-white/10 text-slate-300 hover:border-indigo-400'
                            }`}
                        >
                          <span className="flex items-center gap-4 z-10 relative">
                            <span className="text-xs font-mono opacity-50 text-indigo-400">
                              0{idx + 1} //
                            </span>
                            {option}
                          </span>
                          {selectedOption === idx && (
                            isWrong ? <XCircle className="w-5 h-5 text-red-400" /> : <CheckCircle2 className="w-5 h-5 text-green-400" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Area */}
                  {isWrong && feedback && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="p-4 bg-red-950/20 border-l-4 border-red-600 text-red-300 text-sm flex gap-3 items-start"
                    >
                      <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <div className="text-xs font-bold mb-1 opacity-70">错误日志 (ERROR LOG):</div>
                        {feedback}
                      </div>
                    </motion.div>
                  )}


                </motion.div>
              )}

              {step === 'SUCCESS' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center h-full text-center space-y-8 py-8"
                >
                  <div className="w-24 h-24 border-2 border-green-500/50 flex items-center justify-center relative">
                    <div className="absolute inset-0 border border-green-500/20 animate-ping" />
                    <CheckCircle2 className="w-12 h-12 text-green-400" />

                    {/* Tech Corners */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-green-500" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-green-500" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500" />
                  </div>

                  <div>
                    <h2 className="text-3xl font-bold text-white uppercase tracking-widest mb-2">模拟完成 (COMPLETE)</h2>
                    <div className="text-green-500 text-xs font-mono bg-green-900/20 px-3 py-1 inline-block border border-green-500/30">
                      同步率: 100%
                    </div>
                  </div>

                  <p className="text-slate-300 max-w-md mx-auto leading-relaxed border-t border-instagram-500/30 pt-4 border-white/10">
                    {content.quiz?.explanation}
                  </p>

                  <p className="text-indigo-300 text-sm font-mono border border-indigo-500/20 p-2 w-full max-w-sm mx-auto bg-indigo-950/30">
                    {'>>'} 参数同步完成 | 权限已获取
                  </p>

                  <button
                    onClick={handleResume}
                    className="mt-4 px-12 py-4 bg-white text-black font-bold hover:bg-slate-200 transition-colors shadow-[0_0_30px_rgba(255,255,255,0.2)] uppercase tracking-widest text-sm relative group overflow-hidden"
                  >
                    <span className="relative z-10">[ 断开神经连接 ]</span>
                    <div className="absolute inset-0 bg-cyan-400/20 translate-y-full group-hover:translate-y-0 transition-transform" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
