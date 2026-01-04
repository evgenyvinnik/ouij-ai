import { usePlanchette } from '../../hooks/usePlanchette';
import { useOuijaStore } from '../../state/useOuijaStore';
import { shouldUseTipPointer } from '../../utils/letterCoords';

export function Planchette() {
  const { position, isDragging, handleMouseDown } = usePlanchette();
  const { animation, planchette } = useOuijaStore();

  // Determine which pointer is active
  const currentLetter = animation.letterQueue[animation.currentLetterIndex];
  const isUsingTip = currentLetter && shouldUseTipPointer(currentLetter);

  return (
    <div
      className={`absolute z-20 cursor-grab ${
        isDragging ? 'cursor-grabbing' : ''
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        width: '18%',
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="relative">
        {/* Actual planchette image */}
        <img
          src="/planchette2.png"
          alt="Planchette"
          className={`w-full ${
            isDragging ? 'scale-110' : ''
          }`}
          style={{
            filter: isDragging
              ? 'drop-shadow(5px 5px 5px rgb(255, 198, 198))'
              : 'drop-shadow(5px 5px 5px #222)',
            transform: `rotate(${planchette.rotation}deg)`,
            transition: isDragging
              ? 'transform 0.3s ease-out, filter 0.3s ease-out, scale 0.3s ease-out'
              : 'filter 0.3s ease-out', // No transition on transform during animation
          }}
        />

        {/* Tip pointer indicator - HIDDEN for YES/NO/GOODBYE - only visible for letters/numbers */}
        {/* Note: We no longer show the marker at all for YES/NO/GOODBYE */}
      </div>
    </div>
  );
}
