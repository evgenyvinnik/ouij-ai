/**
 * Global Zustand store for Ouija board application state
 *
 * @remarks
 * This module provides centralized state management using Zustand with persistence.
 * The store manages:
 * - Planchette position and rotation
 * - Animation queue for letter-by-letter spelling
 * - Conversation history and turn management
 * - Session persistence with timeout handling
 *
 * The persist middleware saves conversation state to localStorage with a 5-minute
 * timeout to preserve user sessions across page refreshes while preventing stale data.
 *
 * @example
 * ```tsx
 * // Access state and actions
 * const { planchette, movePlanchette } = useOuijaStore();
 *
 * // Move planchette to a letter
 * movePlanchette({ x: 45, y: 30 }, 45);
 *
 * // Queue letters for animation
 * queueLetters(['H', 'E', 'L', 'L', 'O']);
 * ```
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { OuijaState, Position, Message } from '../types/ouija';

/**
 * Session timeout duration in milliseconds
 *
 * @remarks
 * After 5 minutes of inactivity, persisted sessions are discarded and a fresh
 * session is started. This prevents users from resuming stale conversations.
 */
const CONVERSATION_TIMEOUT = 5 * 60 * 1000; // 5 minutes in milliseconds

/**
 * Main Zustand store instance for Ouija board state management
 *
 * @remarks
 * Created using Zustand's `create` function wrapped with `persist` middleware.
 * The persist middleware stores selected state (conversation history, spirit name,
 * intro completion) in localStorage under the key 'ouija-session'.
 *
 * State restoration includes timeout validation and session validity checks to
 * ensure users don't resume expired or incomplete sessions.
 */
