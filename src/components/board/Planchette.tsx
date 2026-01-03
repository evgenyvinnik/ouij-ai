import { usePlanchette } from '../../hooks/usePlanchette';
import { MagnifyingGlass } from './MagnifyingGlass';
import { useOuijaStore } from '../../state/useOuijaStore';
import { shouldUseTipPointer } from '../../utils/letterCoords';

export function Planchette() {
  const { position, isDragging, handleMouseDown } = usePlanchette();
  const { animation } = useOuijaStore();

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
        {/* Actual planchette image from original */}
        <img
          src="/planchette2.png"
          alt="Planchette"
          className={`w-full transition-all duration-300 ${
            isDragging ? 'scale-110' : ''
          }`}
          style={{
            filter: isDragging
              ? 'drop-shadow(5px 5px 5px rgb(255, 198, 198))'
              : 'drop-shadow(5px 5px 5px #222)',
            transform: 'rotate(130deg)',
          }}
        />

        {/* Center magnifying glass - for letters/numbers */}
        <MagnifyingGlass isActive={!isUsingTip && animation.isAnimating} />

        {/* Tip pointer - for YES/NO/GOODBYE */}
        <div
          className="absolute"
          style={{
            left: '50%',
            top: '85%', // Position at the tip of the planchette
            transform: 'translate(-50%, -50%)',
          }}
        >
          <div className={`relative flex h-6 w-6 items-center justify-center transition-opacity duration-300 ${
            isUsingTip ? 'opacity-100' : 'opacity-30'
          }`}>
            {/* Outer glow when active */}
            {isUsingTip && (
              <div className="absolute inset-0 rounded-full bg-red-500 opacity-40 blur-md animate-pulse"></div>
            )}

            {/* Tip point indicator */}
            <div className={`relative h-4 w-4 rounded-full border-2 ${
              isUsingTip ? 'border-red-500 bg-red-500/50' : 'border-ouija-gold/30 bg-ouija-gold/10'
            }`}>
              {/* Center dot */}
              <div className={`absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${
                isUsingTip ? 'bg-red-500' : 'bg-ouija-gold/30'
              }`}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
