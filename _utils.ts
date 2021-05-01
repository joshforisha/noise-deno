/*
 * Constrains the `x` between `min` and `max`.
 * @param {number} min
 * @param {number} max
 * @param {number} x
 * @returns {number} The constrained value
 */
export function clamp(min: number, max: number, x: number): number {
  return Math.max(min, Math.min(max, x));
}

/*
 * Generates a permutation table.
 * @param {number} depth
 * @param {function} random
 * @returns {number[]} Generated typed array of floats
 */
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
