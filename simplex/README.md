# Simplex Noise

This is an updated implementation of the improved, faster Simplex algorithm outlined in Stefan Gustavson's [Simplex noise demystified](http://webstaff.itn.liu.se/~stegu/simplexnoise/simplexnoise.pdf).

## Usage

### SimplexOptions

An interface used in each Simplex function, containing `depth` (size of permutation table, default: `512`) and `random` (a pseudo-random number generator with output in `(0.0, 1.0)`, default: `Math.random`).

### simplexNoise2D

Accepts an optional `SimplexOptions`; returns a `Noise2D: (x: number, y: number) => number` function.

### simplexNoise3D

Accepts an optional `SimplexOptions`; returns a `Noise3D: (x: number, y: number, z: number) => number` function.

### simplexNoise4D

Accepts an optional `SimplexOptions`; returns a `Noise4D: (x: number, y: number, z: number, w: number) => number` function.
