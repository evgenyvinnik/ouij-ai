import { useMutation } from '@tanstack/react-query';
import { useOuijaStore } from '../state/useOuijaStore';
import { sendChatMessage } from '../api/chatClient';
import { Message } from '../types/ouija';

/**
 * Variables passed to the chat mutation
 */
interface ChatMutationVariables {
  /** The user's question to the spirit */
  message: string;
  /** Conversation history for context */
  history: Message[];
  /** Optional name of the spirit being channeled */
  spiritName?: string;
}

/**
 * Custom hook for AI chat with Server-Sent Events (SSE) streaming using TanStack Query
 *
 * @returns TanStack Query mutation object for sending chat messages
 *
 * @remarks
 * This hook manages the AI chat flow:
 * 1. Sends user message to the `/api/chat` endpoint
 * 2. Receives SSE stream with token and letter events
 * 3. Queues letters for planchette animation
 * 4. Handles errors and state transitions
 *
 * The mutation uses `sendChatMessage` which:
 * - Establishes SSE connection to Edge Function
 * - Streams response letter-by-letter
 * - Updates Zustand store with animation queue
 *
 * State management:
 * - `queueLetters`: Adds letters to animation queue
 * - `setTurn`: Changes game state (user/spirit/animating)
 * - `clearAnimation`: Resets animation state on error
 * - `setError`: Sets error message for display
 *
 * @example
 * ```tsx
 * const chatMutation = useAIChat();
 *
 * const handleSubmit = () => {
 *   chatMutation.mutate({
 *     message: "Is anyone there?",
 *     history: conversationHistory,
 *     spiritName: "Edgar Allan Poe"
 *   });
 * };
 *
 * if (chatMutation.isPending) {
 *   // Show loading state
 * }
 * ```
 *
 * @see {@link sendChatMessage} for SSE client implementation
 * @see {@link useOuijaStore} for state management
 */
export function useAIChat() {
  const { queueLetters, setTurn, clearAnimation, setError } = useOuijaStore();

  /**
   * TanStack Query mutation for sending chat messages and handling SSE responses
   *
   * @remarks
   * Mutation flow:
   * 1. Calls `sendChatMessage` with message, history, and spirit name
   * 2. Receives callbacks for SSE events (onToken, onLetters, onDone, onError)
   * 3. Accumulates assistant response text
   * 4. Queues letters for animation as they arrive
   * 5. Returns complete assistant response when done
   *
   * The assistant response is accumulated but not directly used for display.
   * Instead, revealed letters from the animation queue are shown to the user.
   * The response is added to conversation history when animation completes.
   *
   * Error handling:
   * - Network errors trigger onError callback
   * - Sets error message in store for display
   * - Returns turn to user and clears animation state
   */
  const mutation = useMutation({
    mutationFn: async ({
      message,
      history,
      spiritName,
    }: ChatMutationVariables) => {
      // Accumulate assistant response for conversation history
      let assistantResponse = '';

      await sendChatMessage(
        { message, history, spiritName },
        {
          /**
           * Callback for individual text tokens from Claude
           * @param token - Text token from the AI response
           * @remarks Used to build complete assistant response for history
           */
          onToken: (token) => {
            assistantResponse += token;
          },
          /**
           * Callback for letter arrays to animate
           * @param letters - Array of letters to spell on the board
           * @remarks
           * Letters are queued for planchette animation. The message
           * will be added to history when animation completes.
           */
          onLetters: (letters) => {
            // Queue letters for animation
            // Message will be added to history when animation completes
            queueLetters(letters);
          },
          /**
           * Callback when SSE stream completes successfully
           * @remarks
           * Animation hook will handle turn change and add message to history.
           * No action needed here.
           */
          onDone: () => {
            // Animation will handle turn change and add message to history
          },
          /**
           * Callback for errors during SSE streaming
           * @param error - Error message describing what went wrong
           * @remarks
           * Sets error in store, returns control to user, and clears
           * any incomplete animation state.
           */
          onError: (error) => {
            setError(error);
            setTurn('user');
            clearAnimation();
          },
        }
      );

      return assistantResponse;
    },
  });

  return mutation;
}
