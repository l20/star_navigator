'use client';

import { useDialogueStore, Speaker } from '@/store/useDialogueStore';
import { useMathStore } from '@/store/useMathStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Cpu } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { synth } from '@/lib/audio/synth';

const TypingEffect = ({ text, speaker }: { text: string; speaker: Speaker }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    setDisplayedText(''); // Reset on text change
    let currentIndex = 0;

    const interval = setInterval(() => {
      // Use currentIndex to slice from original text, avoiding stale closure or concatenation errors
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));

        // Play audio based on speaker!
        const char = text.charAt(currentIndex);
        if (char !== ' ') { // Don't beep on spaces
          if (speaker === 'merchant') synth.speakMerchant();
          if (speaker === 'photon') synth.speakPhoton();
          if (speaker === 'system') synth.speakSystem();
        }

        currentIndex++;
      } else {
        clearInterval(interval);
      }
    }, 40); // Typing speed

    return () => clearInterval(interval);
  }, [text, speaker]);

  return <span>{displayedText}</span>;
};

const getDisplayName = (speaker: Speaker, playerName?: string) => {
  switch (speaker) {
    case 'merchant': return '老商人';
    case 'captain': return '老林 (Captain Lin)';
    case 'photon': return '光子 (Photon)';
    case 'deer': return '小鹿 (Deer)';
    case 'player': return `${playerName || '调律师'} (Tuner)`;
    case 'navigator': return `${playerName || '领航员'} (Navigator)`;
    default: return '系统';
  }
};

export default function DialogueOverlay() {
  const { isOpen, currentNodeId, currentScript, advance } = useDialogueStore();

  if (!isOpen || !currentNodeId) return null;

  const currentNode = currentScript.find(n => n.id === currentNodeId);
  if (!currentNode) return null;

  // Character Avatars
  const getAvatar = (speaker: Speaker) => {
    switch (speaker) {
      case 'merchant':
      case 'captain':
        return (
          <div className="w-16 aspect-260/346 relative overflow-hidden bg-amber-950/30">
            <Image src="/lin.jpeg" alt="Captain Lin" fill className="object-cover opacity-90 grayscale-[0.2]" />
            <div className="absolute inset-0 border border-amber-500/30" />
          </div>
        );
      case 'photon':
      case 'deer':
        return (
          <div className="w-16 h-16 relative overflow-hidden bg-cyan-950/30">
            <Image src="/deer.jpeg" alt="Deer" fill className="object-cover opacity-90 contrast-125 saturate-150" />
            <div className="absolute inset-0 border border-cyan-400/30 mix-blend-overlay" />
          </div>
        );
      case 'player':
      case 'navigator':
        return <div className="w-16 h-16 flex items-center justify-center"><Cpu className="w-10 h-10 text-indigo-400" /></div>;
      default:
        return <div className="w-16 h-16 flex items-center justify-center"><Cpu className="w-10 h-10 text-slate-400" /></div>;
    }
  };

  // Background styles - Tech Flat
  const getBackground = (speaker: Speaker) => {
    // Shared tech base: sharp corners, borders, backdrop blur
    const base = "border-l-4 border-r-2 backdrop-blur-md shadow-2xl";

    if (speaker === 'merchant' || speaker === 'captain')
      return `${base} bg-amber-950/90 border-amber-600 border-r-amber-600/30`;

    if (speaker === 'photon' || speaker === 'deer')
      return `${base} bg-cyan-950/90 border-cyan-500 border-r-cyan-500/30`;

    if (speaker === 'player' || speaker === 'navigator')
      return `${base} bg-indigo-950/90 border-indigo-500 border-r-indigo-500/30 shadow-[0_0_20px_rgba(99,102,241,0.2)]`;

    return `${base} bg-slate-900/90 border-slate-600`;
  };

  return (
    <div className="absolute inset-0 pointer-events-none flex items-end justify-center pb-12 z-50 font-mono">
      <AnimatePresence mode='wait'>
        <motion.div
          key={currentNode.id}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 10, opacity: 0 }}
          className={`pointer-events-auto max-w-3xl w-full mx-4 p-6 flex gap-6 items-start ${getBackground(currentNode.speaker)} cursor-pointer relative group`}
          onClick={() => { synth.playClick(); advance(); }}
        >
          {/* Tech Decoration Corners */}
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/30" />
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/30" />
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/30" />
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/30" />

          {/* Avatar Section - Sharp square with border */}
          <div className="shrink-0 border border-white/10 shadow-inner bg-black/50">
            {getAvatar(currentNode.speaker)}
          </div>

          {/* Text Section */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2 border-b border-white/10 pb-1">
              <div className="text-xs font-bold uppercase tracking-[0.15em] opacity-80 text-white/70">
                {getDisplayName(currentNode.speaker, useMathStore.getState().userName)}
              </div>
              <div className="text-[10px] text-white/30 tracking-widest">
                // 传输中
              </div>
            </div>

            <div className="text-lg md:text-xl font-medium leading-relaxed text-white/90 min-h-[3.5rem] font-sans">
              <TypingEffect
                text={currentNode.text.replace(/{player}/g, useMathStore.getState().userName || '指挥官')}
                speaker={currentNode.speaker}
              />
            </div>

            <div className="mt-4 flex justify-end">
              <div className="text-xs text-white/40 flex items-center gap-2 animate-pulse uppercase tracking-widest border border-white/20 px-3 py-1 hover:bg-white/10 transition-colors">
                <span>[ 继续 ]</span>
                <span className="text-[10px]">▶</span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
