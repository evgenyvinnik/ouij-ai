import { LETTER_COORDS } from '../../utils/letterCoords';

/**
 * Calibration overlay to visualize letter coordinate positions
 * Shows dots where the planchette should point for each letter
 * Enable/disable with a toggle
 */
export function CalibrationOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-0 z-50">
      {Object.entries(LETTER_COORDS).map(([char, coord]) => {
        // Convert pixel coords to percentages
        // Board dimensions from aspectRatio: 1920 x 1282
        const boardWidth = 1920;
        const boardHeight = 1282;

        const xPercent = 50 + (coord.x / boardWidth) * 100;
        const yPercent = 50 + (coord.y / boardHeight) * 100;

        return (
          <div
            key={char}
            className="absolute flex items-center justify-center"
            style={{
              left: `${xPercent}%`,
              top: `${yPercent}%`,
              transform: 'translate(-50%, -50%)',
            }}
          >
            {/* Crosshair */}
            <div className="relative h-8 w-8">
              {/* Horizontal line */}
              <div className="absolute left-1/2 top-1/2 h-[3px] w-8 -translate-x-1/2 -translate-y-1/2 bg-red-500 opacity-100"></div>
              {/* Vertical line */}
              <div className="absolute left-1/2 top-1/2 h-8 w-[3px] -translate-x-1/2 -translate-y-1/2 bg-red-500 opacity-100"></div>
              {/* Center dot */}
              <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600 ring-2 ring-white"></div>
            </div>

            {/* Label with background */}
            <div
              className="absolute left-1/2 top-10 -translate-x-1/2 rounded bg-black/80 px-2 py-1 text-xs font-bold text-red-500 ring-1 ring-red-500"
            >
              {char}
            </div>
          </div>
        );
      })}

      {/* Instructions - more visible */}
      <div className="pointer-events-auto absolute right-4 top-4 z-50 max-w-xs rounded-lg border-2 border-red-500 bg-black p-4 text-sm text-white shadow-2xl">
        <h3 className="mb-2 text-lg font-bold text-red-500">🎯 Calibration Mode Active</h3>
        <p className="mb-2">Red crosshairs show target letter positions.</p>
        <p className="mb-2">
          The gold center in the planchette should align with these crosshairs.
        </p>
        <p className="rounded bg-yellow-900 px-2 py-1 text-yellow-300">
          Press F1 or click button to toggle
        </p>
      </div>
    </div>
  );
}
