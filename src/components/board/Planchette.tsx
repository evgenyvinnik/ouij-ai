import { usePlanchette } from '../../hooks/usePlanchette';
import { MagnifyingGlass } from './MagnifyingGlass';

export function Planchette() {
  const { position, isDragging, handleMouseDown } = usePlanchette();

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

        {/* Magnifying glass effect */}
        <MagnifyingGlass />
      </div>
    </div>
  );
}
