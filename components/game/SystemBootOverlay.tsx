"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMathStore } from '@/store/useMathStore'; // Assuming we use this for global state/audio
// import { playSound } from '@/lib/audio/synth'; // We might need a direct synth utility if store audio isn't enough

const BOOT_LINES = [
  "系统启动序列初始化...",
  "加载内核... [完成]",
  "挂载虚拟文件系统... [完成]",
  "正在连接量子中继... [完成]",
  "----------------------------------------",
  "纪元：2026.05.21",
  "坐标：柯伊伯带边缘",
  "载具：方舟号 (Class-V)",
  "身份：见习领航员 (ID: 9527)",
  "----------------------------------------",
  "...",
  "警告：检测到引力异常。",
  "严重警报：导航系统离线。",
  "正在启动紧急协议 V6..."
];

export default function SystemBootOverlay({ onComplete }: { onComplete: () => void }) {
  const { userName } = useMathStore();
  const [lines, setLines] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (currentIndex >= BOOT_LINES.length) {
      const timer = setTimeout(() => {
        onComplete();
      }, 2000); // 2s pause after full text before fading out
      return () => clearTimeout(timer);
    }

    const delay = Math.random() * 300 + 100; // Random typing speed
    const timer = setTimeout(() => {
      let lineText = BOOT_LINES[currentIndex];
      // Inject User Name dynamically
      if (lineText.includes("ID: 9527")) {
        lineText = lineText.replace("见习领航员", userName || "见习领航员");
      }

      setLines(prev => [...prev, lineText]);

      // Trigger simple beep sound here if possible
      // playSound('type'); 

      // Check for error line
      if (BOOT_LINES[currentIndex].includes("WARNING") || BOOT_LINES[currentIndex].includes("CRITICAL")) {
        setIsError(true);
      }

      setCurrentIndex(prev => prev + 1);
    }, delay);

    return () => clearTimeout(timer);
  }, [currentIndex, onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-black font-mono text-green-500 p-8 overflow-hidden flex flex-col justify-end pb-20 pointer-events-none">
      {/* Scanlines Effect */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />

      {/* CRT Flicker */}
      <motion.div
        className="absolute inset-0 bg-white opacity-[0.02] pointer-events-none"
        animate={{ opacity: [0.02, 0.05, 0.02] }}
        transition={{ duration: 0.1, repeat: Infinity, repeatType: "reverse" }}
      />

      {/* Text Output */}
      <div className="relative z-20 max-w-3xl w-full">
        {lines.map((line, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`mb-2 text-lg md:text-xl ${line.includes("WARNING") || line.includes("CRITICAL")
              ? "text-red-500 font-bold animate-pulse"
              : "text-green-500"
              }`}
          >
            <span className="opacity-50 mr-2">[{new Date().toLocaleTimeString()}]</span>
            {line}
          </motion.div>
        ))}
        <motion.div
          animate={{ opacity: [0, 1] }}
          transition={{ repeat: Infinity, duration: 0.5 }}
          className="w-3 h-5 bg-green-500 inline-block ml-1"
        />
      </div>

      {/* Red Alert Overlay - Activates on Error */}
      <AnimatePresence>
        {isError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-red-900 z-0 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </div>
  );
}
