'use client';

import { useMathStore } from "@/store/useMathStore";
import { synth } from "@/lib/audio/synth"; // Import Synth
import { useEffect, useState } from "react";
import { useDialogueStore } from "@/store/useDialogueStore";
import { HINT_WRONG_DIRECTION, HINT_TOO_STEEP, HINT_ALMOST_THERE } from "@/lib/game/level1";

// Helper to generate SVG path for a parabola
// M startX startY Q controlX controlY endX endY (Quad Bezier approx)
// OR just polyline for accuracy
function generateParabolaPath(a: number, h: number, k: number, width: number, height: number, steps = 20) {
  let d = "";
  // We only care about the bridge range roughly but let's draw full screen width
  // range: x = 0 to 800
  // y = a(x-h)^2 + k

  for (let x = 0; x <= width; x += width / steps) {
    const y = a * Math.pow(x - h, 2) + k;
    if (x === 0) d += `M ${x} ${y}`;
    else d += ` L ${x} ${y}`;
  }
  return d;
}

// Math Concepts Database
import { useMemo } from 'react';

export default function MathOverlay() {
  const { a, h, k, setA, setH, setK, targetA, attempts, incrementAttempts, isLevelComplete, lockedParams, targetH, targetK } = useMathStore();
  const { startDialogue, isOpen } = useDialogueStore();

  // Derive paths directly (no useState/useEffect needed)
  const pathCurrent = useMemo(() => generateParabolaPath(a, h, k, 800, 600), [a, h, k]);

  const pathTarget = useMemo(() => {
    // Fix: Use targetH and targetK if they exist, otherwise use current H/K
    const targetAVal = targetA !== undefined ? targetA : a;
    const targetHVal = targetH !== undefined ? targetH : h;
    const targetKVal = targetK !== undefined ? targetK : k;

    // Only set path if there is ANY target
    if (targetA !== undefined || targetH !== undefined || targetK !== undefined) {
      return generateParabolaPath(targetAVal, targetHVal, targetKVal, 800, 600);
    }
    return "";
  }, [a, h, k, targetA, targetH, targetK]);

  // Hint Logic System
  useEffect(() => {
    if (isLevelComplete || isOpen || attempts === 0) return;

    // Trigger hint every 5 meaningful attempts if still creating issues
    if (attempts % 5 === 0) {
      // Logic Priority 1: Wrong Direction (a > 0 instead of a < 0)
      if (a > 0 && targetA && targetA < 0) {
        startDialogue(HINT_WRONG_DIRECTION);
        return;
      }

      // Logic Priority 2: Too Steep (abs(a) > target * 2)
      if (targetA && Math.abs(a) > Math.abs(targetA) * 2) {
        startDialogue(HINT_TOO_STEEP);
        return;
      }

      // Logic Priority 3: Almost There
      if (targetA && Math.abs(a - targetA) < 0.001) {
        startDialogue(HINT_ALMOST_THERE);
        return;
      }
    }
  }, [attempts, a, targetA, isLevelComplete, isOpen, startDialogue]);

  // Calculate "Hot/Cold" Color
  const getCurveColor = () => {
    // If we have H or K targets, check those too
    // For simplicity, let's just use a combined error metric
    let errorScore = 0;

    if (targetA !== undefined) errorScore += Math.abs(a - targetA) * 1000; // Scale small A diffs
    if (targetH !== undefined) errorScore += Math.abs(h - targetH) * 0.03; // Scale pixel diffs (30px * 0.03 ~= 1.0)
    if (targetK !== undefined) errorScore += Math.abs(k - targetK) * 0.03;

    // Thresholds (heuristic)
    if (errorScore < 1.0) return "#4ade80"; // Green (Perfect)
    if (errorScore < 3.0) return "#facc15"; // Yellow (Close)
    return "#f87171"; // Red (Far)
  };

  const curveColor = getCurveColor();
  // Re-calc error for boolean check (or refactor to state, but this is fine)
  const getIsClose = () => {
    let errorScore = 0;
    if (targetA !== undefined) errorScore += Math.abs(a - targetA) * 1000;
    if (targetH !== undefined) errorScore += Math.abs(h - targetH) * 0.01;
    if (targetK !== undefined) errorScore += Math.abs(k - targetK) * 0.01;
    return errorScore < 1.0;
  }
  const isClose = getIsClose();

  return (
    <div className="absolute inset-0 pointer-events-none">
      <svg className="w-full h-full overflow-visible">
        {/* Target Ghost Curve (Dashed) */}
        {pathTarget && (
          <path
            d={pathTarget}
            stroke="#ffffff"
            strokeWidth="2"
            fill="none"
            strokeDasharray="8 8"
            className="opacity-30"
          />
        )}

        {/* Current Curve (Hot/Cold Feedback) */}
        <path
          d={pathCurrent}
          stroke={curveColor}
          strokeWidth={isClose ? "4" : "3"}
          fill="none"
          className="opacity-60 transition-colors duration-300 ease-out"
          filter={isClose ? "drop-shadow(0 0 8px #4ade80)" : ""}
        />
      </svg>

      {/* Math Controls (Clickable) - Tech Flat */}
      <div className="absolute bottom-0 transform -translate-y-1/2 left-1/2 transform -translate-x-1/2 bg-slate-950/90 p-8 border border-slate-600 pointer-events-auto shadow-2xl backdrop-blur-md w-[90vw] max-w-[540px] max-h-[80vh] overflow-y-auto z-50">
        {/* Tech Corners */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-slate-400" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-slate-400" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-slate-400" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-slate-400" />

        {/* Header Label */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 bg-slate-900 px-3 text-[10px] text-slate-500 uppercase tracking-widest border border-slate-700 whitespace-nowrap flex items-center gap-4 pointer-events-auto">
          <span>星舰飞控系统 (FLIGHT CONTROL)</span>
          {/* Audio Toggle */}
          <button
            onClick={() => useMathStore.getState().toggleMusic()}
            className="hover:text-cyan-400 transition-colors"
            title={useMathStore.getState().isMusicMuted ? "Unmute BGM" : "Mute BGM"}
          >
            {useMathStore.getState().isMusicMuted ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><line x1="23" x2="17" y1="9" y2="15" /><line x1="17" x2="23" y1="9" y2="15" /></svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" /><path d="M19.07 4.93a10 10 0 0 1 0 14.14" /></svg>
            )}
          </button>
        </div>

        {/* The Equation Display */}
        <div className="flex justify-center items-center gap-2 mb-8 text-xl select-none font-mono">
          <span className="text-cyan-400">y = </span>
          <div
            className={`px-4 py-2 border font-bold min-w-[6rem] text-center transition-colors duration-300 relative group`}
            style={{
              color: curveColor,
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              borderColor: curveColor
            }}
          >
            {/* Tiny tech markers on the value box */}
            <div className="absolute top-0 left-0 w-1 h-1 bg-current opacity-50" />
            <div className="absolute bottom-0 right-0 w-1 h-1 bg-current opacity-50" />

            {a.toFixed(3)}
          </div>
          <span className="text-slate-400 ml-2">(x - {h.toFixed(0)})² + {k.toFixed(0)}</span>
        </div>

        {/* Sliders */}
        <div className="space-y-6">
          {/* Control A (Curvature) */}
          {!lockedParams.includes('a') && (
            <div className="flex items-center gap-4 group">
              <span className="text-yellow-400 font-mono w-8 font-bold text-center border-r border-slate-700 pr-4">a</span>
              <div className="relative w-full h-6 flex items-center">
                {/* Custom Track Line */}
                <div className="absolute w-full h-0.5 bg-slate-700" />
                {/* Center Marker */}
                <div className="absolute left-1/2 w-[1px] h-3 bg-slate-500 transform -translate-x-1/2" />

                <input
                  type="range"
                  min="-0.005"
                  max="0.005"
                  step="0.0001"
                  value={a}
                  onChange={(e) => {
                    setA(parseFloat(e.target.value));
                    synth.playClick();
                  }}
                  onPointerUp={incrementAttempts}
                  className="w-full h-6 bg-transparent appearance-none cursor-pointer accent-yellow-400 hover:accent-yellow-300 transition-colors touch-none absolute z-10"
                />
              </div>
              <span className="text-xs text-slate-600 font-mono w-16 text-right">曲率</span>
            </div>
          )}

          {/* Control H (Horizontal) */}
          {!lockedParams.includes('h') && (
            <div className="flex items-center gap-4 group">
              <span className="text-blue-400 font-mono w-8 font-bold text-center border-r border-slate-700 pr-4">h</span>
              <div className="relative w-full h-6 flex items-center">
                <div className="absolute w-full h-0.5 bg-slate-700" />
                <input
                  type="range"
                  min="0"
                  max="800"
                  step="1"
                  value={h}
                  onChange={(e) => {
                    setH(parseFloat(e.target.value));
                  }}
                  className="w-full h-6 bg-transparent appearance-none cursor-pointer accent-blue-400 hover:accent-blue-300 transition-colors touch-none absolute z-10"
                />
              </div>
              <span className="text-xs text-slate-600 font-mono w-16 text-right">横向</span>
            </div>
          )}

          {/* Control K (Vertical) */}
          {!lockedParams.includes('k') && (
            <div className="flex items-center gap-4 group">
              <span className="text-green-400 font-mono w-8 font-bold text-center border-r border-slate-700 pr-4">k</span>
              <div className="relative w-full h-6 flex items-center">
                <div className="absolute w-full h-0.5 bg-slate-700" />
                <input
                  type="range"
                  min="0"
                  max="600"
                  step="1"
                  value={k}
                  onChange={(e) => {
                    setK(parseFloat(e.target.value));
                  }}
                  className="w-full h-6 bg-transparent appearance-none cursor-pointer accent-green-400 hover:accent-green-300 transition-colors touch-none absolute z-10"
                />
              </div>
              <span className="text-xs text-slate-600 font-mono w-16 text-right">纵向</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
