import { create } from 'zustand';

export type Speaker = 'merchant' | 'photon' | 'system' | 'player' | 'deer' | 'captain' | 'navigator';
export type Emotion = 'neutral' | 'happy' | 'angry' | 'confused' | 'scared' | 'worry' | 'sad' | 'surprised';

export interface DialogueNode {
  id: string;
  text: string;
  speaker: Speaker;
  emotion?: Emotion;
  next?: string; // ID of next node. If undefined, end of conversation.
  action?: string; // Trigger an event (e.g., 'ENABLE_CONTROLS', 'SHOW_FORMULA')
}

interface DialogueState {
  isOpen: boolean;
  currentScript: DialogueNode[];
  currentNodeId: string | null;

  // Actions
  startDialogue: (script: DialogueNode[], startNodeId?: string) => void;
  advance: () => void;
  close: () => void;
}

export const useDialogueStore = create<DialogueState>((set, get) => ({
  isOpen: false,
  currentScript: [],
  currentNodeId: null,

  startDialogue: (script, startNodeId) => {
    set({
      isOpen: true,
      currentScript: script,
      currentNodeId: startNodeId || script[0]?.id
    });
  },

  advance: () => {
    const { currentScript, currentNodeId } = get();
    if (!currentNodeId) return;

    const currentNode = currentScript.find(n => n.id === currentNodeId);
    if (currentNode?.next) {
      set({ currentNodeId: currentNode.next });
    } else {
      set({ isOpen: false, currentNodeId: null });
    }
  },

  close: () => set({ isOpen: false, currentNodeId: null }),
}));
