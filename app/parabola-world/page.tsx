'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import MathOverlay from '@/components/game/MathOverlay';
import DialogueOverlay from '@/components/game/DialogueOverlay';
import QuestOverlay from '@/components/game/QuestOverlay';
import KnowledgeOverlay from '@/components/game/KnowledgeOverlay';
import DataLogOverlay from '@/components/game/DataLogOverlay';
import IntroOverlay from '@/components/game/IntroOverlay';
import { useDialogueStore } from '@/store/useDialogueStore';
import { useMathStore } from '@/store/useMathStore';
import { LEVEL_1_SCRIPT, LEVEL_2_SCRIPT } from '@/lib/game/level1';

// Dynamically import GameCanvas with SSR disabled
const GameCanvas = dynamic(() => import('@/components/game/GameCanvas'), { ssr: false });

export default function ParabolaPage() {
  const { startDialogue } = useDialogueStore();
  const { level } = useMathStore();

  // Handle Level Scripts
  useEffect(() => {
    const timer = setTimeout(() => {
      if (level === 0) {
        const { LEVEL_0_SCRIPT } = require('@/lib/game/level0');
        startDialogue(LEVEL_0_SCRIPT);
      } else if (level === 1) {
        const { LEVEL_1_SCRIPT } = require('@/lib/game/level1_k');
        startDialogue(LEVEL_1_SCRIPT);
      } else if (level === 2) {
        const { LEVEL_2_SCRIPT } = require('@/lib/game/level2_h');
        startDialogue(LEVEL_2_SCRIPT);
      } else if (level === 3) {
        const { LEVEL_3_SCRIPT } = require('@/lib/game/level3_mixed');
        startDialogue(LEVEL_3_SCRIPT);
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [level, startDialogue]);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-black overflow-hidden select-none">
      {/* Game Window Container */}
      <div className="w-full h-full relative font-sans">
        <GameCanvas />
        <MathOverlay />
        <QuestOverlay />
        <DialogueOverlay />
        <KnowledgeOverlay />
        <DataLogOverlay />
        <IntroOverlay />
      </div>
    </div>
  );
}
