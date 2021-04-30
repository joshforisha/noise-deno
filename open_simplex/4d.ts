// This is free and unencumbered software released into the public domain

import { Noise4D } from "../noise.ts";
import { NoiseOptions } from "../options.ts";
import { genPerm } from "../_utils.ts";
import { base4D, gradients4D, lookupPairs4D, p4D } from "./_4d_constants.ts";

const Norm4D = 1.0 / 31.0;
const Squish4D = (Math.sqrt(4 + 1) - 1) / 4;
const Stretch4D = (1 / Math.sqrt(4 + 1) - 1) / 4;

interface Contribution4D {
  dx: number;
  dy: number;
  dz: number;
  dw: number;
  next?: Contribution4D;
  xsb: number;
  ysb: number;
  zsb: number;
  wsb: number;
}

function contribution4D(
  multiplier: number,
  xsb: number,
  ysb: number,
  zsb: number,
  wsb: number,
): Contribution4D {
  return {
    dx: -xsb - multiplier * Squish4D,
    dy: -ysb - multiplier * Squish4D,
    dz: -zsb - multiplier * Squish4D,
    dw: -wsb - multiplier * Squish4D,
    xsb,
    ysb,
    zsb,
    wsb,
  };
}

const contributions: Contribution4D[] = [];
for (let i = 0; i < p4D.length; i += 16) {
  const baseSet = base4D[p4D[i]];
  let previous: Contribution4D | null = null;
  let current: Contribution4D | null = null;
  for (let k = 0; k < baseSet.length; k += 5) {
    current = contribution4D(
      baseSet[k],
      baseSet[k + 1],
      baseSet[k + 2],
      baseSet[k + 3],
      baseSet[k + 4],
    );
    if (previous === null) contributions[i / 16] = current;
    else previous.next = current;
    previous = current;
  }
  current!.next = contribution4D(
    p4D[i + 1],
    p4D[i + 2],
    p4D[i + 3],
    p4D[i + 4],
    p4D[i + 5],
  );
  current!.next.next = contribution4D(
    p4D[i + 6],
    p4D[i + 7],
    p4D[i + 8],
    p4D[i + 9],
    p4D[i + 10],
  );
  current!.next.next.next = contribution4D(
    p4D[i + 11],
    p4D[i + 12],
    p4D[i + 13],
    p4D[i + 14],
    p4D[i + 15],
  );
}

const lookup: Contribution4D[] = [];
for (let i = 0; i < lookupPairs4D.length; i += 2) {
  lookup[lookupPairs4D[i]] = contributions[lookupPairs4D[i + 1]];
}

export function openSimplexNoise4D(
  { depth = 256, random = Math.random }: NoiseOptions = {},
): Noise4D {
  const mask = depth - 1;
  const perm = genPerm(depth, random);

  return (x: number, y: number, z: number, w: number): number => {
    const stretchOffset = (x + y + z + w) * Stretch4D;

    const xs = x + stretchOffset;
    const ys = y + stretchOffset;
    const zs = z + stretchOffset;
    const ws = w + stretchOffset;

    const xsb = Math.floor(xs);
    const ysb = Math.floor(ys);
    const zsb = Math.floor(zs);
    const wsb = Math.floor(ws);

    const squishOffset = (xsb + ysb + zsb + wsb) * Squish4D;
    const dx0 = x - (xsb + squishOffset);
    const dy0 = y - (ysb + squishOffset);
    const dz0 = z - (zsb + squishOffset);
    const dw0 = w - (wsb + squishOffset);

    const xins = xs - xsb;
    const yins = ys - ysb;
    const zins = zs - zsb;
    const wins = ws - wsb;

    const inSum = xins + yins + zins + wins;
    const hash = (zins - wins + 1) |
      ((yins - zins + 1) << 1) |
      ((yins - wins + 1) << 2) |
      ((xins - yins + 1) << 3) |
      ((xins - zins + 1) << 4) |
      ((xins - wins + 1) << 5) |
      (inSum << 6) |
      ((inSum + wins) << 8) |
      ((inSum + zins) << 11) |
      ((inSum + yins) << 14) |
      ((inSum + xins) << 17);

    let value = 0;

    for (
      let c: Contribution4D | undefined = lookup[hash];
      c !== undefined;
      c = c.next
    ) {
      const dx = dx0 + c.dx;
      const dy = dy0 + c.dy;
      const dz = dz0 + c.dz;
      const dw = dw0 + c.dw;

      const attn = 2 - dx * dx - dy * dy - dz * dz - dw * dw;
      if (attn > 0) {
        const px = xsb + c.xsb;
        const py = ysb + c.ysb;
        const pz = zsb + c.zsb;
        const pw = wsb + c.wsb;

        const indexPartA = perm[px & mask];
        const indexPartB = perm[(indexPartA + py) & mask];
        const indexPartC = perm[(indexPartB + pz) & mask];
        const index = perm[(indexPartC + pw) & mask];

        const valuePart = gradients4D[index] * dx +
          gradients4D[(index + 1) % 256] * dy +
          gradients4D[(index + 2) % 256] * dz +
          gradients4D[(index + 3) % 256] * dw;

        value += attn * attn * attn * attn * valuePart;
      }
    }
    return value * Norm4D;
  };
}
