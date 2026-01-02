import { create } from 'zustand';
import { OuijaState, Position, Message } from '../types/ouija';

export const useOuijaStore = create<OuijaState>((set) => ({
  // Planchette state
  planchette: {
    position: { x: 50, y: 50 }, // Start at center
    offset: { x: 0, y: 0 },
    isDragging: false,
  },

  // Animation state
  animation: {
    isAnimating: false,
    letterQueue: [],
    revealedLetters: [],
    currentLetterIndex: 0,
  },

  // Game state
  turn: 'user',
  userMessage: '',
  conversationHistory: [],

  // Actions
  movePlanchette: (position: Position) =>
    set((state) => ({
      planchette: { ...state.planchette, position },
    })),

  setOffset: (offset: Position) =>
    set((state) => ({
      planchette: { ...state.planchette, offset },
    })),

  setDragging: (isDragging: boolean) =>
    set((state) => ({
      planchette: { ...state.planchette, isDragging },
    })),

  queueLetters: (letters: string[]) =>
    set((state) => ({
      animation: {
        ...state.animation,
        letterQueue: letters,
        isAnimating: true,
        currentLetterIndex: 0,
      },
      turn: 'animating',
    })),

  revealNextLetter: () =>
    set((state) => {
      const nextIndex = state.animation.currentLetterIndex + 1;
      const letter = state.animation.letterQueue[state.animation.currentLetterIndex];
      
      if (nextIndex >= state.animation.letterQueue.length) {
        // Animation complete
        return {
          animation: {
            ...state.animation,
            isAnimating: false,
            revealedLetters: [...state.animation.revealedLetters, letter],
          },
          turn: 'user',
        };
      }

      return {
        animation: {
          ...state.animation,
          currentLetterIndex: nextIndex,
          revealedLetters: [...state.animation.revealedLetters, letter],
        },
      };
    }),

  clearAnimation: () =>
    set((state) => ({
      animation: {
        ...state.animation,
        letterQueue: [],
        revealedLetters: [],
        currentLetterIndex: 0,
        isAnimating: false,
      },
    })),

  submitQuestion: (message: string) =>
    set(() => ({
      userMessage: message,
      turn: 'spirit',
    })),

  addToHistory: (message: Message) =>
    set((state) => ({
      conversationHistory: [...state.conversationHistory, message],
    })),

  setTurn: (turn: 'user' | 'spirit' | 'animating') =>
    set(() => ({ turn })),

  resetSession: () =>
    set(() => ({
      planchette: {
        position: { x: 50, y: 50 },
        offset: { x: 0, y: 0 },
        isDragging: false,
      },
      animation: {
        isAnimating: false,
        letterQueue: [],
        revealedLetters: [],
        currentLetterIndex: 0,
      },
      turn: 'user',
      userMessage: '',
      conversationHistory: [],
    })),
}));
