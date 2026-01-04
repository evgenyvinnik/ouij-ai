import { useCallback, useEffect } from 'react';
import { useOuijaStore } from '../state/useOuijaStore';
import { Position } from '../types/ouija';

/**
 * Hook for managing planchette position and drag interactions
 */
export function usePlanchette() {
  const { planchette, movePlanchette, setOffset, setDragging } =
    useOuijaStore();

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setDragging(true);
      const rect = e.currentTarget.getBoundingClientRect();
      const offsetX = e.clientX - rect.left - rect.width / 2;
      const offsetY = e.clientY - rect.top - rect.height / 2;
      setOffset({ x: offsetX, y: offsetY });
    },
    [setDragging, setOffset]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!planchette.isDragging) return;

      const boardElement = document.querySelector('.ouija-board');
      if (!boardElement) return;

      const rect = boardElement.getBoundingClientRect();
      const x =
        ((e.clientX - rect.left - planchette.offset.x) / rect.width) * 100;
      const y =
        ((e.clientY - rect.top - planchette.offset.y) / rect.height) * 100;

      // Clamp values
      const clampedX = Math.max(0, Math.min(100, x));
      const clampedY = Math.max(0, Math.min(100, y));

      movePlanchette({ x: clampedX, y: clampedY });
    },
    [planchette.isDragging, planchette.offset, movePlanchette]
  );

  const handleMouseUp = useCallback(() => {
    setDragging(false);
  }, [setDragging]);

  useEffect(() => {
    if (planchette.isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [planchette.isDragging, handleMouseMove, handleMouseUp]);

  return {
    position: planchette.position,
    isDragging: planchette.isDragging,
    handleMouseDown,
  };
}

/**
 * Programmatically move planchette to a target position
 */
export function useMovePlanchetteTo() {
  const movePlanchette = useOuijaStore((state) => state.movePlanchette);

  return useCallback(
    (target: Position, duration: number = 1000): Promise<void> => {
      return new Promise((resolve) => {
        const startTime = Date.now();
        const currentPosition = useOuijaStore.getState().planchette.position;

        const animate = () => {
          const elapsed = Date.now() - startTime;
          const progress = Math.min(elapsed / duration, 1);

          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3);

          const x = currentPosition.x + (target.x - currentPosition.x) * eased;
          const y = currentPosition.y + (target.y - currentPosition.y) * eased;

          movePlanchette({ x, y });

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            resolve();
          }
        };

        requestAnimationFrame(animate);
      });
    },
    [movePlanchette]
  );
}
