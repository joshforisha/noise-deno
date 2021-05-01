# Value Noise

This module contains functions that are relatively naive implementations of simple value noise generation.

## Usage

### ValueOptions

An interface that extends `NoiseOptions` and allows for setting an alternative interpolation function as `mix` (default: `lerp`). Optionally passed to each value noise function.

The default `depth` value for these functions is dependent on the dimension of the noise, due to the exponential permutation requirements for higher dimensions.

### valueNoise{1D, 2D, 3D, 4D}

Each function accepts `ValueOptions`, generates and returns a relevant dimensional noise function.

```typescript
import { cerp, valueNoise2D } from "https://deno.land/x/noise/mod.ts";

// Generate a 2D noise function with smoother cubic interpolation
const noise = valueNoise2D({ mix: cerp(0.1) });

for (let x = 0; x < 10; x++) {
  for (let y = 0; y < 5; y++) {
    console.log(noise(x, y));
  }
}
```
