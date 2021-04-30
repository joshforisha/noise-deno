// This is free and unencumbered software released into the public domain

import { Noise3D } from "../noise.ts";
import { ValueNoiseOptions } from "./options.ts";
import { lerp } from "./_lerp.ts";

export function valueNoise3D(
  { depth = 256, random = Math.random }: ValueNoiseOptions = {},
): Noise3D {
  const mask = depth - 1;
  const p: Float64Array[][] = [];
  for (let i = 0; i < depth; i++) {
    p[i] = [];
    for (let j = 0; j < depth; j++) {
      p[i][j] = new Float64Array(depth);
      for (let k = 0; k < depth; k++) {
        p[i][j][k] = 2 * random() - 1;
      }
    }
  }

  return (x: number, y: number, z: number) => {
    while (x < 0) x += depth;
    const x0 = x % mask;
    const x1 = Math.floor(x0);
    const x2 = (x1 + 1) % mask;

    while (y < 0) y += depth;
    const y0 = y % mask;
    const y1 = Math.floor(y0);
    const y2 = (y1 + 1) % mask;

    while (z < 0) z += depth;
    const z0 = z % mask;
    const z1 = Math.floor(z0);
    const z2 = (z1 + 1) % mask;

    return lerp(
      lerp(
        lerp(p[x1][y1][z1], p[x2][y1][z1], x0 - x1),
        lerp(p[x1][y2][z1], p[x2][y2][z1], x0 - x1),
        y0 - y1,
      ),
      lerp(
        lerp(p[x1][y1][z2], p[x2][y1][z2], x0 - x1),
        lerp(p[x1][y2][z2], p[x2][y2][z2], x0 - x1),
        y0 - y1,
      ),
      z0 - z1,
    );
  };
}
