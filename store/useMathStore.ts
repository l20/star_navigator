import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Level Configurations
const LEVEL_CONFIGS = [
  { // Level 0: The Origin (Socratic Foundation) - Focus on 'a'
    a: 0, h: 400, k: 300, targetA: 0.005, lockedParams: ['h', 'k'] // Valid logic: 0 vs 0.005 is > 0.001 threshold
  },
  { // Level 1: The Elevator (Vertical Shift) - Focus on 'k'
    a: 0.003, h: 400, k: 0, targetA: 0.003, targetK: 450, lockedParams: ['h', 'a']
  },
  { // Level 2: The Drift (Horizontal Shift) - Focus on 'h'
    a: 0.003, h: 0, k: 300, targetA: 0.003, targetH: 600, lockedParams: ['k', 'a']
  },
  { // Level 3: The Architect (Combined) - Old Level 2
    a: -0.001, h: 400, k: 450, targetA: 0.004, lockedParams: []
  }
];

interface MathState {
  // Parabola Parameters (Vertex Form: y = a(x-h)^2 + k)
  a: number;
  h: number;
  k: number;

  // Game Logic
  isPlaying: boolean;
  level: number;
  targetA?: number; // Optional target for the current level
  targetH?: number; // New targets for verification
  targetK?: number;
  lockedParams: string[]; // params that are hidden/disabled
  isLevelComplete: boolean;
  isDataLogOpen: boolean; // New UI State
  attempts: number; // Track user interactions

  isMindPalaceOpen: boolean; // New: For Story Mode
  storyMode: boolean; // New: To distinguish between Classic and Story

  // Actions
  setA: (val: number) => void;
  setH: (val: number) => void;
  setK: (val: number) => void;
  setIsPlaying: (val: boolean) => void;
  openDataLog: () => void; // New Action
  closeDataLog: () => void; // New Action
  setMindPalaceOpen: (open: boolean) => void; // New
  setStoryMode: (enabled: boolean) => void; // New
  resetLevel: () => void;
  completeLevel: () => void;
  incrementAttempts: () => void;
  nextLevel: () => void; // New Action
  // System
  resetProgress: () => void; // New: Clear save

  // Replay System
  maxLevel: number;
  jumpToLevel: (idx: number) => void;

  // Audio System
  isMusicMuted: boolean;
  toggleMusic: () => void;
}

export const useMathStore = create<MathState>()(
  persist(
    (set, get) => ({
      // Initial defaults (will be overwritten by persist if storage exists)
      ...LEVEL_CONFIGS[0],

      isPlaying: false,
      level: 0,
      maxLevel: 0, // Track highest unlocked level
      lockedParams: ['h', 'k'],

      isLevelComplete: false,
      attempts: 0,
      isDataLogOpen: false,
      isMindPalaceOpen: false,
      storyMode: false,

      setA: (val) => set({ a: val }),
      setH: (val) => set({ h: val }),
      setK: (val) => set({ k: val }),
      setIsPlaying: (val) => set({ isPlaying: val }),

      openDataLog: () => set({ isDataLogOpen: true }),
      closeDataLog: () => set({ isDataLogOpen: false }),
      setMindPalaceOpen: (open) => set({ isMindPalaceOpen: open }),
      setStoryMode: (enabled) => set({ storyMode: enabled }),

      resetLevel: () => {
        const currentLevelIdx = get().level;
        const config = LEVEL_CONFIGS[currentLevelIdx] || LEVEL_CONFIGS[0];
        set({
          ...config,
          isPlaying: false,
          isLevelComplete: false,
          attempts: 0
        });
      },

      completeLevel: () => set({ isLevelComplete: true }),
      incrementAttempts: () => set((state) => ({ attempts: state.attempts + 1 })),

      nextLevel: () => {
        const currentLevel = get().level;
        const currentMax = get().maxLevel;
        const nextLevelIdx = currentLevel + 1;

        if (nextLevelIdx >= LEVEL_CONFIGS.length) {
          // alert("Demo Completed! Thanks for playing."); // Remove alert for smoother UX
          set({ level: 0, ...LEVEL_CONFIGS[0], targetH: undefined, targetK: undefined, isLevelComplete: false, attempts: 0 });
          return;
        }

        const config = LEVEL_CONFIGS[nextLevelIdx];

        // Update maxLevel if we are progressing
        const newMax = Math.max(currentMax, nextLevelIdx);

        set({
          level: nextLevelIdx,
          maxLevel: newMax,
          // Reset optional targets to undefined first, then spread config which may set new values
          targetH: undefined,
          targetK: undefined,
          ...config,
          isPlaying: false,
          isLevelComplete: false,
          attempts: 0
        });
      },

      jumpToLevel: (idx) => {
        if (idx < 0 || idx >= LEVEL_CONFIGS.length) return;
        // Allow jumping if unlocked (idx <= maxLevel)
        // Note: Logic allows checking idx up to maxLevel
        if (idx > get().maxLevel) return;

        const config = LEVEL_CONFIGS[idx];
        set({
          level: idx,
          // Reset optional targets to undefined first, then spread config
          targetH: undefined,
          targetK: undefined,
          ...config,
          isPlaying: false,
          isLevelComplete: false,
          attempts: 0,
          isDataLogOpen: false // Close log when jumping
        });
      },

      isMusicMuted: false, // Default unmuted? Or maybe true if user prefers silence? Let's say false (music on)
      toggleMusic: () => set((state) => ({ isMusicMuted: !state.isMusicMuted })),

      resetProgress: () => {
        set({ level: 0, maxLevel: 0, ...LEVEL_CONFIGS[0], targetH: undefined, targetK: undefined, isLevelComplete: false, attempts: 0 });
      }
    }),
    {
      name: 'parabola-world-storage', // unique name
      partialize: (state) => ({
        level: state.level,
        maxLevel: state.maxLevel,
        isMusicMuted: state.isMusicMuted // Persist music preference
      }),
    }
  )
);
