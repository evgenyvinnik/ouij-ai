import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OuijaState, Position, Message } from '../types/ouija';

const CONVERSATION_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

export const useOuijaStore = create<OuijaState>()(
  persist(
    (set) => ({
      // Planchette state
      planchette: {
        position: { x: 50, y: 50 }, // Start at center
        offset: { x: 0, y: 0 },
        isDragging: false,
        rotation: 0, // Default rotation (pointing down)
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
      spiritName: null,
      hasCompletedIntro: false,
      errorMessage: null,
      lastActivityTimestamp: Date.now(),

      // Actions
      movePlanchette: (position: Position, rotation?: number) =>
        set((state) => ({
          planchette: {
            ...state.planchette,
            position,
            ...(rotation !== undefined && { rotation }),
          },
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
            revealedLetters: [], // Clear previous answer when starting new one
          },
          turn: 'animating',
        })),

      revealNextLetter: () =>
        set((state) => {
          const nextIndex = state.animation.currentLetterIndex + 1;
          const letter =
            state.animation.letterQueue[state.animation.currentLetterIndex];

          if (nextIndex >= state.animation.letterQueue.length) {
            // Animation complete - add the full message to history
            const fullMessage = [
              ...state.animation.revealedLetters,
              letter,
            ].join('');

            return {
              animation: {
                ...state.animation,
                isAnimating: false,
                revealedLetters: [...state.animation.revealedLetters, letter],
              },
              conversationHistory: [
                ...state.conversationHistory,
                {
                  role: 'assistant' as const,
                  content: fullMessage,
                },
              ],
              turn: 'user',
              lastActivityTimestamp: Date.now(),
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
          lastActivityTimestamp: Date.now(),
        })),

      addToHistory: (message: Message) =>
        set((state) => ({
          conversationHistory: [...state.conversationHistory, message],
          lastActivityTimestamp: Date.now(),
        })),

      setTurn: (turn: 'user' | 'spirit' | 'animating') => set(() => ({ turn })),

      setSpiritName: (name: string) => set(() => ({ spiritName: name })),

      completeIntro: () => set(() => ({ hasCompletedIntro: true })),

      setError: (error: string | null) => set(() => ({ errorMessage: error })),

      resetSession: () =>
        set(() => ({
          planchette: {
            position: { x: 50, y: 50 },
            offset: { x: 0, y: 0 },
            isDragging: false,
            rotation: 0,
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
          spiritName: null,
          hasCompletedIntro: false,
          errorMessage: null,
          lastActivityTimestamp: Date.now(),
        })),
    }),
    {
      name: 'ouija-session',
      partialize: (state) => ({
        conversationHistory: state.conversationHistory,
        spiritName: state.spiritName,
        hasCompletedIntro: state.hasCompletedIntro,
        lastActivityTimestamp: state.lastActivityTimestamp,
      }),
      // Custom merge function to check timeout
      merge: (persistedState: unknown, currentState) => {
        if (!persistedState) {
          return currentState;
        }

        const now = Date.now();
        const state = persistedState as {
          conversationHistory?: Message[];
          spiritName?: string | null;
          hasCompletedIntro?: boolean;
          lastActivityTimestamp?: number;
        };
        const timeSinceLastActivity = now - (state.lastActivityTimestamp || 0);

        // If more than 5 minutes have passed, start fresh
        if (timeSinceLastActivity > CONVERSATION_TIMEOUT) {
          return currentState;
        }

        // Otherwise, restore the conversation
        // If there's a spirit name and intro was completed, restore the session
        const hasValidSession =
          !!state.spiritName &&
          (!!state.hasCompletedIntro ||
            (state.conversationHistory?.length || 0) > 0);

        return {
          ...currentState,
          conversationHistory: state.conversationHistory || [],
          spiritName: state.spiritName || null,
          hasCompletedIntro: !!hasValidSession,
          lastActivityTimestamp: state.lastActivityTimestamp || Date.now(),
        };
      },
    }
  )
);
