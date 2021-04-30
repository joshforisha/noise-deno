// This is free and unencumbered software released into the public domain

import { FractalOptions } from "./options.ts";
import { Noise3D } from "../noise.ts";

export function cubic(
  noise3: Noise3D,
  {
    amplitude = 1.0,
    frequency = 1.0,
    lacunarity = 2.0,
    octaves = 1,
    persistence = 0.5,
  }: FractalOptions = {},
): Noise3D {
  return (x: number, y: number, z: number) => {
    let a = amplitude;
    let f = frequency;
    let t = 0;
    let value = 0;

    for (let o = 0; o < octaves; o++) {
      value += a * noise3(f * x, f * y, f * z);
      t += a;
      a *= persistence;
      f *= lacunarity;
    }

    return value / t;
  };
}
