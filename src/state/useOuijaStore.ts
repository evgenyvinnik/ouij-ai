import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OuijaState, Position, Message } from '../types/ouija';

const CONVERSATION_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

console.log('[STORE] Creating Ouija store with persist middleware');

export const useOuijaStore = create<OuijaState>()(
  persist(
    (set) => {
      console.log('[STORE] Store initializer called');
      return {
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
    };
    },
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
        console.log('[MERGE] Called with persistedState:', persistedState);

        if (!persistedState) {
          console.log('[MERGE] No persisted state, returning current');
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

        console.log('[MERGE] Persisted state:', {
          spiritName: state.spiritName,
          hasCompletedIntro: state.hasCompletedIntro,
          conversationCount: state.conversationHistory?.length || 0,
          timeSinceLastActivity,
          timeout: CONVERSATION_TIMEOUT,
        });

        // If more than 5 minutes have passed, start fresh
        if (timeSinceLastActivity > CONVERSATION_TIMEOUT) {
          console.log('[MERGE] Session timeout, returning current');
          return currentState;
        }

        // Otherwise, restore the conversation if we have a valid session
        // Valid session = has spirit name AND (intro was completed OR has messages)
        const hasValidSession =
          !!state.spiritName &&
          (!!state.hasCompletedIntro ||
            (state.conversationHistory?.length || 0) > 0);

        console.log('[MERGE] hasValidSession:', hasValidSession);

        // Only restore if we have a valid session
        if (!hasValidSession) {
          console.log('[MERGE] No valid session, returning current');
          return currentState;
        }

        console.log('[MERGE] Restoring session with spirit:', state.spiritName);
        return {
          ...currentState,
          conversationHistory: state.conversationHistory || [],
          spiritName: state.spiritName || null,
          hasCompletedIntro: true, // Always true if restoring a valid session
          lastActivityTimestamp: state.lastActivityTimestamp || Date.now(),
        };
      },
    }
  )
);
