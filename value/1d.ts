// This is free and unencumbered software released into the public domain

import { Noise1D } from "../noise.ts";
import { ValueNoiseOptions } from "./options.ts";
import { lerp } from "./_lerp.ts";

export function valueNoise1D(
  { depth = 1024, random = Math.random }: ValueNoiseOptions = {},
): Noise1D {
  const p = new Float64Array(depth);
  for (let i = 0; i < depth; i++) p[i] = 2 * random() - 1;

  return (x: number) => {
    const x0 = x % depth;
    const x1 = Math.floor(x0);
    const x2 = (x1 + 1) % depth;

    return lerp(p[x1], p[x2], x0 - x1);
  };
}