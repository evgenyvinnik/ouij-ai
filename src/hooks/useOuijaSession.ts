import { useCallback, useEffect, useState } from 'react';
import { useOuijaStore } from '../state/useOuijaStore';

/**
 * Hook for managing Ouija board session and keyboard input
 */
export function useOuijaSession() {
  const { turn, submitQuestion, addToHistory } = useOuijaStore();
  const [inputBuffer, setInputBuffer] = useState('');

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
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
