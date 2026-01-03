import { useState, useEffect } from 'react';
import { LETTER_COORDS } from '../../utils/letterCoords';

interface DraggablePoint {
  char: string;
  x: number; // percentage
  y: number; // percentage
  isCorner?: boolean; // Mark corner calibration points
}

interface InteractiveCalibrationProps {
  visible: boolean;
  onHidePlanchette?: (hide: boolean) => void;
}

// Add corner calibration points
const CORNER_POINTS = {
  'BOARD_TOP_LEFT': { x: -960, y: -641 }, // Half of board dimensions as default
  'BOARD_TOP_RIGHT': { x: 960, y: -641 },
  'BOARD_BOTTOM_LEFT': { x: -960, y: 641 },
  'BOARD_BOTTOM_RIGHT': { x: 960, y: 641 },
};

/**
 * Interactive calibration tool - drag points to match your board
 * Outputs adjusted coordinates to console
 */
export function InteractiveCalibration({ visible, onHidePlanchette }: InteractiveCalibrationProps) {
  const [points, setPoints] = useState<DraggablePoint[]>(() => {
    // Initialize points from LETTER_COORDS
    const boardWidth = 1920;
    const boardHeight = 1282;

    const letterPoints = Object.entries(LETTER_COORDS).map(([char, coord]) => ({
      char,
      x: 50 + (coord.x / boardWidth) * 100,
      y: 50 + (coord.y / boardHeight) * 100,
      isCorner: false,
    }));

    // Add corner points
    const cornerPoints = Object.entries(CORNER_POINTS).map(([char, coord]) => ({
      char,
      x: 50 + (coord.x / boardWidth) * 100,
      y: 50 + (coord.y / boardHeight) * 100,
      isCorner: true,
    }));

    return [...cornerPoints, ...letterPoints];
  });

  const [draggedPoint, setDraggedPoint] = useState<string | null>(null);
  const [hidePlanchette, setHidePlanchette] = useState(true); // Hide by default in edit mode

  // Debug: Log points on mount and when they change
  useEffect(() => {
    if (visible) {
      console.log('=== InteractiveCalibration Debug ===');
      console.log('Total points:', points.length);
      console.log('Corner points:', points.filter(p => p.isCorner).length);
      console.log('Corner names:', points.filter(p => p.isCorner).map(p => p.char));
      console.log('Letter points:', points.filter(p => !p.isCorner).length);
    }
  }, [visible, points]);

  if (!visible) return null;

  const handleHidePlanchetteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hide = e.target.checked;
    setHidePlanchette(hide);
    onHidePlanchette?.(hide);
  };

  const handleMouseDown = (char: string) => {
    setDraggedPoint(char);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!draggedPoint) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    setPoints(prev =>
      prev.map(p => (p.char === draggedPoint ? { ...p, x, y } : p))
    );
  };

  const handleMouseUp = () => {
    setDraggedPoint(null);
  };

  const exportCoordinates = () => {
    // Separate corners from letter points
    const cornerPoints = points.filter(p => p.isCorner);
    const letterPoints = points.filter(p => !p.isCorner);

    console.log('Total points:', points.length);
    console.log('Corner points:', cornerPoints.length, cornerPoints.map(p => p.char));
    console.log('Letter points:', letterPoints.length);

    // Calculate board dimensions from corners
    const topLeft = cornerPoints.find(p => p.char === 'BOARD_TOP_LEFT');
    const bottomRight = cornerPoints.find(p => p.char === 'BOARD_BOTTOM_RIGHT');

    if (!topLeft || !bottomRight) {
      console.error('Corner points not found!');
      console.error('Available corners:', cornerPoints);
      alert('Error: Corner points not found. Please ensure the blue corner squares are visible.');
      return;
    }

    // Calculate actual board dimensions in pixels
    // These are the pixel dimensions of the coordinate space
    const boardWidthPixels = 1920;
    const boardHeightPixels = 1282;

    // Convert corner positions to pixel offsets
    const cornerTopLeftX = ((topLeft.x - 50) / 100) * boardWidthPixels;
    const cornerTopLeftY = ((topLeft.y - 50) / 100) * boardHeightPixels;
    const cornerBottomRightX = ((bottomRight.x - 50) / 100) * boardWidthPixels;
    const cornerBottomRightY = ((bottomRight.y - 50) / 100) * boardHeightPixels;

    // Calculate the calibrated board dimensions
    const calibratedWidth = cornerBottomRightX - cornerTopLeftX;
    const calibratedHeight = cornerBottomRightY - cornerTopLeftY;

    console.log('=== BOARD CALIBRATION INFO ===');
    console.log('Calibrated board dimensions:', {
      width: Math.round(calibratedWidth),
      height: Math.round(calibratedHeight),
    });
    console.log('Top-left corner offset:', {
      x: Math.round(cornerTopLeftX),
      y: Math.round(cornerTopLeftY),
    });

    // Convert letter positions relative to calibrated board
    const newCoords = letterPoints.reduce((acc, point) => {
      const pixelX = ((point.x - 50) / 100) * boardWidthPixels;
      const pixelY = ((point.y - 50) / 100) * boardHeightPixels;

      // Adjust relative to the top-left corner
      const relativeX = pixelX - cornerTopLeftX - calibratedWidth / 2;
      const relativeY = pixelY - cornerTopLeftY - calibratedHeight / 2;

      acc[point.char] = {
        x: Math.round(relativeX * 100) / 100,
        y: Math.round(relativeY * 100) / 100,
      };
      return acc;
    }, {} as Record<string, { x: number; y: number }>);

    console.log('\n=== CALIBRATED COORDINATES ===');
    console.log('Copy this object to letterCoords.ts:');
    console.log(JSON.stringify(newCoords, null, 2));
    console.log('==============================');

    // Also create a formatted version for easy copy-paste
    const formatted = Object.entries(newCoords)
      .map(([char, coord]) => `  ${char}: { x: ${coord.x}, y: ${coord.y} },`)
      .join('\n');

    console.log('\nFormatted for letterCoords.ts:');
    console.log('export const LETTER_COORDS: Record<string, LetterCoord> = {');
    console.log(formatted);
    console.log('};');
  };

  const resetToDefaults = () => {
    const boardWidth = 1920;
    const boardHeight = 1282;

    const letterPoints = Object.entries(LETTER_COORDS).map(([char, coord]) => ({
      char,
      x: 50 + (coord.x / boardWidth) * 100,
      y: 50 + (coord.y / boardHeight) * 100,
      isCorner: false,
    }));

    const cornerPoints = Object.entries(CORNER_POINTS).map(([char, coord]) => ({
      char,
      x: 50 + (coord.x / boardWidth) * 100,
      y: 50 + (coord.y / boardHeight) * 100,
      isCorner: true,
    }));

    setPoints([...cornerPoints, ...letterPoints]);
  };

  return (
    <div
      className="absolute inset-0 z-50"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: draggedPoint ? 'grabbing' : 'default' }}
    >
      {/* Draggable points */}
      {points.map(point => {
        const isCorner = point.isCorner;

        return (
          <div
            key={point.char}
            className="absolute cursor-grab hover:scale-125 active:cursor-grabbing"
            style={{
              left: `${point.x}%`,
              top: `${point.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: draggedPoint === point.char ? 100 : isCorner ? 60 : 50,
            }}
            onMouseDown={() => handleMouseDown(point.char)}
          >
            {/* Crosshair or Square */}
            {isCorner ? (
              /* Blue square for corners */
              <div className="relative h-12 w-12">
                <div className="absolute inset-0 border-4 border-blue-500 bg-blue-500/20"></div>
                <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-600 ring-2 ring-white"></div>
              </div>
            ) : (
              /* Green crosshair for letters */
              <div className="relative h-10 w-10">
                {/* Horizontal line */}
                <div className="absolute left-1/2 top-1/2 h-[3px] w-10 -translate-x-1/2 -translate-y-1/2 bg-green-500 opacity-100"></div>
                {/* Vertical line */}
                <div className="absolute left-1/2 top-1/2 h-10 w-[3px] -translate-x-1/2 -translate-y-1/2 bg-green-500 opacity-100"></div>
                {/* Center dot */}
                <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-green-600 ring-2 ring-white"></div>
              </div>
            )}

            {/* Label */}
            <div
              className={`absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded px-2 py-1 text-xs font-bold ${
                isCorner
                  ? 'top-14 bg-blue-900/90 text-blue-300 ring-1 ring-blue-500'
                  : 'top-12 bg-green-900/90 text-green-300 ring-1 ring-green-500'
              }`}
            >
              {isCorner ? point.char.replace('BOARD_', '').replace('_', ' ') : point.char}
            </div>
          </div>
        );
      })}

      {/* Control Panel - positioned below the board */}
      <div className="pointer-events-auto absolute -bottom-56 left-4 z-50 max-w-sm rounded-lg border-2 border-green-500 bg-black p-4 text-sm text-white shadow-2xl">
        <h3 className="mb-3 text-lg font-bold text-green-500">
          🎯 Interactive Calibration
        </h3>

        {/* Hide Planchette Checkbox */}
        <label className="mb-3 flex cursor-pointer items-center gap-2 rounded bg-green-900/30 p-2">
          <input
            type="checkbox"
            checked={hidePlanchette}
            onChange={handleHidePlanchetteChange}
            className="h-4 w-4 cursor-pointer accent-green-500"
          />
          <span className="text-xs font-semibold text-green-300">
            Hide Planchette (easier to see board)
          </span>
        </label>

        <div className="mb-3 space-y-2 text-xs">
          <p className="rounded bg-blue-900/50 p-2 font-bold text-blue-300">
            🔷 STEP 1: Drag <strong>BLUE SQUARES</strong> to board corners
          </p>
          <p>🔷 Position the 4 blue squares at the exact corners of your Ouija board image</p>
          <p className="mt-2 rounded bg-green-900/50 p-2 font-bold text-green-300">
            🟢 STEP 2: Drag <strong>GREEN CROSSHAIRS</strong> to letters
          </p>
          <p>🟢 Align green crosshairs with letter centers (at least: A, M, N, Z, YES, NO)</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={exportCoordinates}
            className="flex-1 rounded bg-green-600 px-3 py-2 font-bold text-white hover:bg-green-700"
          >
            📋 Export to Console
          </button>
          <button
            onClick={resetToDefaults}
            className="rounded bg-gray-600 px-3 py-2 text-white hover:bg-gray-700"
          >
            ↺ Reset
          </button>
        </div>

        <p className="mt-3 rounded bg-yellow-900 px-2 py-1 text-xs text-yellow-300">
          After calibration, click "Export to Console" then copy coordinates from browser console
        </p>
      </div>
    </div>
  );
}
