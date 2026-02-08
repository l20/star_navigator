'use client';

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import MathOverlay from '@/components/game/MathOverlay';
import DialogueOverlay from '@/components/game/DialogueOverlay';
import QuestOverlay from '@/components/game/QuestOverlay';
import KnowledgeOverlay from '@/components/game/KnowledgeOverlay'; // Keep for completion? Or use MindPalace?
import MindPalaceOverlay from '@/components/game/MindPalaceOverlay';
import IntroOverlay from '@/components/game/IntroOverlay';
import BackgroundMusic from '@/components/game/BackgroundMusic';
import ShipHUD from '@/components/game/ShipHUD';
import { useDialogueStore } from '@/store/useDialogueStore';
import { useMathStore } from '@/store/useMathStore';

// Dynamic Import for Canvas
const GameCanvas = dynamic(() => import('@/components/game/GameCanvas'), { ssr: false });

export default function StoryModePage() {
  const { startDialogue, currentNodeId, currentScript } = useDialogueStore();
  const {
    level,
    storyMode,
    setStoryMode,
    setMindPalaceOpen,
    setIsPlaying,
    resetLevel
  } = useMathStore();

  // Initialize Story Mode
  useEffect(() => {
    setStoryMode(true);
    // return () => setStoryMode(false); // Cleanup? Maybe not needed if we want persistence
  }, [setStoryMode]);

  // Handle Level Scripts
  useEffect(() => {
    // Small delay to ensure state is ready
    const timer = setTimeout(() => {
      // Logic: Only start dialogue if not already playing or if just reset?
      // For now, simple mapping.

      // Dynamic imports for scripts
      if (level === 0) {
        const { STORY_LEVEL_0_SCRIPT } = require('@/lib/story/level0');
        startDialogue(STORY_LEVEL_0_SCRIPT);
      } else if (level === 1) {
        const { STORY_LEVEL_1_SCRIPT } = require('@/lib/story/level1');
        startDialogue(STORY_LEVEL_1_SCRIPT);
      } else if (level === 2) {
        const { STORY_LEVEL_2_SCRIPT } = require('@/lib/story/level2');
        startDialogue(STORY_LEVEL_2_SCRIPT);
      } else if (level === 3) {
        const { STORY_LEVEL_3_SCRIPT } = require('@/lib/story/level3');
        startDialogue(STORY_LEVEL_3_SCRIPT);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [level, startDialogue]);

  // Handle Dialogue Actions
  useEffect(() => {
    if (!currentNodeId) return;

    const node = currentScript.find(n => n.id === currentNodeId);
    if (!node?.action) return;

    // Handle Actions
    switch (node.action) {
      case 'OPEN_MIND_PALACE':
        setMindPalaceOpen(true);
        break;
      case 'ENABLE_CONTROLS':
        setIsPlaying(true);
        break;
      case 'SACRIFICE_MODE':
        // TODO: Enable sacrifice logic
        // For now, just enable controls but maybe set a flag?
        // We can just check level === 3 logic in GameCanvas or MathStore
        setIsPlaying(true);
        break;
    }
  }, [currentNodeId, currentScript, setMindPalaceOpen, setIsPlaying]);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-black overflow-hidden select-none">
      <div className="w-full h-full relative font-sans">
        <ShipHUD>
          <GameCanvas />
          <MathOverlay />
          <QuestOverlay />
          <DialogueOverlay />
          <MindPalaceOverlay />
          <KnowledgeOverlay />
          <IntroOverlay />
          <BackgroundMusic />
        </ShipHUD>
      </div>
    </div>
  );
}
