/**
 * SVG filter definitions for spirit-themed visual effects
 * These filters are used throughout the app for atmospheric styling
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
