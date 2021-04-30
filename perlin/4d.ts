// This is free and unencumbered software released into the public domain

import { Noise4D } from "../noise.ts";
import { NoiseOptions } from "../options.ts";
import { genPerm, lerp } from "../_utils.ts";

const Grad = [
  [0, 1, 1, 1],
  [0, 1, 1, -1],
  [0, 1, -1, 1],
  [0, 1, -1, -1],
  [0, -1, 1, 1],
  [0, -1, 1, -1],
  [0, -1, -1, 1],
  [0, -1, -1, -1],
  [1, 0, 1, 1],
  [1, 0, 1, -1],
  [1, 0, -1, 1],
  [1, 0, -1, -1],
  [-1, 0, 1, 1],
  [-1, 0, 1, -1],
  [-1, 0, -1, 1],
  [-1, 0, -1, -1],
  [1, 1, 0, 1],
  [1, 1, 0, -1],
  [1, -1, 0, 1],
  [1, -1, 0, -1],
  [-1, 1, 0, 1],
  [-1, 1, 0, -1],
  [-1, -1, 0, 1],
  [-1, -1, 0, -1],
  [1, 1, 1, 0],
  [1, 1, -1, 0],
  [1, -1, 1, 0],
  [1, -1, -1, 0],
  [-1, 1, 1, 0],
  [-1, 1, -1, 0],
  [-1, -1, 1, 0],
  [-1, -1, -1, 0],
];

export function perlinNoise4D(
  { depth = 256, random = Math.random }: NoiseOptions = {},
): Noise4D {
  const mask = depth - 1;
  const p = genPerm(depth, random);

  const perm = new Array(depth * 2);
  for (let i = 0; i < depth * 2; i++) {
    perm[i] = p[i & mask];
  }

  return (x: number, y: number, z: number, w: number) => {
    // Find unit grid cell containing point
    let X = Math.floor(x);
    let Y = Math.floor(y);
    let Z = Math.floor(z);
    let W = Math.floor(w);

    // Get relative xyzw coordinate of point within that cell
    x = x - X;
    y = y - Y;
    z = z - Z;
    w = w - W;

    // Wrap integer cells at `depth`
    X = X % mask;
    Y = Y % mask;
    Z = Z % mask;
    W = W % mask;

    // Calculate set of eight hashed gradient values
    const g0000 = Grad[perm[X + perm[Y + perm[Z + perm[W]]]] % 32];
    const g0010 = Grad[perm[X + perm[Y + perm[Z + 1 + perm[W]]]] % 32];
    const g0100 = Grad[perm[X + perm[Y + 1 + perm[Z + perm[W]]]] % 32];
    const g0110 = Grad[perm[X + perm[Y + 1 + perm[Z + 1 + perm[W]]]] % 32];
    const g1000 = Grad[perm[X + 1 + perm[Y + perm[Z + perm[W]]]] % 32];
    const g1010 = Grad[perm[X + 1 + perm[Y + perm[Z + 1 + perm[W]]]] % 32];
    const g1100 = Grad[perm[X + 1 + perm[Y + 1 + perm[Z + perm[W]]]] % 32];
    const g1110 = Grad[perm[X + 1 + perm[Y + 1 + perm[Z + 1 + perm[W]]]] % 32];
    const g0001 = Grad[perm[X + perm[Y + perm[Z + perm[W + 1]]]] % 32];
    const g0011 = Grad[perm[X + perm[Y + perm[Z + 1 + perm[W + 1]]]] % 32];
    const g0101 = Grad[perm[X + perm[Y + 1 + perm[Z + perm[W + 1]]]] % 32];
    const g0111 = Grad[perm[X + perm[Y + 1 + perm[Z + 1 + perm[W + 1]]]] % 32];
    const g1001 = Grad[perm[X + 1 + perm[Y + perm[Z + perm[W + 1]]]] % 32];
    const g1011 = Grad[perm[X + 1 + perm[Y + perm[Z + 1 + perm[W + 1]]]] % 32];
    const g1101 = Grad[perm[X + 1 + perm[Y + 1 + perm[Z + perm[W + 1]]]] % 32];
    const g1111 =
      Grad[perm[X + 1 + perm[Y + 1 + perm[Z + 1 + perm[W + 1]]]] % 12];

    // Calculate noise contributions from each corner
    const n0000 = g0000[0] * x + g0000[1] * y + g0000[2] * z + g0000[3] * w;
    const n0010 = g0010[0] * x + g0010[1] * y + g0010[2] * (z - 1) +
      g0010[3] * w;
    const n0100 = g0100[0] * x + g0100[1] * (y - 1) + g0100[2] * z +
      g0100[3] * w;
    const n0110 = g0110[0] * x + g0110[1] * (y - 1) + g0110[2] * (z - 1) +
      g0110[3] * w;
    const n1000 = g1000[0] * (x - 1) + g1000[1] * y + g1000[2] * z +
      g1000[3] * w;
    const n1010 = g1010[0] * (x - 1) + g1010[1] * y + g1010[2] * (z - 1) +
      g1010[3] * w;
    const n1100 = g1100[0] * (x - 1) + g1100[1] * (y - 1) + g1100[2] * z +
      g1100[3] * w;
    const n1110 = g1110[0] * (x - 1) + g1110[1] * (y - 1) + g1110[2] * (z - 1) +
      g1110[3] * w;
    const n0001 = g0001[0] * x + g0001[1] * y + g0001[2] * z +
      g0001[3] * (w - 1);
    const n0011 = g0011[0] * x + g0011[1] * y + g0011[2] * (z - 1) +
      g0011[3] * (w - 1);
    const n0101 = g0101[0] * x + g0101[1] * (y - 1) + g0101[2] * z +
      g0101[3] * (w - 1);
    const n0111 = g0111[0] * x + g0111[1] * (y - 1) + g0111[2] * (z - 1) +
      g0111[3] * (w - 1);
    const n1001 = g1001[0] * (x - 1) + g1001[1] * y + g1001[2] * z +
      g1001[3] * (w - 1);
    const n1011 = g1011[0] * (x - 1) + g1011[1] * y + g1011[2] * (z - 1) +
      g1011[3] * (w - 1);
    const n1101 = g1101[0] * (x - 1) + g1101[1] * (y - 1) + g1101[2] * z +
      g1101[3] * (w - 1);
    const n1111 = g1111[0] * (x - 1) + g1111[1] * (y - 1) + g1111[2] * (z - 1) +
      g1111[3] * (w - 1);

    // Interpolate contributions together
    return lerp(
      lerp(
        lerp(
          lerp(n0000, n1000, x),
          lerp(n0100, n1100, x),
          y,
        ),
        lerp(
          lerp(n0010, n1010, x),
          lerp(n0110, n1110, x),
          y,
        ),
        z,
      ),
      lerp(
        lerp(
          lerp(n0001, n1001, x),
          lerp(n0101, n1101, x),
          y,
        ),
        lerp(
          lerp(n0011, n1011, x),
          lerp(n0111, n1111, x),
          y,
        ),
        z,
      ),
      w,
    );
  };
}
