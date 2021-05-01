# OpenSimplex Noise

This module implements [OpenSimplex noise](https://en.wikipedia.org/wiki/OpenSimplex_noise).

## Usage

### openSimplexNoise{2D, 3D, 4D}

Each function accepts `NoiseOptions`, generates and returns a relevant dimensional noise function.

```typescript
import { openSimplexNoise4D } from "https://deno.land/x/noise/mod.ts";

// Generate a 4D noise function
const noise = openSimplexNoise4D();

for (let x = 0; x < 10; x++) {
  for (let y = 0; y < 5; y++) {
    for (let z = 0; z < 5; z++) {
      for (let w = 0; w < 5; w++) {
        console.log(noise(x, y, z, w));
      }
    }
  }
}
```
