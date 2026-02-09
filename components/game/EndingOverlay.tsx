'use client';

import { motion } from 'framer-motion';
import { useMathStore } from '@/store/useMathStore';
import MathFormula from '@/components/ui/MathFormula';
import { BookOpen, X, RefreshCw } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function EndingOverlay() {
  const { userName, resetProgress } = useMathStore();
  const [showCredits, setShowCredits] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowCredits(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleReboot = () => {
    resetProgress();
    // Allow state to update locally and persist before reloading
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center text-center overflow-hidden">
      {/* Starfield Background */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black" />
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            initial={{
              x: Math.random() * 100 + 'vw',
              y: Math.random() * 100 + 'vh',
              scale: Math.random() * 0.5 + 0.5,
              opacity: Math.random()
            }}
            animate={{
              y: [null, Math.random() * 100 + 'vh'],
              opacity: [0.2, 1, 0.2]
            }}
            transition={{
              duration: 10 + Math.random() * 20,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ width: Math.random() * 3 + 'px', height: Math.random() * 3 + 'px' }}
          />
        ))}
      </div>

      {/* Parabola & Coordinate System Background */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center opacity-30">
        <svg width="100%" height="100%" viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice">
          {/* Grid Lines */}
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />

          {/* Axes */}
          <motion.path
            d="M 500 0 L 500 600 M 0 300 L 1000 300"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          {/* Parabola Curve: y = x^2 (Visual) -> Opening Upwards */}
          {/* In SVG coords: Vertex at (500, 450). Ends at (200, 100) and (800, 100). */}
          <motion.path
            d="M 200 100 Q 500 650 800 100"
            fill="none"
            stroke="url(#gradient-parabola)"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.5, duration: 3, ease: "easeInOut" }}
          />

          <defs>
            <linearGradient id="gradient-parabola" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="1" />
              <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="relative z-10 max-w-6xl w-full px-6 flex flex-col items-center">
        {/* 1. Title Section (Top) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-indigo-600 mb-4 tracking-tighter uppercase leading-tight">
            抛物线计划
          </h1>
          <div className="h-1 w-32 bg-indigo-500 mx-auto rounded-full shadow-[0_0_15px_rgba(99,102,241,0.8)]" />
        </motion.div>

        {/* 2. Main Grid: Narrative (Left) & Credits (Right) */}
        <div className="grid md:grid-cols-2 gap-16 w-full items-start">
          {/* Left: Narrative */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-slate-300 font-mono text-sm md:text-base leading-relaxed space-y-6 bg-slate-900/50 p-8 border-l-2 border-indigo-500 backdrop-blur-sm text-left h-full"
          >
            <p>
              <span className="text-cyan-400 font-bold text-lg">小鹿 (Deer):</span><br />
              <span className="italic opacity-80">“我们抵达了新家园。引力读数稳定。”</span>
            </p>
            <p>
              “大叔（林船长）留在了视界另一端……但他把未来交给了我们。”
            </p>
            <p>
              “他教会了我什么是<span className="text-amber-500 border-b border-amber-500/30 pb-0.5 mx-1">人性</span>。
              而你，领航员 <strong>{userName}</strong>，你教会了我们什么是<span className="text-indigo-400 border-b border-indigo-500/30 pb-0.5 mx-1">数学真理</span>。”
            </p>
            <p className="text-xs text-slate-500 pt-6 border-t border-slate-800 italic">
              "所有的这些 a, h, k，不仅是枯燥的字母……<br />
              它们是我们飞越绝望的翅膀，是文明存续的证明。"
            </p>
          </motion.div>

          {/* Right: Credits */}
          {showCredits && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="md:border-l text-[8px] border-slate-800 md:pl-12 py-4 flex flex-col justify-center h-full text-left"
            >
              <div className="space-y-8">
                {/* <div>
                  <div className="uppercase tracking-[0.2em] mb-4 text-cyan-500/70 text-xs font-bold font-mono">
                    // Project Architect
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-1">Loksin</h3>
                  <p className="text-slate-500 text-xs">Lead Developer & Creator</p>
                </div> */}

                <div className="space-y-4">
                  {/* <div className="uppercase tracking-[0.2em] mb-2 text-indigo-500/70 text-xs font-bold font-mono">
                    // AI Collaboration
                  </div> */}

                  <div className="space-y-3 text-[10px] text-slate-400 font-mono leading-relaxed">
                    <div className="group">
                      <span className="text-blue-400 font-bold block mb-0.5 group-hover:text-blue-300 transition-colors">豆包大模型 (Doubao)</span>
                      <span className="opacity-60">教案构建, 剧本润色, 角色设定, 美术素材生成</span>
                    </div>

                    <div className="group">
                      <span className="text-indigo-400 font-bold block mb-0.5 group-hover:text-indigo-300 transition-colors">Gemini 3 Pro</span>
                      <span className="opacity-60">核心策划, 剧本架构, UI/UX设计, 全栈开发</span>
                    </div>

                    <div className="group">
                      <span className="text-purple-400 font-bold block mb-0.5 group-hover:text-purple-300 transition-colors">Claude 4.5 Sonnet</span>
                      <span className="opacity-60">复杂逻辑编码, 算法优化, 代码审查</span>
                    </div>

                    <div className="group">
                      <span className="text-pink-400 font-bold block mb-0.5 group-hover:text-pink-300 transition-colors">Suno AI</span>
                      <span className="opacity-60">背景音乐生成, 音效合成</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-800/50">
                  <p className="text-[10px] text-slate-600 leading-normal">
                    声明：本作品全场景内容均由 AI 大语言模型辅助生成。
                    <br />如有雷同，纯属巧合 (Coincidence).
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* 3. Buttons (Bottom) */}
        {showCredits && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-4 flex gap-8 justify-center w-full"
          >
            <button
              onClick={() => setShowNotes(true)}
              className="group min-w-[200px] relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-800/80 hover:bg-cyan-950 text-slate-300 hover:text-cyan-400 border border-slate-600 hover:border-cyan-500 rounded-lg transition-all duration-300 shadow-lg hover:shadow-cyan-500/20"
            >
              <BookOpen className="w-5 h-5" />
              <span className="font-mono text-sm tracking-widest uppercase">查看航行笔记</span>
            </button>

            <button
              onClick={handleReboot}
              className="group min-w-[200px] relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 hover:bg-indigo-950 text-slate-400 hover:text-white border border-slate-700 hover:border-indigo-500 rounded-lg transition-all duration-300 shadow-lg hover:shadow-indigo-500/20"
            >
              <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
              <span className="font-mono text-sm tracking-widest uppercase">重启系统</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* Flight Notes Modal */}
      {showNotes && (
        <div className="fixed inset-0 z-[110] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-xl border border-slate-700 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-950">
              <div className="flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-cyan-400" />
                <h2 className="text-xl font-bold text-white tracking-widest uppercase font-mono">领航员笔记 (NAVIGATOR_LOG)</h2>
              </div>
              <button onClick={() => setShowNotes(false)} className="text-slate-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 font-sans">
              {/* 1. Definition */}
              <div className="space-y-2">
                <h3 className="text-cyan-400 font-bold border-l-4 border-cyan-500 pl-3">1. 二次函数基础 (The Parabola)</h3>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                  <MathFormula tex="y = ax^2" block className="text-lg mb-2" />
                  <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
                    <li>系数 <MathFormula tex="a" /> 决定开口方向和大小。</li>
                    <li><MathFormula tex="a > 0" /> : 开口向上 <MathFormula tex="\cup" /> (支撑力)</li>
                    <li><MathFormula tex="a < 0" /> : 开口向下 <MathFormula tex="\cap" /> (压力)</li>
                    <li><MathFormula tex="|a|" /> 越大，开口越窄（力量越集中）。</li>
                  </ul>
                </div>
              </div>

              {/* 2. Vertical Shift */}
              <div className="space-y-2">
                <h3 className="text-cyan-400 font-bold border-l-4 border-cyan-500 pl-3">2. 垂直位移 (Vertical Shift)</h3>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                  <MathFormula tex="y = ax^2 + k" block className="text-lg mb-2" />
                  <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
                    <li>常数 <MathFormula tex="k" /> 控制上下平移。</li>
                    <li>口诀：<b>上加下减</b>。</li>
                    <li><MathFormula tex="+k" /> : 向上移动 <MathFormula tex="k" /> 个单位。</li>
                  </ul>
                </div>
              </div>

              {/* 3. Horizontal Shift */}
              <div className="space-y-2">
                <h3 className="text-cyan-400 font-bold border-l-4 border-cyan-500 pl-3">3. 水平位移 (Horizontal Shift)</h3>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700/50">
                  <MathFormula tex="y = a(x-h)^2" block className="text-lg mb-2" />
                  <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
                    <li>常数 <MathFormula tex="h" /> 控制左右平移。</li>
                    <li>口诀：<b>左加右减</b>（括号内符号相反）。</li>
                    <li><MathFormula tex="(x-3)^2" /> : 向<b>右</b>移动 3 (h=3)。</li>
                    <li><MathFormula tex="(x+3)^2" /> : 向<b>左</b>移动 3 (h=-3)。</li>
                  </ul>
                </div>
              </div>

              {/* 4. Vertex Form */}
              <div className="space-y-2">
                <h3 className="text-purple-400 font-bold border-l-4 border-purple-500 pl-3">4. 顶级公式：顶点式 (Vertex Form)</h3>
                <div className="bg-slate-800/50 p-4 rounded-lg border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]">
                  <MathFormula tex="y = a(x-h)^2 + k" block className="text-xl mb-4 text-purple-300" />
                  <ul className="text-slate-300 text-sm space-y-1 list-disc list-inside">
                    <li><b>顶点 (Vertex)</b> 坐标为 <MathFormula tex="(h, k)" />。</li>
                    <li>宇宙中所有抛物线运动的终极真理。</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-700 bg-slate-950 flex justify-end">
              <button onClick={() => setShowNotes(false)} className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded transition-colors">
                关闭 (Close)
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
