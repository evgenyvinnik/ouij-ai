import { useEffect, useRef } from 'react';
import { useOuijaStore } from '../state/useOuijaStore';
import { getLetterCoord, coordToPercent, shouldUseTipPointer } from '../utils/letterCoords';
import { easeOutCubic, bezierCurve, bezierTangentAngle, easeInOutCubic } from '../utils/animations';

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

    // Get board dimensions (must match the coordinate system used in letterCoords.ts)
    // These are the pixel dimensions of the coordinate space, not the actual rendered size
    const boardWidth = 1920;
    const boardHeight = 1282;

    // Get target coordinates for current letter
    const letterCoord = getLetterCoord(currentLetter);
    const useTip = shouldUseTipPointer(currentLetter);
    const targetPercent = coordToPercent(letterCoord, boardWidth, boardHeight, useTip);

    // Store start position from current planchette location
    const currentPos = useOuijaStore.getState().planchette.position;
    startPosRef.current = { x: currentPos.x, y: currentPos.y };
    targetPosRef.current = targetPercent;
    startTimeRef.current = Date.now();

    // Calculate distance for adaptive timing
    const dx = targetPercent.x - currentPos.x;
    const dy = targetPercent.y - currentPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Animation parameters - adaptive based on distance
    const BASE_MOVE_DURATION = 1200; // Base duration for average moves
    const MIN_DURATION = 800; // Minimum for very short moves
    const MAX_DURATION = 2000; // Maximum for very long moves (like L to O)

    // Scale duration based on distance (percentage units)
    const distanceScale = Math.min(distance / 30, 2); // Normalize to typical distance
    const MOVE_DURATION = Math.max(
      MIN_DURATION,
      Math.min(MAX_DURATION, BASE_MOVE_DURATION * distanceScale)
    );
    const PAUSE_DURATION = 500; // ms to pause at letter (slightly longer)

    let phase: 'moving' | 'paused' = 'moving';
    let pauseStartTime = 0;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - (startTimeRef.current || now);

      if (phase === 'moving') {
        const progress = Math.min(elapsed / MOVE_DURATION, 1);

        // Use different easing for position and rotation for smoother feel
        const positionEased = easeOutCubic(progress);
        const rotationEased = easeInOutCubic(progress); // Smoother rotation

        if (startPosRef.current && targetPosRef.current) {
          // Use bezier curve for smooth, curved path
          const position = bezierCurve(startPosRef.current, targetPosRef.current, positionEased);

          // Calculate rotation angle based on the tangent of the curve
          // This makes the planchette follow the curve naturally
          const angle = bezierTangentAngle(
            startPosRef.current,
            targetPosRef.current,
            rotationEased // Use separate easing for smoother rotation
          );

          movePlanchette(position, angle);
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
