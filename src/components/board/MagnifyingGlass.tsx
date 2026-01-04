interface MagnifyingGlassProps {
  isActive?: boolean;
}

export function MagnifyingGlass({ isActive = false }: MagnifyingGlassProps) {
  return (
    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
      {/* Pointer dot - this is what points at letters */}
      <div
        className={`relative flex h-10 w-10 items-center justify-center transition-opacity duration-300 ${
          isActive ? 'opacity-100' : 'opacity-60'
        }`}
      >
        {/* Outer glow */}
        <div
          className={`absolute inset-0 rounded-full bg-ouija-gold blur-md ${
            isActive ? 'opacity-50 animate-pulse' : 'opacity-30'
          }`}
        ></div>

        {/* Glass circle */}
        <div className="relative h-8 w-8 rounded-full border-2 border-ouija-gold bg-black/50 backdrop-blur-sm">
          {/* Inner crosshair for precise targeting */}
          <div className="absolute left-1/2 top-1/2 h-[2px] w-4 -translate-x-1/2 -translate-y-1/2 bg-ouija-gold/50"></div>
          <div className="absolute left-1/2 top-1/2 h-4 w-[2px] -translate-x-1/2 -translate-y-1/2 bg-ouija-gold/50"></div>

          {/* Center point */}
          <div
            className={`absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-ouija-gold ${
              isActive ? 'animate-pulse' : ''
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
}
