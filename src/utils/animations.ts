/**
 * Easing functions for smooth animations
 */

export type EasingFunction = (t: number) => number;

/**
 * Ease out cubic - starts fast, ends slow (supernatural feel)
 */
export function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Ease in out cubic - smooth acceleration and deceleration
 */
export function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Ease out quart - even smoother deceleration
 */
export function easeOutQuart(t: number): number {
  return 1 - Math.pow(1 - t, 4);
}

/**
 * Linear easing
 */
export function linear(t: number): number {
  return t;
}

/**
 * Interpolate between two values
 */
export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}

/**
 * Interpolate between two angles, taking the shortest path
 * Handles wrap-around at 360 degrees
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
 * Calculate distance between two points
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
 * Creates a natural "seeking" motion like a homing missile
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
  const x = oneMinusT * oneMinusT * start.x + 2 * oneMinusT * t * controlX + t * t * end.x;
  const y = oneMinusT * oneMinusT * start.y + 2 * oneMinusT * t * controlY + t * t * end.y;

  return { x, y };
}

/**
 * Calculate the tangent angle at a point on a bezier curve
 * This gives us the direction the planchette should be facing
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
  const tangentX = 2 * (1 - t) * (controlX - start.x) + 2 * t * (end.x - controlX);
  const tangentY = 2 * (1 - t) * (controlY - start.y) + 2 * t * (end.y - controlY);

  // Calculate angle from tangent vector (+90 to point tip in direction of movement)
  return Math.atan2(tangentY, tangentX) * (180 / Math.PI) + 90;
}
