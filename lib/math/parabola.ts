export interface Point {
  x: number;
  y: number;
}

/**
 * Calculates Y for a given X based on Vertex Form: y = a(x-h)^2 + k
 * @param x - The x coordinate
 * @param a - Curvature (steepness/direction)
 * @param h - Horizontal shift (axis of symmetry)
 * @param k - Vertical shift (vertex y)
 */
export function calculateParabolaY(x: number, a: number, h: number, k: number): number {
  return a * Math.pow(x - h, 2) + k;
}

/**
 * Generates a set of points along the parabola for rendering or physics bodies
 * @param startX - Start of the range
 * @param endX - End of the range
 * @param steps - Number of points to generate
 * @param a - Curvature
 * @param h - Horizontal shift
 * @param k - Vertical shift
 */
export function generateParabolaPoints(
  startX: number,
  endX: number,
  steps: number,
  a: number,
  h: number,
  k: number
): Point[] {
  const points: Point[] = [];
  const stepSize = (endX - startX) / steps;

  for (let i = 0; i <= steps; i++) {
    const x = startX + i * stepSize;
    const y = calculateParabolaY(x, a, h, k);
    points.push({ x, y });
  }

  return points;
}
