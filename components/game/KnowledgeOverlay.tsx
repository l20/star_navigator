import { useMathStore } from '@/store/useMathStore';
import { useDialogueStore } from '@/store/useDialogueStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, BookOpen, CheckCircle, XCircle, BrainCircuit } from 'lucide-react';
import { useState, useEffect } from 'react';
import { KNOWLEDGE_DB } from '@/lib/game/knowledgeContent';
import { synth } from '@/lib/audio/synth';

export default function KnowledgeOverlay() {
  const { isLevelComplete, level, nextLevel, setIsWarping, setSacrificeSequence } = useMathStore();
  const { startDialogue } = useDialogueStore();
  const [show, setShow] = useState(false);
  const [step, setStep] = useState<'QUIZ' | 'SUCCESS'>('QUIZ');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isWrong, setIsWrong] = useState(false);
  const [showHint, setShowHint] = useState(false);

  // Delay showing to allow for "Victory" text to be seen first
  useEffect(() => {
    if (isLevelComplete) {
      const timer = setTimeout(() => {
        const content = KNOWLEDGE_DB[level as keyof typeof KNOWLEDGE_DB];
        setShow(true);
        // If has quiz, start with QUIZ, else SUCCESS
        setStep(content?.quiz ? 'QUIZ' : 'SUCCESS');
        setSelectedOption(null);
        setIsWrong(false);
        setShowHint(false);

        // Trigger Victory Dialogue!
        if (content?.completionShoutout) {
          startDialogue([
            {
              id: `v_${level}_m`,
              text: content.completionShoutout.merchant,
              speaker: 'merchant',
              emotion: 'happy',
              next: `v_${level}_p`
            },
            {
              id: `v_${level}_p`,
              text: content.completionShoutout.photon,
              speaker: 'photon',
              emotion: 'happy'
            }
          ]);
        }
      }, 2000);
      return () => clearTimeout(timer);
    } else {
      setShow(false);
    }
  }, [isLevelComplete, level]);

  // Adaptive Hint Timer
  useEffect(() => {
    if (step === 'QUIZ' && show && !showHint) {
      const timer = setTimeout(() => {
        setShowHint(true);
      }, 10000); // 10s delay to show hint
      return () => clearTimeout(timer);
    }
  }, [step, show, showHint]);

  if (!show) return null;

  const content = KNOWLEDGE_DB[level as keyof typeof KNOWLEDGE_DB];
  if (!content) return null; // Fallback

  const handleQuizSubmit = (idx: number) => {
    if (!content.quiz) return;

    if (idx === content.quiz.correctIndex) {
      // Correct!
      setIsWrong(false);
      setSelectedOption(idx);
      setTimeout(() => {
        setStep('SUCCESS');
      }, 1000);
    } else {
      // Wrong - Trigger Photon Dialogue!
      setIsWrong(true);
      setSelectedOption(idx);
      setShowHint(true); // Show hint immediately on failure

      // Get specific feedback or fallback
      const feedbackText = content.quiz.wrongFeedback?.[idx] as string || "这个方向似乎有点偏离。再感受一下公式的韵律...";

      // Trigger Photon Dialogue
      startDialogue([
        {
          id: 'whisper',
          text: feedbackText,
          speaker: 'photon',
          emotion: 'worry'
        }
      ]);
    }
  };

  return (
    <div className="absolute inset-x-0 top-0 bottom-0 z-40 flex items-start justify-center pt-4 font-mono pointer-events-none">
      <AnimatePresence mode='wait'>
        {step === 'QUIZ' && content.quiz ? (
          <motion.div
            key="quiz"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="bg-slate-900/95 border-2 border-yellow-500/50 p-8 max-w-lg w-full shadow-2xl relative overflow-x-hidden overflow-y-auto max-h-[54vh] group pointer-events-auto backdrop-blur-md"
          >
            {/* Tech Corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-yellow-500" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-yellow-500" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-yellow-500" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-yellow-500" />

            {/* Scanline */}
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

            <div className="flex items-center gap-3 mb-6 text-yellow-400 border-b border-yellow-500/30 pb-4">
              <BrainCircuit className="w-6 h-6 animate-pulse" />
              <h2 className="text-xl font-bold tracking-[0.1em] uppercase">校准请求 (CALIBRATION)</h2>
            </div>

            <div className="mb-6 text-lg text-white font-medium leading-relaxed">
              {content.quiz.question}
            </div>

            <div className="space-y-3 mb-6">
              {content.quiz.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuizSubmit(idx)}
                  className={`w-full p-4 text-left font-mono text-sm transition-all border-l-4 border-r-2 relative group-hover/btn
                        ${selectedOption === idx
                      ? (isWrong ? 'bg-red-900/50 border-red-500 text-red-200' : 'bg-green-900/50 border-green-500 text-green-200')
                      : 'bg-slate-800/50 border-slate-600 hover:bg-slate-700 hover:border-yellow-500 text-slate-300'
                    }
                  `}
                >
                  <div className="flex items-center justify-between">
                    <span className="tracking-wide"><span className="opacity-50 mr-2">{["A", "B", "C", "D"][idx]} //</span>{opt}</span>
                    {selectedOption === idx && (
                      isWrong ? <XCircle className="w-5 h-5 text-red-500" /> : <CheckCircle className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Adaptive Hint Box - Tech Style */}
            <AnimatePresence>
              {(showHint && content.quiz.hint) && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="bg-yellow-900/10 border-l-4 border-yellow-500 p-4 relative"
                >
                  <div className="flex gap-3">
                    <div className="text-yellow-500 text-xl">💡</div>
                    <div className="text-yellow-200/80 text-sm font-mono">
                      <span className="opacity-50 text-xs block mb-1">提示系统已激活 (HINT SYSTEM)</span>
                      {content.quiz.hint}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-slate-900/95 border-2 border-green-500/50 p-8 max-w-md shadow-2xl relative overflow-x-hidden overflow-y-auto max-h-[70vh] pointer-events-auto backdrop-blur-md"
          >
            {/* Tech Corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-green-500" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-green-500" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-green-500" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-green-500" />

            {/* Holographic Scanline Effect */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-20" />

            <div className="relative z-10 select-text cursor-text">
              <div className="flex items-center gap-3 mb-6 text-green-400 border-b border-green-500/30 pb-4">
                <BookOpen className="w-6 h-6 animate-pulse" />
                <h2 className="text-xl font-bold tracking-[0.1em] uppercase">访问许可确认 (ACCESS GRANTED)</h2>
              </div>

              <h3 className="text-white text-lg font-bold mb-2 uppercase tracking-wide">{content.title}</h3>
              <div className="text-green-500 font-mono text-xs mb-4 border-l-2 border-green-500/50 pl-2 py-1 bg-green-900/10 inline-block">
                {content.concept}
              </div>

              <div className="text-slate-300 text-sm leading-relaxed border-t border-slate-700/50 pt-4">
                {content.body}
              </div>

              <button
                onClick={() => {
                  setShow(false);

                  if (level === 3) {
                    // Level 3 Special End: Sacrifice Sequence
                    setSacrificeSequence(true);
                  } else {
                    // Standard Warp Transition
                    setIsWarping(true);
                    synth.playTone(100, 'sawtooth', 2, 0.1); // Warp Sound

                    setTimeout(() => {
                      nextLevel();
                      setIsWarping(false);
                    }, 2500);
                  }
                }}
                className="w-full mt-8 bg-green-600/20 hover:bg-green-600/40 text-green-400 font-bold py-3 px-6 flex items-center justify-center gap-2 transition-all border border-green-500 hover:shadow-[0_0_15px_rgba(34,197,94,0.3)] group uppercase tracking-widest text-sm"
              >
                [ 下一区域 / NEXT SECTOR ]
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
