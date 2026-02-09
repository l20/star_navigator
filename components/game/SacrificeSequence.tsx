'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useMathStore } from '@/store/useMathStore';
import { AlertTriangle, UserMinus, PowerOff } from 'lucide-react';
import Image from 'next/image';

export default function SacrificeSequence({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Sequence Timeline
    const timeline = [
      { t: 1000, fn: () => setStep(1) }, // Warning
      { t: 3000, fn: () => setStep(2) }, // Decision
      { t: 6000, fn: () => setStep(3) }, // Separation
      { t: 9000, fn: () => setStep(4) }, // Fade Out
      { t: 11000, fn: onComplete }       // End
    ];

    const timers = timeline.map(item => setTimeout(item.fn, item.t));
    return () => timers.forEach(clearTimeout);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[90] bg-black flex flex-col items-center justify-center overflow-hidden font-mono">

      {/* Background Pulse (Red for Danger) */}
      <motion.div
        animate={{ opacity: [0, 0.2, 0] }}
        transition={{ duration: 1, repeat: Infinity }}
        className="absolute inset-0 bg-red-900/50 pointer-events-none"
      />

      {/* STEP 1: WARNING */}
      {step >= 1 && step < 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="z-10 text-center space-y-4"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
            className="text-red-500 flex flex-col items-center"
          >
            <AlertTriangle className="w-20 h-20 mb-4" />
            <h1 className="text-4xl font-bold tracking-widest uppercase">质量临界警告</h1>
            <p className="text-red-400 mt-2">轨道极度不稳定 (TRAJECTORY UNSTABLE)</p>
          </motion.div>

          <div className="bg-red-950/50 border border-red-500/30 p-4 text-red-200 text-sm max-w-md mx-auto">
            错误: 总质量超标 (Mass Limit Exceeded)<br />
            警告: 无法通过奇点 (Singularity Traverse Failed)
          </div>
        </motion.div>
      )}

      {/* STEP 2: LIN'S DECISION */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="z-20 w-full max-w-4xl flex gap-8 items-center justify-center p-8 bg-black/80 backdrop-blur-sm border-y border-red-900/30"
        >
          {/* Lin's Photo (Grayscale, Glitching) */}
          <div className="relative w-32 h-40 border-2 border-red-500/50 grayscale opacity-80">
            <Image src="/lin.jpeg" alt="Lin" fill className="object-cover" />
            <div className="absolute inset-0 bg-red-500/10 mix-blend-overlay" />
          </div>

          <div className="text-left space-y-2">
            <div className="text-xs text-red-400 uppercase tracking-widest">收到强制覆盖指令 (OVERRIDE)</div>
            <h2 className="text-2xl text-white font-bold">执行主舱分离程序</h2>
            <div className="text-slate-400 text-sm">
              目标: <span className="text-white">指挥舱 (林书航)</span>
            </div>
            <div className="text-slate-400 text-sm">
              状态: <span className="text-red-500 font-bold blink">留守确认 (STAY_BEHIND)</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* STEP 3: SEPARATION */}
      {step === 3 && (
        <div className="z-30 w-full h-full relative">
          {/* The Ship (Player) Moving Forward */}
          <motion.div
            initial={{ x: "50%", y: "50%", scale: 1 }}
            animate={{ x: "100%", y: "20%", scale: 0.1, opacity: 0 }}
            transition={{ duration: 3, ease: "easeIn" }}
            className="absolute w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_20px_cyan]"
          >
            <div className="absolute top-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] text-cyan-200">
              应急舱 (你)
            </div>
          </motion.div>

          {/* The Captain (Staying Behind) */}
          <motion.div
            initial={{ x: "50%", y: "50%", scale: 1 }}
            animate={{ x: "30%", y: "80%", scale: 0.8, opacity: [1, 0.5, 0] }}
            transition={{ duration: 4, ease: "easeOut" }}
            className="absolute w-12 h-12 border border-red-500 bg-red-900/20 flex items-center justify-center"
          >
            <UserMinus className="w-6 h-6 text-red-500" />
            <div className="absolute top-14 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs text-red-500">
              林书航
            </div>
          </motion.div>

          {/* Center Text */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-white text-3xl font-bold tracking-[1em] uppercase"
            >
              分离程序执行中
            </motion.div>
          </div>
        </div>
      )}

      {/* FINAL WORDS */}
      {step === 4 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="z-40 text-center"
        >
          <div className="text-slate-500 text-sm mb-4">来自 老林 (LIN) 的最后通讯:</div>
          <h1 className="text-3xl md:text-5xl text-white font-light italic tracking-tight">
            "别回头，孩子。<br /><span className="text-cyan-400 not-italic font-bold">去看星星吧。</span>"
          </h1>
        </motion.div>
      )}

    </div>
  );
}
