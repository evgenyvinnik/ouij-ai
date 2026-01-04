/**
 * Planchette - Animated pointer piece that moves across the Ouija board
 *
 * Renders the planchette (triangular pointer) that glides across the board
 * to spell out spirit messages. Position and rotation are controlled by
 * the global animation state.
 *
 * @remarks
 * Visual effects change based on animation state:
 * - Scale increases during animation
 * - Drop shadow glows white while animating
 * - Smooth transitions for all transformations
 */

import { useOuijaStore } from '../../state/useOuijaStore';

/**
 * Renders the planchette with position, rotation, and animation effects
 *
 * @returns JSX element containing the animated planchette image
 */
export function Planchette() {
  const { planchette } = useOuijaStore();
  const isAnimating = useOuijaStore((state) => state.animation.isAnimating);

  return (
    <div
      className="absolute z-20 pointer-events-none"
      style={{
        left: `${planchette.position.x}%`,
        top: `${planchette.position.y}%`,
        transform: 'translate(-50%, -50%)',
        width: '18%',
      }}
    >
      <img
        src="/planchette2.png"
        alt="Planchette"
        className={`w-full ${isAnimating ? 'scale-110' : ''}`}
        style={{
          filter: isAnimating
            ? 'drop-shadow(5px 5px 5px rgb(255, 255, 255))'
            : 'drop-shadow(5px 5px 5px #222)',
          transform: `rotate(${planchette.rotation}deg)`,
          transition: isAnimating
            ? 'transform 0.3s ease-out, filter 0.3s ease-out, scale 0.3s ease-out'
            : 'filter 0.3s ease-out',
        }}
      />
    </div>
  );
}