export const useOuijaStore = create<OuijaState>()(
  persist(
    (set) => {
      return {
      /**
       * Planchette position and rotation state
       *
       * @remarks
       * Position is percentage-based (0-100) for responsive layouts.
       * Rotation is in degrees, used to point the planchette in the direction of movement.
       */
      // Planchette state
      planchette: {
        position: { x: 50, y: 50 }, // Start at center
        rotation: 0, // Default rotation (pointing down)
      },

      /**
       * Animation system state
       *
       * @remarks
       * Controls the letter-by-letter spelling animation:
       * - `letterQueue`: Letters waiting to be animated (from AI response)
       * - `revealedLetters`: Letters that have been shown to the user
       * - `currentLetterIndex`: Current position in the animation sequence
       * - `isAnimating`: Whether the planchette is actively moving/spelling
       */
      // Animation state
      animation: {
        isAnimating: false,
        letterQueue: [],
        revealedLetters: [],
        currentLetterIndex: 0,
      },

      /**
       * Game state and conversation management
       *
       * @remarks
       * - `turn`: Controls UI state (user input, AI processing, animation)
       * - `userMessage`: Current question being typed by user
       * - `conversationHistory`: Full message history (persisted)
       * - `spiritName`: Name of channeled spirit (persisted)
       * - `hasCompletedIntro`: Whether intro sequence finished (persisted)
       * - `errorMessage`: Current error to display, if any
       * - `lastActivityTimestamp`: For session timeout tracking (persisted)
       */
      // Game state
      turn: 'user',
      userMessage: '',
      conversationHistory: [],
      spiritName: null,
      hasCompletedIntro: false,
      errorMessage: null,
      lastActivityTimestamp: Date.now(),

      /**
       * Action methods for state mutations
       */
      // Actions
      /**
       * Move planchette to a new position with optional rotation
       *
       * @param position - Target position as percentage coordinates {x, y}
       * @param rotation - Optional rotation angle in degrees
       *
       * @remarks
       * Used by the animation system to update planchette position during
       * letter-by-letter spelling. Position is percentage-based for responsive layouts.
       * Rotation is optional to allow position-only updates.
       */
      movePlanchette: (position: Position, rotation?: number) =>
        set((state) => ({
          planchette: {
            ...state.planchette,
            position,
            ...(rotation !== undefined && { rotation }),
          },
        })),

      /**
       * Queue letters for animation and start the spelling sequence
       *
       * @param letters - Array of letters/tokens to spell (e.g., ['H', 'E', 'L', 'L', 'O'])
       *
       * @remarks
       * This action:
       * 1. Sets the letter queue from the AI response
       * 2. Clears previous revealed letters
       * 3. Resets animation index to 0
       * 4. Sets `isAnimating` to true
       * 5. Changes turn to 'animating'
       *
       * Special handling: 'YES', 'NO', 'GOODBYE' are sent as single tokens
       * to move the planchette to special board positions.
       */
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

      /**
       * Reveal the next letter in the animation queue
       *
       * @remarks
       * Called by the animation hook after each letter position is reached.
       * This action:
       * 1. Adds current letter to revealed letters
       * 2. Increments the letter index
       * 3. If queue is complete:
       *    - Joins revealed letters into full message
       *    - Adds message to conversation history
       *    - Sets turn back to 'user'
       *    - Updates activity timestamp
       *    - Sets `isAnimating` to false
       *
       * This ensures the full AI response is saved to history only after
       * the complete animation finishes.
       */
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
        })),

      /**
       * Clear all animation state
       *
       * @remarks
       * Resets the animation system to initial state:
       * - Clears letter queue
       * - Clears revealed letters
       * - Resets letter index to 0
       * - Sets `isAnimating` to false
       *
       * Used when canceling an animation or resetting the board.
       */
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

      /**
       * Submit user's question and transition to spirit's turn
       *
       * @param message - The user's question to the spirit
       *
       * @remarks
       * This action:
       * 1. Stores the user message
       * 2. Changes turn to 'spirit' (triggers AI API call)
       * 3. Updates activity timestamp
       *
       * The message is added to conversation history separately by the
       * chat hook after successful API request.
       */
      submitQuestion: (message: string) =>
        set(() => ({
          userMessage: message,
          turn: 'spirit',
          lastActivityTimestamp: Date.now(),
        })),

      /**
       * Add a message to the conversation history
       *
       * @param message - Message object with role and content
       *
       * @remarks
       * Used to add user messages to history (assistant messages are added
       * automatically when animation completes). Updates activity timestamp.
       */
      addToHistory: (message: Message) =>
        set((state) => ({
          conversationHistory: [...state.conversationHistory, message],
          lastActivityTimestamp: Date.now(),
        })),

      /**
       * Set the current turn state
       *
       * @param turn - The new turn: 'user' | 'spirit' | 'animating'
       *
       * @remarks
       * Turn states:
       * - `user`: User can type and submit questions
       * - `spirit`: AI is processing the question
       * - `animating`: Planchette is spelling the response
       */
      setTurn: (turn: 'user' | 'spirit' | 'animating') => set(() => ({ turn })),

      /**
       * Set the name of the spirit being channeled
       *
       * @param name - The spirit's name
       *
       * @remarks
       * Spirit name is used in the AI prompt to personalize responses and is
       * persisted across sessions (until timeout).
       */
      setSpiritName: (name: string) => set(() => ({ spiritName: name })),

      /**
       * Mark the intro sequence as completed
       *
       * @remarks
       * Called after the initial spirit name selection and intro animation.
       * Prevents the intro from replaying on subsequent interactions.
       * This flag is persisted to localStorage.
       */
      completeIntro: () => set(() => ({ hasCompletedIntro: true })),

      /**
       * Set or clear the current error message
       *
       * @param error - Error message string or null to clear
       *
       * @remarks
       * Used by the chat hook to display API errors to the user.
       * Set to null to clear the error.
       */
      setError: (error: string | null) => set(() => ({ errorMessage: error })),

      /**
       * Reset the entire session state to initial values
       *
       * @remarks
       * Creates a fresh session by resetting:
       * - Planchette to center position (50, 50)
       * - All animation state
       * - Turn to 'user'
       * - Conversation history
       * - Spirit name
       * - Intro completion flag
       * - Error message
       * - Activity timestamp to now
       *
       * Used when starting a new séance or when the "New Séance" button is clicked.
       * This also clears persisted state from localStorage.
       */
      resetSession: () =>
        set(() => ({
          planchette: {
            position: { x: 50, y: 50 },
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
      /**
       * Persist middleware configuration
       *
       * @remarks
       * Configures how state is saved to and restored from localStorage.
       *
       * Configuration:
       * - `name`: localStorage key ('ouija-session')
       * - `partialize`: Function to select which state to persist
       * - `merge`: Custom merge logic with timeout and validation
       */
      name: 'ouija-session',
      /**
       * Partialize function - selects which state properties to persist
       *
       * @param state - The full Zustand state
       * @returns Object containing only the properties to persist
       *
       * @remarks
       * Only persists:
       * - `conversationHistory`: Full message history
       * - `spiritName`: Name of channeled spirit
       * - `hasCompletedIntro`: Intro completion flag
       * - `lastActivityTimestamp`: For timeout validation
       *
       * Does NOT persist:
       * - Planchette position/rotation (always starts at center)
       * - Animation state (always starts clean)
       * - Turn state (always starts at 'user')
       * - Error messages (don't carry over between sessions)
       */
      partialize: (state) => ({
        conversationHistory: state.conversationHistory,
        spiritName: state.spiritName,
        hasCompletedIntro: state.hasCompletedIntro,
        lastActivityTimestamp: state.lastActivityTimestamp,
      }),
      /**
       * Custom merge function with session timeout and validation
       *
       * @param persistedState - State loaded from localStorage (unknown type for safety)
       * @param currentState - Fresh initial state from store definition
       * @returns Merged state (either restored or fresh)
       *
       * @remarks
       * Merge logic:
       * 1. If no persisted state exists, return fresh state
       * 2. Check if more than 5 minutes have passed since last activity
       *    - If timeout expired, return fresh state (start new session)
       * 3. Validate session integrity:
       *    - Must have a spirit name
       *    - Must have either completed intro OR have conversation messages
       * 4. If valid session, restore persisted state and merge with current state
       * 5. Always set `hasCompletedIntro` to true when restoring (skip intro)
       *
       * This prevents resuming:
       * - Stale/expired sessions (>5 min old)
       * - Incomplete sessions (no spirit name, no intro, no messages)
       * - Corrupted/invalid sessions (missing required fields)
       */
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

        // Otherwise, restore the conversation if we have a valid session
        // Valid session = has spirit name AND (intro was completed OR has messages)
        const hasValidSession =
          !!state.spiritName &&
          (!!state.hasCompletedIntro ||
            (state.conversationHistory?.length || 0) > 0);

        // Only restore if we have a valid session
        if (!hasValidSession) {
          return currentState;
        }

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
