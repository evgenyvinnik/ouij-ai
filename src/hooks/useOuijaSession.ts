import { useCallback, useEffect, useState } from 'react';
import { useOuijaStore } from '../state/useOuijaStore';

/**
 * Return value from the useOuijaSession hook
 */
interface OuijaSessionReturn {
  /** Current keyboard input buffer (what the user is typing) */
  inputBuffer: string;
  /** Whether it's currently the user's turn to type */
  isUserTurn: boolean;
  /** Whether the spirit is currently thinking/responding */
  isSpiritTurn: boolean;
  /** Whether the planchette is currently animating */
  isAnimating: boolean;
}

/**
 * Custom hook for managing Ouija board session and keyboard input
 *
 * @returns Session state including input buffer and turn indicators
 *
 * @remarks
 * This hook manages the keyboard input system for the Ouija board experience.
 * It captures keypresses globally and maintains a typing buffer, but only
 * accepts input during the user's turn.
 *
 * Input handling:
 * - Captures all keyboard input globally (when not focused on input/textarea)
 * - Only accepts input when `turn === 'user'`
 * - Enter key submits the question and adds to history
 * - Backspace removes last character from buffer
 * - All other single-character keys append to buffer
 * - Buffer is limited to 200 characters
 *
 * Turn management:
 * - `isUserTurn`: User can type and submit questions
 * - `isSpiritTurn`: Waiting for AI response from server
 * - `isAnimating`: Planchette is spelling out spirit's response
 *
 * Side effects:
 * - Registers global keydown listener on mount
 * - Cleans up listener on unmount
 * - Dependencies: turn, inputBuffer, submitQuestion, addToHistory
 *
 * Integration:
 * - Uses `submitQuestion` to trigger AI chat mutation
 * - Uses `addToHistory` to save user message
 * - Clears buffer after successful submission
 *
 * @example
 * ```tsx
 * function ChatPanel() {
 *   const { inputBuffer, isUserTurn, isAnimating } = useOuijaSession();
 *
 *   return (
 *     <div>
 *       {isUserTurn && <p>Type your question: {inputBuffer}</p>}
 *       {isAnimating && <p>Spirit is responding...</p>}
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link useOuijaStore} for state management
 */
export function useOuijaSession(): OuijaSessionReturn {
  const { turn, submitQuestion, addToHistory } = useOuijaStore();
  const [inputBuffer, setInputBuffer] = useState('');

  /**
   * Keyboard event handler for global input capture
   *
   * @param e - Keyboard event from window
   *
   * @remarks
   * Key handling logic:
   * 1. Ignore if user is typing in an input/textarea element
   * 2. Only accept input during user's turn (turn === 'user')
   * 3. Enter: Submit question if buffer has content
   * 4. Backspace: Remove last character from buffer
   * 5. Single characters: Append to buffer (max 200 chars)
   *
   * This prevents conflicts with other input elements on the page
   * while still allowing "type anywhere" functionality for the
   * Ouija board experience.
   *
   * Dependencies: turn, inputBuffer, submitQuestion, addToHistory
   * These are included to ensure the callback has latest values.
   */
  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea element
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
        return;
      }

      // Only accept input during user's turn
      if (turn !== 'user') return;

      if (e.key === 'Enter' && inputBuffer.trim()) {
        // Submit question
        submitQuestion(inputBuffer.trim());
        addToHistory({
          role: 'user',
          content: inputBuffer.trim(),
        });
        setInputBuffer('');
      } else if (e.key === 'Backspace') {
        // Remove last character
        setInputBuffer((prev) => prev.slice(0, -1));
      } else if (e.key.length === 1 && inputBuffer.length < 200) {
        // Add character
        setInputBuffer((prev) => prev + e.key);
      }
    },
    [turn, inputBuffer, submitQuestion, addToHistory]
  );

  /**
   * Effect to register/cleanup global keydown listener
   *
   * @remarks
   * Registers the handleKeyPress callback on window.keydown event.
   * Cleans up the listener when component unmounts or handleKeyPress changes.
   *
   * Dependencies: [handleKeyPress]
   * Re-registers listener when callback changes (due to its dependencies).
   */
  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  return {
    inputBuffer,
    isUserTurn: turn === 'user',
    isSpiritTurn: turn === 'spirit',
    isAnimating: turn === 'animating',
  };
}
