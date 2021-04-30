// This is free and unencumbered software released into the public domain

import { Noise2D } from "../noise.ts";
import { ValueNoiseOptions } from "./options.ts";
import { lerp } from "../_utils.ts";

export function valueNoise2D(
  { depth = 512, random = Math.random }: ValueNoiseOptions = {},
): Noise2D {
  const mask = depth - 1;
  const p: Float64Array[] = [];
  for (let i = 0; i < depth; i++) {
    p[i] = new Float64Array(depth);
    for (let j = 0; j < depth; j++) {
      p[i][j] = 2 * random() - 1;
    }
  }

  return (x: number, y: number) => {
    const x0 = x % mask;
    const x1 = Math.floor(x0);
    const x2 = (x1 + 1) % mask;

    const y0 = y % mask;
    const y1 = Math.floor(y0);
    const y2 = (y1 + 1) % mask;

    return lerp(
      lerp(p[x1][y1], p[x2][y1], x0 - x1),
      lerp(p[x1][y2], p[x2][y2], x0 - x1),
      y0 - y1,
    );
  };
}
