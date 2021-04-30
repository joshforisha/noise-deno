// This is free and unencumbered software released into the public domain

import { Noise3D } from "../noise.ts";
import { NoiseOptions } from "../options.ts";
import { genPerm, lerp } from "../_utils.ts";

const Grad = [
  [1, 1, 0],
  [-1, 1, 0],
  [1, -1, 0],
  [-1, -1, 0],
  [1, 0, 1],
  [-1, 0, 1],
  [1, 0, -1],
  [-1, 0, -1],
  [0, 1, 1],
  [0, -1, 1],
  [0, 1, -1],
  [0, -1, -1],
];

function fade(t: number): number {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

export function perlinNoise3D(
  { depth = 256, random = Math.random }: NoiseOptions = {},
): Noise3D {
  const mask = depth - 1;
  const p = genPerm(depth, random);

  const perm = new Array(depth * 2);
  for (let i = 0; i < depth * 2; i++) {
    perm[i] = p[i & mask];
  }

  return (x: number, y: number, z: number) => {
    // Find unit grid cell containing point
    let X = Math.floor(x);
    let Y = Math.floor(y);
    let Z = Math.floor(z);

    // Get relative xyz coordinate of point within that cell
    x = x - X;
    y = y - Y;
    z = z - Z;

    // Wrap integer cells at `depth`
    X = X % mask;
    Y = Y % mask;
    Z = Z % mask;

    // Calculate set of eight hashed gradient values
    const g000 = Grad[perm[X + perm[Y + perm[Z]]] % 12];
    const g001 = Grad[perm[X + perm[Y + perm[Z + 1]]] % 12];
    const g010 = Grad[perm[X + perm[Y + 1 + perm[Z]]] % 12];
    const g011 = Grad[perm[X + perm[Y + 1 + perm[Z + 1]]] % 12];
    const g100 = Grad[perm[X + 1 + perm[Y + perm[Z]]] % 12];
    const g101 = Grad[perm[X + 1 + perm[Y + perm[Z + 1]]] % 12];
    const g110 = Grad[perm[X + 1 + perm[Y + 1 + perm[Z]]] % 12];
    const g111 = Grad[perm[X + 1 + perm[Y + 1 + perm[Z + 1]]] % 12];

    // Calculate noise contributions from each corner
    const n000 = g000[0] * x + g000[1] * y + g000[2] * z;
    const n001 = g001[0] * x + g001[1] * y + g001[2] * (z - 1);
    const n010 = g010[0] * x + g010[1] * (y - 1) + g010[2] * z;
    const n011 = g011[0] * x + g011[1] * (y - 1) + g011[2] * (z - 1);
    const n100 = g100[0] * (x - 1) + g100[1] * y + g100[2] * z;
    const n101 = g101[0] * (x - 1) + g101[1] * y + g101[2] * (z - 1);
    const n110 = g110[0] * (x - 1) + g110[1] * (y - 1) + g110[2] * z;
    const n111 = g111[0] * (x - 1) + g111[1] * (y - 1) + g111[2] * (z - 1);

    // Compute the fade curve value for each of x, y, z
    const u = fade(x);
    const v = fade(y);
    const w = fade(z);

    // Interpolate contributions together
    return 1.5 * lerp(
      lerp(
        lerp(n000, n100, u),
        lerp(n010, n110, u),
        v,
      ),
      lerp(
        lerp(n001, n101, u),
        lerp(n011, n111, u),
        v,
      ),
      w,
    );
  };
}
