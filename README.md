# Noise

A variety of standardized noise algorithms for Deno.

## Implemented Algorithms

- OpenSimplex noise: 2D
- Perlin noise: 2D, 3D, 4D
- (Fast) Simplex noise: 2D, 3D, 4D
- Value noise: 1D, 2D, 3D, 4D

## Usage

### Function Types

All noise functions output a float between -1 and 1 (`[-1, 1]`).

```typescript
type Noise1D = (x: number) => number;
type Noise2D = (x: number, y: number) => number;
type Noise3D = (x: number, y: number, z: number) => number;
type Noise4D = (x: number, y: number, z: number, w: number) => number;
```

### NoiseOptions

Passed into all noise functions as an optional argument. Contains `depth` (size of permutation table) and `random` (pseudo-random number generator in `[0, 1]`, default: `Math.random`).
