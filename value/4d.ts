// This is free and unencumbered software released into the public domain

import { Noise4D } from "../noise.ts";
import { ValueOptions } from "./options.ts";
import { lerp } from "../math.ts";

export function valueNoise4D(
  { depth = 128, mix = lerp, random = Math.random }: ValueOptions = {},
): Noise4D {
  const mask = depth - 1;
  const p: Float64Array[][][] = [];
  for (let i = 0; i < depth; i++) {
    p[i] = [];
    for (let j = 0; j < depth; j++) {
      p[i][j] = [];
      for (let k = 0; k < depth; k++) {
        p[i][j][k] = new Float64Array(depth);
        for (let l = 0; l < depth; l++) {
          p[i][j][k][l] = 2 * random() - 1;
        }
      }
    }
  }

  return (x: number, y: number, z: number, w: number) => {
    const x0 = x % mask;
    const x1 = Math.floor(x0);
    const x2 = (x1 + 1) % mask;

    const y0 = y % mask;
    const y1 = Math.floor(y0);
    const y2 = (y1 + 1) % mask;

    const z0 = z % mask;
    const z1 = Math.floor(z0);
    const z2 = (z1 + 1) % mask;

    const w0 = w % mask;
    const w1 = Math.floor(w0);
    const w2 = (w1 + 1) % mask;

    return mix(
      mix(
        mix(
          mix(p[x1][y1][z1][w1], p[x2][y1][z1][w1], x0 - x1),
          mix(p[x1][y2][z1][w1], p[x2][y2][z1][w1], x0 - x1),
          y0 - y1,
        ),
        mix(
          mix(p[x1][y1][z2][w1], p[x2][y1][z2][w1], x0 - x1),
          mix(p[x1][y2][z2][w1], p[x2][y2][z2][w1], x0 - x1),
          y0 - y1,
        ),
        z0 - z1,
      ),
      mix(
        mix(
          mix(p[x1][y1][z1][w2], p[x2][y1][z1][w2], x0 - x1),
          mix(p[x1][y2][z1][w2], p[x2][y2][z1][w2], x0 - x1),
          y0 - y1,
        ),
        mix(
          mix(p[x1][y1][z2][w2], p[x2][y1][z2][w2], x0 - x1),
          mix(p[x1][y2][z2][w2], p[x2][y2][z2][w2], x0 - x1),
          y0 - y1,
        ),
        z0 - z1,
      ),
      w0 - w1,
    );
  };
}
