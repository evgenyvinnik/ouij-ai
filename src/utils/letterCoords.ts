import { LetterCoord } from '../types/ouija';

/**
 * Coordinate map for Ouija board letters, numbers, and special positions
 * Coordinates are in pixels relative to the center of the board
 * Ported from baobabKoodaa/ouija goalCoords
 */
export const LETTER_COORDS: Record<string, LetterCoord> = {
  // Top row - Letters A-M
  A: { x: -159.6, y: -58.17 },
  B: { x: -139.2, y: -77.69 },
  C: { x: -116.34, y: -90.75 },
  D: { x: -90.75, y: -99.81 },
  E: { x: -63.93, y: -104.88 },
  F: { x: -36.33, y: -106.41 },
  G: { x: -8.73, y: -106.41 },
  H: { x: 18.87, y: -106.41 },
  I: { x: 46.47, y: -104.88 },
  J: { x: 73.29, y: -99.81 },
  K: { x: 98.88, y: -90.75 },
  L: { x: 122.76, y: -77.69 },
  M: { x: 143.16, y: -58.17 },

  // Bottom row - Letters N-Z
  N: { x: -159.6, y: 22.95 },
  O: { x: -141.75, y: 41.94 },
  P: { x: -121.35, y: 56.61 },
  Q: { x: -98.49, y: 67.47 },
  R: { x: -73.68, y: 74.52 },
  S: { x: -47.7, y: 77.76 },
  T: { x: -21.33, y: 78.15 },
  U: { x: 5.04, y: 76.23 },
  V: { x: 30.63, y: 71.67 },
  W: { x: 55.05, y: 64.47 },
  X: { x: 77.91, y: 54.69 },
  Y: { x: 98.7, y: 42.33 },
  Z: { x: 117.03, y: 27.66 },

  // Numbers
  '1': { x: -116.73, y: -15.3 },
  '2': { x: -87.9, y: -22.95 },
  '3': { x: -58.29, y: -26.19 },
  '4': { x: -28.29, y: -27.33 },
  '5': { x: 1.71, y: -27.33 },
  '6': { x: 31.71, y: -26.19 },
  '7': { x: 61.32, y: -22.95 },
  '8': { x: 90.15, y: -15.3 },
  '9': { x: 116.91, y: -4.83 },
  '0': { x: 140.79, y: 8.61 },

  // Special positions
  ' ': { x: 0, y: 20 }, // Space/center
  YES: { x: -180, y: -30 },
  NO: { x: 180, y: -30 },
  GOODBYE: { x: 0, y: 100 },
};

/**
 * Get coordinate for a character
 */
export function getLetterCoord(char: string): LetterCoord {
  const upperChar = char.toUpperCase();
  return LETTER_COORDS[upperChar] || LETTER_COORDS[' '];
}

/**
 * Convert pixel coordinates to percentage (for CSS positioning)
 */
export function coordToPercent(
  coord: LetterCoord,
  boardWidth: number,
  boardHeight: number
): { x: number; y: number } {
  // Assuming board center is at 50%, 50%
  const xPercent = 50 + (coord.x / boardWidth) * 100;
  const yPercent = 50 + (coord.y / boardHeight) * 100;
  return { x: xPercent, y: yPercent };
}
