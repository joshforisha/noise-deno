# Noise

A variety of standardized noise algorithms for Deno.

## Implemented Algorithms

- OpenSimplex noise: 2D, 3D, 4D
- Perlin noise: 2D, 3D, 4D
- Simplex noise: 2D, 3D, 4D
- Value noise: 1D, 2D, 3D, 4D

## Usage

### Fractal Noise

All shaping functions within `fractal/` work with any noise-generating functions in the other modules, in order to stack and octave in a standardized way.

### Function Types

All noise functions output a float between -1 and 1 (`[-1, 1]`).

```typescript
type Noise1D = (x: number) => number;
type Noise2D = (x: number, y: number) => number;
type Noise3D = (x: number, y: number, z: number) => number;
type Noise4D = (x: number, y: number, z: number, w: number) => number;
```

### Interpolations

By default, noise algorithms that rely on interpolating values (namely Perlin and value), default to using linear interpolation `lerp`, but their options allow for setting `mix` to override this. There are other interpolation functions within the `math.ts` module.

```typescript
type Interpolate = (low: number, high: number, t: number) => number;
```

### NoiseOptions

Base options for all noise functions. Contains `depth` (size of permutation table) and `random` (pseudo-random number generator in `[0, 1]`, default: `Math.random`).

```typescript
interface NoiseOptions {
  depth?: number;
  random?: () => number;
}
```
