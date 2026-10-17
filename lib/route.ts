/** Pure route geometry. Safe for the browser: it imports no data. */
/** Route from the origin to a destination: a gentle arc (quadratic Bézier) that bows toward the north. */
export function routeCurve(a: { x: number; y: number }, b: { x: number; y: number }) {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy) || 1;
  let nx = -dy / len, ny = dx / len;
  if (ny > 0) { nx = -nx; ny = -ny; } // always bow upward on the page
  const bow = len * 0.22;
  return { c: { x: mx + nx * bow, y: my + ny * bow }, len };
}
export const bezierAt = (a: { x: number; y: number }, c: { x: number; y: number }, b: { x: number; y: number }, t: number) => {
  const u = 1 - t;
  return { x: u * u * a.x + 2 * u * t * c.x + t * t * b.x, y: u * u * a.y + 2 * u * t * c.y + t * t * b.y };
};
