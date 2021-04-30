export function genPerm(
  depth: number,
  random: () => number,
): Uint8Array {
  const p = new Uint8Array(depth);
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
