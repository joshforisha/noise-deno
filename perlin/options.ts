// This is free and unencumbered software released into the public domain

import { Interpolate } from "../math.ts";
import { NoiseOptions } from "../options.ts";

export type PerlinOptions = NoiseOptions & { mix?: Interpolate };
