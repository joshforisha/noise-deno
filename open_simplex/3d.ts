// This is free and unencumbered software released into the public domain

import { Noise3D } from "../noise.ts";
import { NoiseOptions } from "../options.ts";
import { base3D, gradients3D, lookupPairs3D, p3D } from "./_3d_constants.ts";
import { genPerm } from "../_utils.ts";

const Norm3D = 1.0 / 121.0;
const Squish3D = (Math.sqrt(4) - 1) / 3;
const Stretch3D = (1 / Math.sqrt(4) - 1) / 3;

interface Contribution3D {
  dx: number;
  dy: number;
  dz: number;
  next?: Contribution3D;
  xsb: number;
  ysb: number;
  zsb: number;
}

function contribution3D(
  multiplier: number,
  xsb: number,
  ysb: number,
  zsb: number,
): Contribution3D {
  return {
    dx: -xsb - multiplier * Squish3D,
    dy: -ysb - multiplier * Squish3D,
    dz: -zsb - multiplier * Squish3D,
    xsb,
    ysb,
    zsb,
  };
}

const contributions: Contribution3D[] = [];
for (let i = 0; i < p3D.length; i += 9) {
  const baseSet = base3D[p3D[i]];
  let previous: Contribution3D | null = null;
  let current: Contribution3D | null = null;
  for (let k = 0; k < baseSet.length; k += 4) {
    current = contribution3D(
      baseSet[k],
      baseSet[k + 1],
      baseSet[k + 2],
      baseSet[k + 3],
    );
    if (previous === null) contributions[i / 9] = current;
    else previous.next = current;
    previous = current;
  }
  current!.next = contribution3D(
    p3D[i + 1],
    p3D[i + 2],
    p3D[i + 3],
    p3D[i + 4],
  );
  current!.next.next = contribution3D(
    p3D[i + 5],
    p3D[i + 6],
    p3D[i + 7],
    p3D[i + 8],
  );
}

const lookup: Contribution3D[] = [];
for (let i = 0; i < lookupPairs3D.length; i += 2) {
  lookup[lookupPairs3D[i]] = contributions[lookupPairs3D[i + 1]];
}

export function openSimplexNoise3D(
  { depth = 256, random = Math.random }: NoiseOptions = {},
): Noise3D {
  const mask = depth - 1;
  const perm = genPerm(depth, random);

  return (x: number, y: number, z: number): number => {
    const stretchOffset = (x + y + z) * Stretch3D;

    const xs = x + stretchOffset;
    const ys = y + stretchOffset;
    const zs = z + stretchOffset;

    const xsb = Math.floor(xs);
    const ysb = Math.floor(ys);
    const zsb = Math.floor(zs);

    const squishOffset = (xsb + ysb + zsb) * Squish3D;

    const dx0 = x - (xsb + squishOffset);
    const dy0 = y - (ysb + squishOffset);
    const dz0 = z - (zsb + squishOffset);

    const xins = xs - xsb;
    const yins = ys - ysb;
    const zins = zs - zsb;

    const inSum = xins + yins + zins;
    const hash = (yins - zins + 1) |
      ((xins - yins + 1) << 1) |
      ((xins - zins + 1) << 2) |
      (inSum << 3) |
      ((inSum + zins) << 5) |
      ((inSum + yins) << 7) |
      ((inSum + xins) << 9);

    let value = 0;

    for (
      let c: Contribution3D | undefined = lookup[hash];
      c !== undefined;
      c = c.next
    ) {
      const dx = dx0 + c.dx;
      const dy = dy0 + c.dy;
      const dz = dz0 + c.dz;

      const attn = 2 - dx * dx - dy * dy - dz * dz;
      if (attn > 0) {
        const px = xsb + c.xsb;
        const py = ysb + c.ysb;
        const pz = zsb + c.zsb;

        const indexPartA = perm[px & mask];
        const indexPartB = perm[(indexPartA + py) & mask];
        const index = perm[(indexPartB + pz) & mask];

        const valuePart = gradients3D[index % 72] * dx +
          gradients3D[(index + 1) % 72] * dy +
          gradients3D[(index + 2) % 72] * dz;

        value += attn * attn * attn * attn * valuePart;
      }
    }
    return value * Norm3D;
  };
}
