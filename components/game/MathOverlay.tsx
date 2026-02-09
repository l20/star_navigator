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
  const { a, h, k, setA, setH, setK, targetA, attempts, incrementAttempts, isLevelComplete, lockedParams, targetH, targetK, recordInteraction } = useMathStore();
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

  const [activeParam, setActiveParam] = useState<'a' | 'h' | 'k' | null>(null);

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
      {!isLevelComplete && (
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
          <div className="flex justify-center items-center gap-1 mb-8 text-xl select-none font-mono">
            {process.env.NODE_ENV === 'development' && (
              <span className="text-xs text-yellow-500 font-mono bg-yellow-900/30 px-1 border border-yellow-700/50 mr-2">
                [L{useMathStore.getState().level}]
              </span>
            )}
            <span className="text-cyan-400 mr-2">y = </span>

            {/* A Parameter */}
            <div
              className={`px-3 py-1 border transition-all duration-200 relative ${activeParam === 'a' ? 'border-yellow-400 bg-yellow-400/10 shadow-[0_0_10px_rgba(250,204,21,0.3)]' : 'border-transparent'}`}
            >
              <span className={activeParam === 'a' ? 'text-yellow-400 font-bold' : 'text-white'}>{a.toFixed(3)}</span>
            </div>

            <span className="text-slate-400">(x - </span>

            {/* H Parameter */}
            <div
              className={`px-2 py-1 border transition-all duration-200 relative ${activeParam === 'h' ? 'border-blue-400 bg-blue-400/10 shadow-[0_0_10px_rgba(96,165,250,0.3)]' : 'border-transparent'}`}
            >
              <span className={activeParam === 'h' ? 'text-blue-400 font-bold' : 'text-white'}>{h.toFixed(0)}</span>
            </div>

            <span className="text-slate-400">)² + </span>

            {/* K Parameter */}
            <div
              className={`px-2 py-1 border transition-all duration-200 relative ${activeParam === 'k' ? 'border-green-400 bg-green-400/10 shadow-[0_0_10px_rgba(74,222,128,0.3)]' : 'border-transparent'}`}
            >
              <span className={activeParam === 'k' ? 'text-green-400 font-bold' : 'text-white'}>{k.toFixed(0)}</span>
            </div>
          </div>

          {/* Sliders */}
          <div className="space-y-6">
            {/* Control A (Curvature) */}
            {!lockedParams.includes('a') && (
              <div className="flex items-center gap-4 group">
                <span className={`font-mono w-8 font-bold text-center border-r border-slate-700 pr-4 transition-colors ${activeParam === 'a' ? 'text-yellow-400' : 'text-slate-500'}`}>a</span>
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
                      recordInteraction('CHANGE_A', parseFloat(e.target.value));
                      setActiveParam('a');
                    }}
                    onPointerDown={() => setActiveParam('a')}
                    onPointerUp={() => { incrementAttempts(); setActiveParam(null); }}
                    className="w-full h-6 bg-transparent appearance-none cursor-pointer accent-yellow-400 hover:accent-yellow-300 transition-colors touch-none absolute z-10"
                  />
                </div>
                <span className={`text-xs font-mono w-16 text-right transition-colors ${activeParam === 'a' ? 'text-yellow-400' : 'text-slate-600'}`}>曲率</span>
              </div>
            )}

            {/* Control H (Horizontal) */}
            {!lockedParams.includes('h') && (
              <div className="flex items-center gap-4 group">
                <span className={`font-mono w-8 font-bold text-center border-r border-slate-700 pr-4 transition-colors ${activeParam === 'h' ? 'text-blue-400' : 'text-slate-500'}`}>h</span>
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
                      recordInteraction('CHANGE_H', parseFloat(e.target.value));
                      setActiveParam('h');
                    }}
                    onPointerDown={() => setActiveParam('h')}
                    onPointerUp={() => setActiveParam(null)}
                    className="w-full h-6 bg-transparent appearance-none cursor-pointer accent-blue-400 hover:accent-blue-300 transition-colors touch-none absolute z-10"
                  />
                </div>
                <span className={`text-xs font-mono w-16 text-right transition-colors ${activeParam === 'h' ? 'text-blue-400' : 'text-slate-600'}`}>横向</span>
              </div>
            )}

            {/* Control K (Vertical) */}
            {!lockedParams.includes('k') && (
              <div className="flex items-center gap-4 group">
                <span className={`font-mono w-8 font-bold text-center border-r border-slate-700 pr-4 transition-colors ${activeParam === 'k' ? 'text-green-400' : 'text-slate-500'}`}>k</span>
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
                      recordInteraction('CHANGE_K', parseFloat(e.target.value));
                      setActiveParam('k');
                    }}
                    onPointerDown={() => setActiveParam('k')}
                    onPointerUp={() => setActiveParam(null)}
                    className="w-full h-6 bg-transparent appearance-none cursor-pointer accent-green-400 hover:accent-green-300 transition-colors touch-none absolute z-10"
                  />
                </div>
                <span className={`text-xs font-mono w-16 text-right transition-colors ${activeParam === 'k' ? 'text-green-400' : 'text-slate-600'}`}>纵向</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
