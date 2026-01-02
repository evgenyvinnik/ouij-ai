import { usePlanchette } from '../../hooks/usePlanchette';
import { MagnifyingGlass } from './MagnifyingGlass';

export function Planchette() {
  const { position, isDragging, handleMouseDown } = usePlanchette();

  return (
    <div
      className={`absolute z-20 cursor-grab transition-shadow ${
        isDragging ? 'cursor-grabbing scale-110' : ''
      }`}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onMouseDown={handleMouseDown}
    >
      <div
        className={`relative h-24 w-24 ${
          isDragging ? '' : 'animate-pulse-slow'
        }`}
      >
        {/* Planchette body - heart/teardrop shape */}
        <svg
          viewBox="0 0 100 100"
          className="h-full w-full drop-shadow-2xl"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Outer glow */}
          <circle
            cx="50"
            cy="40"
            r="45"
            className="fill-ouija-gold opacity-20 blur-xl"
          />

          {/* Main body */}
          <path
            d="M 50,20 C 30,20 20,30 20,45 C 20,60 35,75 50,90 C 65,75 80,60 80,45 C 80,30 70,20 50,20 Z"
            className="fill-gradient-to-b from-amber-100 to-amber-300 stroke-ouija-wood"
            strokeWidth="2"
          />

          {/* Inner circle (viewing hole) */}
          <circle
            cx="50"
            cy="45"
            r="12"
            className="fill-transparent stroke-ouija-wood"
            strokeWidth="2"
          />
        </svg>

        {/* Magnifying glass effect */}
        <MagnifyingGlass />
      </div>
    </div>
  );
}
