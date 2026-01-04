/**
 * Animation utilities for smooth planchette movement
 *
 * @remarks
 * This module provides easing functions, interpolation, and bezier curve
 * calculations for creating natural, supernatural-feeling animations.
 */

/**
 * Function signature for easing functions
 * @param t - Time progress from 0 to 1
 * @returns Eased value from 0 to 1
 */
export type EasingFunction = (t: number) => number;

/**
 * Ease out cubic - starts fast, ends slow (supernatural feel)
 *
 * @param t - Time progress (0-1)
 * @returns Eased value (0-1)
 *
 * @remarks
 * Creates a decelerating motion that feels mystical and intentional,
 * as if the spirit is carefully selecting each letter.
 */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Ease in out cubic - smooth acceleration and deceleration
 *
 * @param t - Time progress (0-1)
 * @returns Eased value (0-1)
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Ease out quart - even smoother deceleration
 *
 * @param t - Time progress (0-1)
 * @returns Eased value (0-1)
 */
export function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

/**
 * Linear easing (no acceleration/deceleration)
 *
 * @param t - Time progress (0-1)
 * @returns Same value (0-1)
 */
export function linear(t: number): number {
  return t;
}

/**
 * Linear interpolation between two values
 *
 * @param start - Starting value
 * @param end - Ending value
 * @param t - Progress from start to end (0-1)
 * @returns Interpolated value
 *
 * @example
 * ```ts
 * lerp(0, 100, 0.5) // Returns 50
 * lerp(10, 20, 0.25) // Returns 12.5
 * ```
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Interpolate between two angles, taking the shortest rotational path
 *
 * @param start - Starting angle in degrees
 * @param end - Ending angle in degrees
 * @param t - Progress (0-1)
 * @returns Interpolated angle in degrees
 *
 * @remarks
 * Handles wrap-around at 360 degrees to prevent the planchette from
 * spinning the long way around (e.g., from 350° to 10° goes through 0°,
 * not through 180°).
 */
export function lerpAngle(start: number, end: number, t: number): number {
  // Normalize angles to 0-360
  start = ((start % 360) + 360) % 360;
  end = ((end % 360) + 360) % 360;

  // Calculate the difference
  let diff = end - start;

  // Take the shortest path
  if (diff > 180) {
    diff -= 360;
  } else if (diff < -180) {
    diff += 360;
  }

  // Interpolate
  return start + diff * t;
}

/**
 * Calculate Euclidean distance between two points
 *
 * @param x1 - X coordinate of first point
 * @param y1 - Y coordinate of first point
 * @param x2 - X coordinate of second point
 * @param y2 - Y coordinate of second point
 * @returns Distance between the points
 */
export function distance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/**
 * Quadratic bezier curve interpolation for smooth curved paths
 *
 * @param start - Starting point {x, y}
 * @param end - Ending point {x, y}
 * @param t - Progress along curve (0-1)
 * @returns Current position on the curve {x, y}
 *
 * @remarks
 * Creates a natural "seeking" motion like a homing missile. The curve is
 * adaptive - long distances get gentler curves to avoid extreme arcs.
 *
 * The control point is positioned perpendicular to the direct path,
 * creating a smooth arc. The curve factor is inversely proportional to
 * distance to prevent wild swings on large jumps (e.g., L to O).
 *
 * Formula: B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
 * Where P₀ = start, P₁ = control point, P₂ = end
 */
export function bezierCurve(
  start: { x: number; y: number },
  end: { x: number; y: number },
  t: number
): { x: number; y: number } {
  // Calculate control point for curved path
  // Position it perpendicular to the direct path, offset by distance
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  // Avoid division by zero for very close points
  if (dist < 0.01) {
    return { x: start.x, y: start.y };
  }

  // Adaptive curve factor: less pronounced for long distances, more for short
  // This prevents extreme curves on large jumps like L to O
  const baseCurveFactor = 0.25;
  const distanceNormalization = Math.min(dist / 50, 3); // Cap at 3x reduction
  const curveFactor = baseCurveFactor / Math.sqrt(distanceNormalization);
  const controlOffset = dist * curveFactor;

  // Calculate perpendicular direction
  const perpX = -dy / dist;
  const perpY = dx / dist;

  // Control point is midway between start and end, offset perpendicular
  const controlX = (start.x + end.x) / 2 + perpX * controlOffset;
  const controlY = (start.y + end.y) / 2 + perpY * controlOffset;

  // Quadratic bezier formula: B(t) = (1-t)²P₀ + 2(1-t)tP₁ + t²P₂
  const oneMinusT = 1 - t;
  const x =
    oneMinusT * oneMinusT * start.x +
    2 * oneMinusT * t * controlX +
    t * t * end.x;
  const y =
    oneMinusT * oneMinusT * start.y +
    2 * oneMinusT * t * controlY +
    t * t * end.y;

  return { x, y };
}

/**
 * Calculate the tangent angle at a point on a bezier curve
 *
 * @param start - Starting point {x, y}
 * @param end - Ending point {x, y}
 * @param t - Progress along curve (0-1)
 * @returns Angle in degrees that the planchette should face
 *
 * @remarks
 * This gives us the direction the planchette should be facing at any point
 * along the curve, making it point in the direction of movement.
 *
 * Uses the derivative of the quadratic bezier:
 * B'(t) = 2(1-t)(P₁-P₀) + 2t(P₂-P₁)
 *
 * Adds 90° to make the planchette tip point in the direction of movement.
 */
export function bezierTangentAngle(
  start: { x: number; y: number },
  end: { x: number; y: number },
  t: number
): number {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const dist = Math.sqrt(dx * dx + dy * dy);

  if (dist < 0.01) {
    return 0;
  }

  // Use same adaptive curve factor as bezierCurve
  const baseCurveFactor = 0.25;
  const distanceNormalization = Math.min(dist / 50, 3);
  const curveFactor = baseCurveFactor / Math.sqrt(distanceNormalization);
  const controlOffset = dist * curveFactor;

  const perpX = -dy / dist;
  const perpY = dx / dist;

  const controlX = (start.x + end.x) / 2 + perpX * controlOffset;
  const controlY = (start.y + end.y) / 2 + perpY * controlOffset;

  // Derivative of quadratic bezier: B'(t) = 2(1-t)(P₁-P₀) + 2t(P₂-P₁)
  const tangentX =
    2 * (1 - t) * (controlX - start.x) + 2 * t * (end.x - controlX);
  const tangentY =
    2 * (1 - t) * (controlY - start.y) + 2 * t * (end.y - controlY);

  // Calculate angle from tangent vector (+90 to point tip in direction of movement)
  return Math.atan2(tangentY, tangentX) * (180 / Math.PI) + 90;
}
