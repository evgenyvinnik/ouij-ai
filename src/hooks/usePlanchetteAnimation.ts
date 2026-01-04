import { useEffect, useRef } from 'react';
import { useOuijaStore } from '../state/useOuijaStore';
import {
  getLetterCoord,
  coordToPercent,
  shouldUseTipPointer,
  TIP_OFFSET_PERCENT,
} from '../utils/letterCoords';
import {
  easeOutCubic,
  bezierCurve,
  bezierTangentAngle,
  easeInOutCubic,
} from '../utils/animations';

/**
 * Return value from the usePlanchetteAnimation hook
 */
interface PlanchetteAnimationReturn {
  /** Whether planchette is currently animating */
  isAnimating: boolean;
  /** Current letter being animated (if any) */
  currentLetter: string | undefined;
  /** Array of letters that have been revealed to the user */
  revealedLetters: string[];
}

/**
 * Custom hook for animating the planchette to spell out letters
 *
 * @returns Animation state including current letter and revealed letters
 *
 * @remarks
 * This hook manages smooth 60fps animations using `requestAnimationFrame`.
 * It runs whenever `animation.isAnimating` is true and letters are queued.
 *
 * Animation architecture:
 * - **Two-phase system**: Moving phase + Pause phase
 * - **Adaptive timing**: Duration scales with distance traveled
 * - **Bezier curves**: Smooth, natural-feeling arcs between letters
 * - **Tangent rotation**: Planchette rotates to follow the curve
 * - **Tip offset**: Special handling for YES/NO/GOODBYE positions
 *
 * Movement calculations:
 * 1. Get target coordinates for current letter
 * 2. Calculate distance from current position
 * 3. Scale animation duration based on distance
 * 4. Use bezier curve for smooth path
 * 5. Calculate tangent angle for rotation
 * 6. Apply tip offset if needed (YES/NO/GOODBYE)
 *
 * Coordinate system:
 * - Board dimensions: 1920x1282 pixels (design space)
 * - Positions stored as percentages (0-100) for responsiveness
 * - Center point: (50%, 50%)
 *
 * Special letter handling:
 * - YES/NO/GOODBYE use tip pointer (requires offset calculation)
 * - Regular letters use center of magnifying glass
 * - Tip offset is rotated to match planchette orientation
 *
 * Performance:
 * - Uses refs to avoid recreating animation loop on re-renders
 * - Cleanup cancels RAF when component unmounts
 * - Only one letter animated at a time
 *
 * @example
 * ```tsx
 * function OuijaBoard() {
 *   const { isAnimating, currentLetter, revealedLetters } = usePlanchetteAnimation();
 *
 *   return (
 *     <div>
 *       {isAnimating && <p>Animating to: {currentLetter}</p>}
 *       <p>Message: {revealedLetters.join('')}</p>
 *     </div>
 *   );
 * }
 * ```
 *
 * @see {@link useOuijaStore} for animation state management
 * @see {@link bezierCurve} for path calculation
 * @see {@link bezierTangentAngle} for rotation calculation
 */
