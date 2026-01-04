/**
 * SpiritFilters - SVG filter definitions for atmospheric visual effects
 *
 * Provides reusable SVG filters used throughout the app for supernatural styling:
 * - spirit-noise: Fractal noise overlay for texture
 * - spirit-glow: Gaussian blur glow effect
 *
 * @remarks
 * This component renders invisible SVG defs that can be referenced
 * by CSS filter properties throughout the app.
 */

/**
 * Renders hidden SVG filter definitions for spirit-themed effects
 *
 * @returns JSX element containing SVG filter definitions
 */
export function SpiritFilters() {
  return (
    <svg className="absolute h-0 w-0" aria-hidden="true">
      <defs>
        <filter id="spirit-noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
          <feBlend mode="multiply" in="SourceGraphic" />
        </filter>
        <filter id="spirit-glow">
          <feGaussianBlur stdDeviation="8" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}
