# Simplex Noise

This is an updated implementation of the improved, faster Simplex algorithm outlined in Stefan Gustavson's [Simplex noise demystified](http://webstaff.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf).

## Usage

### simplexNoise{2D, 3D, 4D}

Each function accepts `NoiseOptions`, generates and returns a relevant dimensional noise function.

```typescript
import { simplexNoise2D } from "https://deno.land/x/noise/mod.ts";

// Generate a 2D noise function
const noise = simplexNoise2D();

for (let x = 0; x < 10; x++) {
  for (let y = 0; y < 5; y++) {
    console.log(noise(x, y);
  }
}
```
