// This is free and unencumbered software released into the public domain

import { Noise1D } from "../noise.ts";
import { ValueOptions } from "./options.ts";
import { lerp } from "../math.ts";

export function valueNoise1D(
  { depth = 1024, mix = lerp, random = Math.random }: ValueOptions = {},
): Noise1D {
  const mask = depth - 1;
  const p = new Float64Array(depth);
  for (let i = 0; i < depth; i++) p[i] = 2 * random() - 1;

  return (x: number) => {
    const x0 = x % mask;
    const x1 = Math.floor(x0);
    const x2 = (x1 + 1) % mask;

    return mix(p[x1], p[x2], x0 - x1);
  };
}
