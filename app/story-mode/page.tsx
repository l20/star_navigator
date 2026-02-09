'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';
import MathOverlay from '@/components/game/MathOverlay';
import DialogueOverlay from '@/components/game/DialogueOverlay';
import QuestOverlay from '@/components/game/QuestOverlay';
import KnowledgeOverlay from '@/components/game/KnowledgeOverlay';
import MindPalaceOverlay from '@/components/game/MindPalaceOverlay';
import IntroOverlay from '@/components/game/IntroOverlay';
import SystemBootOverlay from '@/components/game/SystemBootOverlay';
import StarMapOverlay from '@/components/game/StarMapOverlay'; // Replaces DataLogOverlay
import WarpTransition from '@/components/game/WarpTransition'; // New Warp Animation
import EndingOverlay from '@/components/game/EndingOverlay'; // New Ending Screen
import SacrificeSequence from '@/components/game/SacrificeSequence'; // New Tragic Event
import CognitiveTracker from '@/components/game/CognitiveTracker'; // New ITS Component
import BackgroundMusic from '@/components/game/BackgroundMusic';
import ShipHUD from '@/components/game/ShipHUD';
import { useDialogueStore } from '@/store/useDialogueStore';
import { useMathStore } from '@/store/useMathStore';
import { useState } from 'react';

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
    resetLevel,
    isSystemBootComplete,
    completeSystemBoot,
    isWarping, // Get Warp State
    isGameComplete,
    isSacrificeSequence,
    setSacrificeSequence,
    nextLevel
  } = useMathStore();

  const [introFinished, setIntroFinished] = useState(false);

  // Initialize Story Mode
  useEffect(() => {
    setStoryMode(true);
  }, [setStoryMode]);

  // Handle Level Scripts
  useEffect(() => {
    if (!isSystemBootComplete) return;

    // Small delay to ensure state is ready
    const timer = setTimeout(() => {
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
  }, [level, startDialogue, isSystemBootComplete]);

  // Handle Dialogue Actions
  useEffect(() => {
    if (!currentNodeId) return;

    const node = currentScript.find(n => n.id === currentNodeId);
    if (!node?.action) return;

    switch (node.action) {
      case 'OPEN_MIND_PALACE':
        setMindPalaceOpen(true);
        break;
      case 'ENABLE_CONTROLS':
        setIsPlaying(true);
        break;
      case 'SACRIFICE_MODE':
        setIsPlaying(true);
        break;
    }
  }, [currentNodeId, currentScript, setMindPalaceOpen, setIsPlaying]);

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-black overflow-hidden select-none">
      <div className="w-full h-full relative font-sans">
        <ShipHUD>
          <GameCanvas />

          {isSystemBootComplete && (
            <>
              <MathOverlay />
              <QuestOverlay />
              <DialogueOverlay />
              <MindPalaceOverlay />
              <KnowledgeOverlay />
              <StarMapOverlay /> {/* Star Map System */}
              <CognitiveTracker /> {/* ITS Logic */}
              {isWarping && <WarpTransition />} {/* Warp Effect */}
              {isSacrificeSequence && (
                <SacrificeSequence
                  onComplete={() => {
                    setSacrificeSequence(false);
                    nextLevel(); // Triggers Ending
                  }}
                />
              )}
              {isGameComplete && <EndingOverlay />} {/* Ending Screen */}
            </>
          )}

          <BackgroundMusic />

          {!isSystemBootComplete && (
            <>
              {!introFinished ? (
                <IntroOverlay onComplete={() => setIntroFinished(true)} />
              ) : (
                <SystemBootOverlay onComplete={completeSystemBoot} />
              )}
            </>
          )}
        </ShipHUD>
      </div>
    </div>
  );
}
