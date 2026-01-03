import { useEffect, useRef } from 'react';
import { useOuijaStore } from '../state/useOuijaStore';
import { getLetterCoord, coordToPercent, shouldUseTipPointer } from '../utils/letterCoords';
import { easeOutCubic, lerp } from '../utils/animations';

/**
 * Hook for animating the planchette to spell out letters
 * Uses requestAnimationFrame for smooth 60fps animation
 */
export function usePlanchetteAnimation() {
  const { animation, movePlanchette, revealNextLetter } = useOuijaStore();
  const animationFrameRef = useRef<number | undefined>(undefined);
  const startTimeRef = useRef<number | undefined>(undefined);
  const startPosRef = useRef<{ x: number; y: number } | undefined>(undefined);
  const targetPosRef = useRef<{ x: number; y: number } | undefined>(undefined);

  useEffect(() => {
    if (!animation.isAnimating || animation.letterQueue.length === 0) {
      return;
    }

    const currentLetter = animation.letterQueue[animation.currentLetterIndex];
    if (!currentLetter) {
      return;
    }

    // Get board dimensions (assuming a standard size)
    const boardWidth = 400;
    const boardHeight = 300;

    // Get target coordinates for current letter
    const letterCoord = getLetterCoord(currentLetter);
    const useTip = shouldUseTipPointer(currentLetter);
    const targetPercent = coordToPercent(letterCoord, boardWidth, boardHeight, useTip);

    // Store start position from current planchette location
    const currentPos = useOuijaStore.getState().planchette.position;
    startPosRef.current = { x: currentPos.x, y: currentPos.y };
    targetPosRef.current = targetPercent;
    startTimeRef.current = Date.now();

    // Animation parameters
    const MOVE_DURATION = 800; // ms to move to letter
    const PAUSE_DURATION = 300; // ms to pause at letter

    let phase: 'moving' | 'paused' = 'moving';
    let pauseStartTime = 0;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - (startTimeRef.current || now);

      if (phase === 'moving') {
        const progress = Math.min(elapsed / MOVE_DURATION, 1);
        const eased = easeOutCubic(progress);

        if (startPosRef.current && targetPosRef.current) {
          const x = lerp(startPosRef.current.x, targetPosRef.current.x, eased);
          const y = lerp(startPosRef.current.y, targetPosRef.current.y, eased);
          movePlanchette({ x, y });
        }

        if (progress >= 1) {
          // Transition to pause phase
          phase = 'paused';
          pauseStartTime = now;
        }
      } else if (phase === 'paused') {
        const pauseElapsed = now - pauseStartTime;

        if (pauseElapsed >= PAUSE_DURATION) {
          // Reveal letter and move to next
          revealNextLetter();
          return; // Exit animation loop, will restart with next letter
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    animation.isAnimating,
    animation.currentLetterIndex,
    animation.letterQueue,
    movePlanchette,
    revealNextLetter,
  ]);

  return {
    isAnimating: animation.isAnimating,
    currentLetter: animation.letterQueue[animation.currentLetterIndex],
    revealedLetters: animation.revealedLetters,
  };
}
