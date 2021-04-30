// This is free and unencumbered software released into the public domain

import { Noise2D } from "../noise.ts";
import { NoiseOptions } from "../options.ts";
import { genPerm, lerp } from "../_utils.ts";

const Grad = [
  [1, 1],
  [-1, 1],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

export function perlinNoise2D(
  { depth = 256, random = Math.random }: NoiseOptions = {},
): Noise2D {
  const mask = depth - 1;
  const p = genPerm(depth, random);

  const perm = new Array(depth * 2);
  for (let i = 0; i < depth * 2; i++) {
    perm[i] = p[i & mask];
  }

  return (x: number, y: number) => {
    // Find unit grid cell containing point
    let X = Math.floor(x);
    let Y = Math.floor(y);

    // Get relative xyz coordinate of point within that cell
    x = x - X;
    y = y - Y;

    // Wrap integer cells at `depth`
    X = X % mask;
    Y = Y % mask;

    // Calculate set of eight hashed gradient values
    const g00 = Grad[perm[X + perm[Y]] % 6];
    const g01 = Grad[perm[X + perm[Y + 1]] % 6];
    const g10 = Grad[perm[X + 1 + perm[Y]] % 6];
    const g11 = Grad[perm[X + 1 + perm[Y + 1]] % 6];

    // Calculate noise contributions from each corner
    const n00 = g00[0] * x + g00[1] * y;
    const n01 = g01[0] * x + g01[1] * (y - 1);
    const n10 = g10[0] * (x - 1) + g10[1] * y;
    const n11 = g11[0] * (x - 1) + g11[1] * (y - 1);

    // Interpolate contributions together
    return lerp(
      lerp(n00, n10, x),
      lerp(n01, n11, x),
      y,
    );
  };
}
