// This is free and unencumbered software released into the public domain

import { Noise2D } from "../noise.ts";
import { NoiseOptions } from "../options.ts";
import { genPerm } from "../_utils.ts";

const Norm2D = 1.0 / 47.0;
const Squish2D = (Math.sqrt(3) - 1) / 2;
const Stretch2D = (1 / Math.sqrt(3) - 1) / 2;

const base2D = [
  [1, 1, 0, 1, 0, 1, 0, 0, 0],
  [1, 1, 0, 1, 0, 1, 2, 1, 1],
];

const gradients2D = [5, 2, 2, 5, -5, 2, -2, 5, 5, -2, 2, -5, -5, -2, -2, -5];

const lookupPairs2D = [
  0,
  1,
  1,
  0,
  4,
  1,
  17,
  0,
  20,
  2,
  21,
  2,
  22,
  5,
  23,
  5,
  26,
  4,
  39,
  3,
  42,
  4,
  43,
  3,
];

const p2D = [
  0,
  0,
  1,
  -1,
  0,
  0,
  -1,
  1,
  0,
  2,
  1,
  1,
  1,
  2,
  2,
  0,
  1,
  2,
  0,
  2,
  1,
  0,
  0,
  0,
];

export interface Contribution2D {
  dx: number;
  dy: number;
  next?: Contribution2D;
  xsb: number;
  ysb: number;
}

function contribution2D(
  multiplier: number,
  xsb: number,
  ysb: number,
): Contribution2D {
  return {
    dx: -xsb - multiplier * Squish2D,
    dy: -ysb - multiplier * Squish2D,
    xsb,
    ysb,
  };
}

const contributions: Contribution2D[] = [];
for (let i = 0; i < p2D.length; i += 4) {
  const baseSet = base2D[p2D[i]];
  let previous: Contribution2D | null = null;
  let current: Contribution2D | null = null;
  for (let k = 0; k < baseSet.length; k += 3) {
    current = contribution2D(baseSet[k], baseSet[k + 1], baseSet[k + 2]);
    if (previous === null) contributions[i / 4] = current;
    else previous.next = current;
    previous = current;
  }
  current!.next = contribution2D(p2D[i + 1], p2D[i + 2], p2D[i + 3]);
}

const lookup: Contribution2D[] = [];
for (let i = 0; i < lookupPairs2D.length; i += 2) {
  lookup[lookupPairs2D[i]] = contributions[lookupPairs2D[i + 1]];
}

export function openSimplexNoise2D(
  { depth = 256, random = Math.random }: NoiseOptions = {},
): Noise2D {
  const mask = depth - 1;
  const perm = genPerm(depth, random);

  return (x: number, y: number) => {
    const stretchOffset = (x + y) * Stretch2D;

    const xs = x + stretchOffset;
    const ys = y + stretchOffset;

    const xsb = Math.floor(xs);
    const ysb = Math.floor(ys);

    const squishOffset = (xsb + ysb) * Squish2D;

    const dx0 = x - (xsb + squishOffset);
    const dy0 = y - (ysb + squishOffset);

    const xins = xs - xsb;
    const yins = ys - ysb;

    const inSum = xins + yins;
    const hash = (xins - yins + 1) |
      (inSum << 1) |
      ((inSum + yins) << 2) |
      ((inSum + xins) << 4);

    let value = 0;

    for (
      let c: Contribution2D | undefined = lookup[hash];
      c !== undefined;
      c = c.next
    ) {
      const dx = dx0 + c.dx;
      const dy = dy0 + c.dy;

      const attn = 2 - dx * dx - dy * dy;
      if (attn > 0) {
        const px = xsb + c.xsb;
        const py = ysb + c.ysb;

        const indexPartA = perm[px & mask];
        const index = perm[(indexPartA + py) & mask];

        const valuePart = gradients2D[index % 16] * dx +
          gradients2D[(index + 1) % 16] * dy;

        value += attn * attn * attn * attn * valuePart;
      }
    }

    return value * Norm2D;
  };
}
