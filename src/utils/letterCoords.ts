import { LetterCoord } from '../types/ouija';

/**
 * Coordinate map for Ouija board letters, numbers, and special positions
 *
 * @remarks
 * Coordinates are in pixels relative to the center of the board.
 * Calibrated for the ouija_bg.jpg image using an interactive calibration tool.
 *
 * Ported from baobabKoodaa/ouija with adjustments for the OUIJ-AI board image.
 *
 * Layout:
 * - Top row: A-M (arc from left to right)
 * - Bottom row: N-Z (arc from left to right)
 * - Numbers: 1-0 (horizontal line at bottom)
 * - Special: YES (top-left), NO (top-right), GOODBYE (bottom-center)
 */
export const LETTER_COORDS: Record<string, LetterCoord> = {
  // Top row - Letters A-M
  A: { x: -548.25, y: -104.31 },
  B: { x: -469, y: -191.65 },
  C: { x: -391.38, y: -254.72 },
  D: { x: -308.9, y: -300 },
  E: { x: -215.1, y: -340.43 },
  F: { x: -109.97, y: -366.31 },
  G: { x: -22.64, y: -372.78 },
  H: { x: 87.33, y: -374.4 },
  I: { x: 190.84, y: -353.37 },
  J: { x: 258.76, y: -327.5 },
  K: { x: 360.65, y: -278.98 },
  L: { x: 462.54, y: -202.97 },
  M: { x: 540.16, y: -123.72 },

  // Bottom row - Letters N-Z
  N: { x: -530.46, y: 130.19 },
  O: { x: -467.39, y: 55.8 },
  P: { x: -399.46, y: -12.13 },
  Q: { x: -323.45, y: -55.8 },
  R: { x: -221.56, y: -105.93 },
  S: { x: -121.29, y: -133.42 },
  T: { x: -17.79, y: -144.75 },
  U: { x: 93.8, y: -138.28 },
  V: { x: 189.22, y: -122.1 },
  W: { x: 299.19, y: -76.82 },
  X: { x: 392.99, y: -12.13 },
  Y: { x: 464.15, y: 52.56 },
  Z: { x: 519.14, y: 115.63 },

  // Numbers
  '1': { x: -380.06, y: 165.77 },
  '2': { x: -307.28, y: 172.24 },
  '3': { x: -228.03, y: 172.24 },
  '4': { x: -145.55, y: 177.09 },
  '5': { x: -76.01, y: 178.71 },
  '6': { x: 0, y: 172.24 },
  '7': { x: 74.39, y: 167.39 },
  '8': { x: 153.64, y: 167.39 },
  '9': { x: 236.12, y: 165.77 },
  '0': { x: 338.01, y: 165.77 },

  // Special positions
  ' ': { x: -11.32, y: 15.36 },
  YES: { x: -798.92, y: -473.05 },
  NO: { x: 826.42, y: -495.69 },
  GOODBYE: { x: -12.94, y: 445.56 },
};

/**
 * Offset from planchette center to tip (as percentage of planchette size)
 *
 * @remarks
 * The planchette is an inverted teardrop shape (pointed end at top):
 * - Tip at top (0% Y)
 * - Magnifying glass at center (50% Y)
 * - Rounded bottom (100% Y)
 *
 * This offset moves the planchette so its TIP points to the target letter,
 * not its center. Applied in the ROTATED coordinate system during animation.
 *
 * @see usePlanchetteAnimation.ts for the actual application
 */
export const TIP_OFFSET_PERCENT = { x: 0, y: -50 }; // -50% up from center to reach the top tip

/**
 * Determines if a character should use the tip pointer or center magnifying glass
 *
 * @param char - The character to check
 * @returns true if YES/NO/GOODBYE (use tip), false for letters/numbers (use magnifying glass)
 *
 * @remarks
 * YES, NO, and GOODBYE are special board positions that the tip points to directly.
 * Regular letters and numbers are viewed through the center magnifying glass.
 */
export function shouldUseTipPointer(char: string): boolean {
  const upperChar = char.toUpperCase();
  return upperChar === 'YES' || upperChar === 'NO' || upperChar === 'GOODBYE';
}

/**
 * Get pixel coordinate for a character
 *
 * @param char - The character to look up (case-insensitive)
 * @returns Pixel coordinates relative to board center
 *
 * @remarks
 * Falls back to space (' ') coordinates if character not found.
 * Automatically converts to uppercase for lookup.
 */
export function getLetterCoord(char: string): LetterCoord {
  const upperChar = char.toUpperCase();
  return LETTER_COORDS[upperChar] || LETTER_COORDS[' '];
}

/**
 * Convert pixel coordinates to CSS percentage positioning
 *
 * @param coord - Pixel coordinates from LETTER_COORDS
 * @param boardWidth - Width of the board in pixels
 * @param boardHeight - Height of the board in pixels
 * @returns Percentage coordinates for CSS positioning
 *
 * @remarks
 * Converts pixel offsets from board center to percentage values for CSS.
 * Board center is assumed to be at (50%, 50%).
 *
 * NOTE: Does NOT apply tip offset - that's applied with rotation
 * in usePlanchetteAnimation for proper directional alignment.
 */
export function coordToPercent(
  coord: LetterCoord,
  boardWidth: number,
  boardHeight: number
): { x: number; y: number } {
  // Assuming board center is at 50%, 50%
  const xPercent = 50 + (coord.x / boardWidth) * 100;
  const yPercent = 50 + (coord.y / boardHeight) * 100;

  // Tip offset is now applied in usePlanchetteAnimation with rotation
  // We return the target position where we want the TIP to land

  return { x: xPercent, y: yPercent };
}
