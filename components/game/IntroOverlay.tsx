'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMathStore } from '@/store/useMathStore';
import { AlertTriangle } from 'lucide-react';
import { synth } from '@/lib/audio/synth';

export default function IntroOverlay() {
  const { storyMode } = useMathStore();
  const [show, setShow] = useState(true);
  const [textStage, setTextStage] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [animStage, setAnimStage] = useState(0);

  // Auto-advance text stages (Context)
  useEffect(() => {
    if (!show || isAnimating) return;

    if (textStage < 2) {
      const timer = setTimeout(() => setTextStage(prev => prev + 1), 2000);
      return () => clearTimeout(timer);
    }
  }, [textStage, show, isAnimating]);

  // Animation Sequence Logic
  useEffect(() => {
    if (!isAnimating) return;

    // Timeline:
    // 0s: Start (Ship appears)
    // 2s: Black Hole distortion intensifies
    // 4s: Warning / Glitch
    // 6s: Fade out -> Start Game

    const sequence = async () => {
      // Silence is golden
      setAnimStage(1); // Ship moving

      setTimeout(() => {
        setAnimStage(2); // Gravity Well
      }, 2500);

      setTimeout(() => {
        setAnimStage(3); // Critical Failure
      }, 5000);

      setTimeout(() => {
        setShow(false); // End
      }, 7000);
    };

    sequence();
  }, [isAnimating]);

  if (!show) return null;

  // Render Cinematic Animation
  if (isAnimating) {
    return (
      <div className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden cursor-none font-mono">

        {/* Background Layer - The Black Hole Image */}
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 8, ease: "easeOut" }}
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/blackhole_bg.png')",
            filter: "brightness(0.8) contrast(1.2)"
          }}
        />

        {/* Cinematic Vignette - Rectangular masking for tech feel? No, vignette is fine */}
        <div className="absolute inset-0 bg-radial-gradient-to-c from-transparent via-transparent to-black opacity-80 z-10" />

        {/* Central Event Horizon - Tech HUD overlay instead of round border */}
        <motion.div
          animate={animStage >= 2 ? { scale: [1, 1.2], opacity: [0.5, 0.8] } : {}}
          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
          className="absolute w-[400px] h-[400px] border border-purple-500/10 z-0 flex items-center justify-center opacity-30"
        >
          {/* Tech Crosshair */}
          <div className="absolute top-0 bottom-0 w-[1px] bg-purple-500/20" />
          <div className="absolute left-0 right-0 h-[1px] bg-purple-500/20" />

          {/* Corner Brackets */}
          <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-purple-500/30" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t border-r border-purple-500/30" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b border-l border-purple-500/30" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-purple-500/30" />
        </motion.div>

        {/* The Ark (Tiny Square Pixel representation for "Tech" feel) */}
        <motion.div
          initial={{ x: -400, y: 200, opacity: 0 }}
          animate={animStage >= 2
            ? { x: 50, y: 50, opacity: 1 }  // Being pulled in
            : { x: -100, y: 100, opacity: 1 } // Drifting
          }
          transition={{ duration: 6, ease: "easeInOut" }}
          className="absolute z-20"
        >
          {/* The Ship: A tiny square pixel instead of round dot */}
          <div className="relative group">
            <div className="w-1.5 h-1.5 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
            {/* Engine Trail - sharp line */}
            <motion.div
              animate={{ opacity: [0.4, 0.8, 0.4], scaleX: [1, 1.5, 1] }}
              transition={{ repeat: Infinity, duration: 0.1 }}
              className="absolute top-1/2 right-full w-6 h-[1px] bg-cyan-400 origin-right" // Sharp line
            />
          </div>
        </motion.div>

        {/* Glitch Overlay - Only on Critical Failure */}
        <AnimatePresence>
          {animStage >= 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 bg-red-500/20 mix-blend-overlay pointer-events-none"
            >
              <div className="w-full h-full bg-[url('/grid.svg')] opacity-20 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* UI Overlay - Tech Flat Style */}
        <div className="absolute bottom-16 z-30 w-full text-center font-mono space-y-4 pointer-events-none">
          <AnimatePresence mode="wait">
            {animStage === 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="inline-block"
              >
                <div className="flex items-center gap-2 bg-black/60 border-l-2 border-cyan-500 px-4 py-2 backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 bg-cyan-500 animate-pulse" />
                  <div className="text-xs text-cyan-500 tracking-[0.2em] uppercase">
                    距离视界 (DIST): 4.2 AU
                  </div>
                </div>
              </motion.div>
            )}
            {animStage === 2 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="inline-block"
              >
                <div className="flex items-center gap-3 bg-yellow-900/20 border-2 border-yellow-500/50 px-6 py-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500 animate-pulse" />
                  <div className="text-sm text-yellow-500 tracking-[0.2em] font-bold">
                    引力切变 &gt; 船体极限 (SHEAR &gt; HULL)
                  </div>
                </div>
              </motion.div>
            )}
            {animStage === 3 && (
              <motion.div
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block bg-red-950/80 border-t-4 border-b-4 border-red-600 px-12 py-4"
              >
                <div className="text-white text-3xl font-black tracking-[0.5em] uppercase drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] glitch-effect">
                  信号丢失 (CONNECTION LOST)
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Render Static Intro (Text Stages)
  return (
    <div className="absolute inset-0 z-[100] bg-black flex flex-col items-center justify-center font-mono p-10 cursor-pointer">
      <div className="max-w-2xl w-full space-y-6 select-text cursor-text" onClick={(e) => e.stopPropagation()}>

        {/* Stage 0: Context Alert */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-500 text-xs tracking-[0.2em] border-l-2 border-red-500 pl-3"
        >
          {storyMode
            ? "系统警告：检测到强引力井 (GRAVITY_WELL_DETECTED)"
            : "致命错误：几何结构丢失 (GEOMETRY_NOT_FOUND)"
          }
        </motion.div>

        {/* Stage 1: The Narrative Text */}
        {textStage >= 1 && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-slate-300 text-lg leading-relaxed border-l-2 border-slate-700 pl-4 bg-slate-900/20 py-2" // Tech block style
          >
            {storyMode ? (
              <>
                <p className="mb-2">星历 2026 年，方舟号在黑洞边缘失去动力。</p>
                <p className="mb-2">唯一的希望是利用<span className="text-cyan-400 font-bold bg-cyan-950/30 px-1">曲率引擎 (Quadratic Drive)</span>。</p>
                <p>老林船长（林述航）和 人工智能助理（小鹿） 正等待着来自 300 年前的指令。</p>
              </>
            ) : (
              <>
                <p className="mb-2">公元 2000 年，“大线性化”事件爆发。</p>
                <p className="mb-2">宇宙中所有的<span className="text-white font-bold bg-slate-800 px-1">曲率 (Curvature)</span> 被不明力量抹除。</p>
                <p>星球变成了立方体，光线不再弯曲，引力场失效。</p>
              </>
            )}
          </motion.div>
        )}

        {/* Stage 2: The Action Button */}
        {textStage >= 2 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-12 cursor-pointer group inline-block" // Inline block for button feel
            onClick={() => {
              if (storyMode) {
                setIsAnimating(true);
              } else {
                setShow(false); // Classic mode direct start
              }
            }}
          >
            <div className="border border-green-500/30 bg-green-950/10 p-6 group-hover:bg-green-950/20 group-hover:border-green-500/60 transition-all relative">
              {/* Decoration Corners */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-green-500" />
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-green-500" />
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-green-500" />
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-green-500" />

              <div className="text-green-500 text-2xl font-bold mb-2 group-hover:text-green-400 transition-colors">
                {storyMode
                  ? "> 正在接入：深空指挥中心 (Commander)"
                  : "> 正在唤醒：常数调律师 (Constant Tuner)"
                }
              </div>
              <div className="text-slate-500 text-sm animate-pulse flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-green-500" /> {/* Square dot */}
                {storyMode
                  ? "[初始化引力波通讯]" // Hard Sci-Fi
                  : "[点击任意处接入神经漫游]"
                }
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