export function usePlanchetteAnimation(): PlanchetteAnimationReturn {
  const { animation, movePlanchette, revealNextLetter } = useOuijaStore();

  // Refs to maintain state across animation frames without causing re-renders
  /** RAF handle for canceling animation on unmount */
  const animationFrameRef = useRef<number | undefined>(undefined);
  /** Timestamp when current animation started */
  const startTimeRef = useRef<number | undefined>(undefined);
  /** Starting position for current letter animation */
  const startPosRef = useRef<{ x: number; y: number } | undefined>(undefined);
  /** Target position for current letter animation */
  const targetPosRef = useRef<{ x: number; y: number } | undefined>(undefined);

  /**
   * Main animation effect
   *
   * @remarks
   * This effect runs whenever:
   * - Animation state changes (isAnimating, currentLetterIndex, letterQueue)
   * - Store actions are updated (movePlanchette, revealNextLetter)
   *
   * The effect:
   * 1. Guards against running when not animating or queue is empty
   * 2. Gets target coordinates for current letter
   * 3. Calculates adaptive duration based on distance
   * 4. Starts RAF loop with two phases: moving and paused
   * 5. Cleans up RAF on unmount or when dependencies change
   *
   * Phase 1 - Moving:
   * - Interpolates position using bezier curve
   * - Calculates rotation from curve tangent
   * - Applies tip offset for YES/NO/GOODBYE
   * - Uses easeOutCubic for position, easeInOutCubic for rotation
   *
   * Phase 2 - Paused:
   * - Holds position for PAUSE_DURATION ms
   * - Reveals letter and triggers next animation
   *
   * Timing constants:
   * - BASE_MOVE_DURATION: 1200ms for average distance
   * - MIN_DURATION: 800ms for very short moves
   * - MAX_DURATION: 2000ms for very long moves (e.g., L to O)
   * - PAUSE_DURATION: 500ms pause at each letter
   */
  useEffect(() => {
    if (!animation.isAnimating || animation.letterQueue.length === 0) {
      return;
    }

    const currentLetter = animation.letterQueue[animation.currentLetterIndex];
    if (!currentLetter) {
      return;
    }

    // Board dimensions in pixels - this is the design space coordinate system
    // (not the actual rendered size, which is responsive)
    const boardWidth = 1920;
    const boardHeight = 1282;

    // Get target coordinates for current letter
    const letterCoord = getLetterCoord(currentLetter);
    const useTip = shouldUseTipPointer(currentLetter);
    const targetPercent = coordToPercent(letterCoord, boardWidth, boardHeight);

    // Store start position from current planchette location
    const currentPos = useOuijaStore.getState().planchette.position;
    startPosRef.current = { x: currentPos.x, y: currentPos.y };
    targetPosRef.current = targetPercent;
    startTimeRef.current = Date.now();

    // Calculate distance for adaptive timing
    const dx = targetPercent.x - currentPos.x;
    const dy = targetPercent.y - currentPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Animation timing parameters - adaptive based on distance
    // Longer distances get longer durations to maintain consistent speed
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

    // Animation phase state
    let phase: 'moving' | 'paused' = 'moving';
    let pauseStartTime = 0;

    /**
     * RAF animation loop - runs at 60fps
     *
     * @remarks
     * This function is called repeatedly by requestAnimationFrame.
     * It manages the two-phase animation:
     *
     * **Moving phase:**
     * 1. Calculate progress (0-1) based on elapsed time
     * 2. Apply different easing to position and rotation for smoothness
     * 3. Use bezier curve for curved path between letters
     * 4. Calculate tangent angle to make planchette point along curve
     * 5. Apply tip offset for YES/NO/GOODBYE (rotated to match orientation)
     * 6. Update planchette position and rotation in store
     * 7. Transition to paused phase when progress reaches 1
     *
     * **Paused phase:**
     * 1. Hold position for PAUSE_DURATION ms
     * 2. Call revealNextLetter() to show letter and advance queue
     * 3. Exit RAF loop (next letter will trigger new animation)
     *
     * Bezier curve calculation:
     * - Creates smooth arc between start and end positions
     * - Adaptive curve factor prevents extreme arcs on long jumps
     * - Tangent angle makes planchette point in direction of movement
     *
     * Tip offset (YES/NO/GOODBYE):
     * - Planchette tip must point at target, not center
     * - Offset is 18% of board height (TIP_OFFSET_PERCENT.y)
     * - Offset is rotated to match planchette's current angle
     * - Applied as sine/cosine components in x/y
     */
    const animate = () => {
      const now = Date.now();
      const elapsed = now - (startTimeRef.current || now);

      if (phase === 'moving') {
        // Calculate progress (0-1) based on elapsed time vs duration
        const progress = Math.min(elapsed / MOVE_DURATION, 1);

        // Use different easing for position and rotation for smoother feel
        const positionEased = easeOutCubic(progress);
        const rotationEased = easeInOutCubic(progress); // Smoother rotation

        if (startPosRef.current && targetPosRef.current) {
          // Use bezier curve for smooth, curved path between letters
          // This creates a natural "seeking" motion like a homing missile
          let position = bezierCurve(
            startPosRef.current,
            targetPosRef.current,
            positionEased
          );

          // Calculate rotation angle based on the tangent of the curve
          // This makes the planchette follow the curve naturally,
          // pointing in the direction of movement
          const angle = bezierTangentAngle(
            startPosRef.current,
            targetPosRef.current,
            rotationEased // Use separate easing for smoother rotation
          );

          // Apply tip offset if using tip pointer (YES/NO/GOODBYE)
          // The offset must be rotated to match the planchette's orientation
          if (useTip) {
            // Convert rotation angle to radians for trigonometry
            const angleRad = (angle * Math.PI) / 180;

            // Calculate rotated offset distance
            // The planchette rotates +90° from the direction of movement,
            // so we need to rotate our offset by the same amount
            const offsetDistance = (TIP_OFFSET_PERCENT.y / 100) * 18; // 18% is planchette width
            const offsetX = Math.sin(angleRad) * offsetDistance;
            const offsetY = -Math.cos(angleRad) * offsetDistance;

            // Apply the rotated offset to position the tip at the target
            position = {
              x: position.x + offsetX,
              y: position.y + offsetY,
            };
          }

          // Update planchette position and rotation in store
          movePlanchette(position, angle);
        }

        if (progress >= 1) {
          // Transition to pause phase when movement completes
          phase = 'paused';
          pauseStartTime = now;
        }
      } else if (phase === 'paused') {
        // Hold at letter position for PAUSE_DURATION
        const pauseElapsed = now - pauseStartTime;

        if (pauseElapsed >= PAUSE_DURATION) {
          // Reveal letter and move to next in queue
          // This will trigger a new animation for the next letter
          revealNextLetter();
          return; // Exit animation loop, will restart with next letter
        }
      }

      // Schedule next frame
      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Start animation loop
    animationFrameRef.current = requestAnimationFrame(animate);

    // Cleanup: cancel animation on unmount or when dependencies change
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
