// This is free and unencumbered software released into the public domain

import { FractalOptions } from "./options.ts";
import { Noise2D, Noise3D } from "../noise.ts";
import { TwoPi } from "./_math.ts";

export function spherical(
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
  return (x: number, y: number) => {
    let a = amplitude;
    let f = frequency;
    let t = 0;
    let value = 0;
    const [nx, ny] = [x / circumference, y / circumference];

    for (let o = 0; o < octaves; o++) {
      const [rdx, rdy] = [nx * TwoPi, ny * Math.PI];
      const sinY = Math.sin(rdy + Math.PI);
      const i = TwoPi * Math.sin(rdx) * sinY;
      const j = TwoPi * Math.cos(rdx) * sinY;
      const d = TwoPi * Math.cos(rdy);
      value += noise3(f * i, f * j, f * d);
      t += a;
      a *= persistence;
      f *= lacunarity;
    }

    return value / t;
  };
}
