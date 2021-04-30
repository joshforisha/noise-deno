// This is free and unencumbered software released into the public domain

import { FractalOptions } from "./options.ts";
import { Noise2D, Noise3D } from "../noise.ts";
import { TwoPi } from "./_math.ts";

export function cylindrical(
  noise3: Noise3D,
  circumference: number,
  {
    amplitude = 1.0,
    frequency = 1.0,
    lacunarity = 2.0,
    octaves = 1,
    persistence = 0.5,
  }: FractalOptions = {},
): Noise2D {
  const radius = circumference / TwoPi;

  return (x: number, y: number) => {
    let a = amplitude;
    let f = frequency;
    let t = 0;
    let value = 0.0;

    for (let o = 0; o < octaves; o++) {
      const nx = x / circumference;
      const rdx = nx * TwoPi;
      const [i, j] = [radius * Math.sin(rdx), radius * Math.cos(rdx)];
      value += a * noise3(f * i, f * j, f * y);
      t += a;
      a *= persistence;
      f *= lacunarity;
    }

    return value / t;
  };
}
