export function genPerm(
  depth: number,
  random: () => number,
): Uint8Array | Uint16Array | Uint32Array {
  const p = depth < 257
    ? new Uint8Array(depth)
    : depth < 65537
    ? new Uint16Array(depth)
    : new Uint32Array(depth);

  for (let i = 0; i < depth; i++) p[i] = i;

  const mask = depth - 1;
  let n: number;
  let q: number;
  for (let i = mask; i > 0; i--) {
    n = Math.floor((i + 1) * random());
    q = p[i];
    p[i] = p[n];
    p[n] = q;
  }

  return p;
}

/**
 * Linear interpolation
 * @param low The lower limit value
 * @param high The higher limit value
 * @param t The value to interpolate
 * @returns number
 */
export function lerp(low: number, high: number, t: number): number {
  return low * (1 - t) + high * t;
}
