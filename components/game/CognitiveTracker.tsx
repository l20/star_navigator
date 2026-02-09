"use client";

import { useEffect, useRef } from 'react';
import { useMathStore } from '@/store/useMathStore';
import { useDialogueStore } from '@/store/useDialogueStore';

// Hint Definitions (Could move to a separate file)
const HINTS = {
  HESITATION_LEVEL_0: "领航员，黑洞在下方，我们需要一个向上的‘托举力’。想想 a 的符号应该是什么？",
  HESITATION_LEVEL_1_K: "警告！当前轨道高度不足。我们将直接撞击前方残骸带。请提升 k 值，让抛物线‘抬’起来。",
  HESITATION_LEVEL_2_H: "目标锁定中... 还在犹豫吗？记住‘左加右减’，括号里的世界是反的。",

  ERROR_A_ZERO: "警告！a=0 将导致轨道坍缩为直线，我们会直接坠入奇点。必须保持 a ≠ 0。",
  ERROR_DIRECTION: "方向错了！我们需要托举力（a > 0），而不是压力（a < 0）。"
};

export default function CognitiveTracker() {
  const { cognitiveState, level, isPlaying, isLevelComplete, a, targetA } = useMathStore();
  const { startDialogue, isOpen } = useDialogueStore();
  const lastHintTimeRef = useRef<number>(0);

  useEffect(() => {
    if (!isPlaying || isLevelComplete || isOpen) return;

    const checkState = () => {
      const now = Date.now();
      const timeSinceLastInteraction = now - cognitiveState.lastInteractionTime;
      const timeSinceLastHint = now - lastHintTimeRef.current;

      // 1. Hesitation Check (15s)
      if (timeSinceLastInteraction > 15000 && timeSinceLastHint > 20000) { // 20s cooldown
        triggerHesitationHint(level);
      }

      // 2. Error Check (Real-time is handled in recordInteraction, but we can do checks here too)
      // e.g. if a=0 for too long?
      if (a === 0 && timeSinceLastInteraction > 5000 && timeSinceLastHint > 10000) {
        triggerHint(HINTS.ERROR_A_ZERO);
      }
    };

    const interval = setInterval(checkState, 1000);
    return () => clearInterval(interval);
  }, [cognitiveState.lastInteractionTime, isPlaying, isLevelComplete, isOpen, level, a]);

  const triggerHint = (text: string) => {
    // We need to construct a dialogue node on the fly
    // or use a pre-defined ID.
    // Ideally use useDialogueStore's startDialogue with a custom node list.

    // Simple transient message? useDialogueStore might be too heavy if it pauses game?
    // If startDialogue pauses game, that's good for ITS.

    startDialogue([
      {
        id: 'its_hint_' + Date.now(),
        text: text,
        speaker: 'deer',
        emotion: 'neutral',
        next: undefined // End after one line
      }
    ]);

    lastHintTimeRef.current = Date.now();
  };

  const triggerHesitationHint = (currentLevel: number) => {
    let hint = "";
    switch (currentLevel) {
      case 0: hint = HINTS.HESITATION_LEVEL_0; break;
      case 1: hint = HINTS.HESITATION_LEVEL_1_K; break;
      case 2: hint = HINTS.HESITATION_LEVEL_2_H; break;
      case 3: hint = "领航员，深呼吸。先定位置(h,k)，再定形状(a)。"; break;
      default: hint = "需要帮忙吗？试着调整一下滑块。"; break;
    }
    triggerHint(hint);
  };

  return null; // Headless component
}
