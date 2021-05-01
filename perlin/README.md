# Perlin Noise

This module implements Ken Perlin's original algorithm for noise generation.

## Usage

### PerlinOptions

An interface that extends `NoiseOptions` and allows for setting an alternative interpolation function as `mix` (default: `lerp`). Optionally passed to each perlin noise function.

### perlinNoise{2D, 3D, 4D}

Each function accepts `PerlinOptions`, generates and returns a relevant dimensional noise function.

```typescript
import { perlinNoise3D } from "https://deno.land/x/noise/mod.ts";

// Generate a 3D noise function with defaults
const noise = perlinNoise2D();

for (let x = 0; x < 100; x++) {
  for (let y = 0; y < 50; y++) {
    for (let z = 0; z < 50; z++) {
      console.log(noise(x, y, z));
    }
  }
}
```
