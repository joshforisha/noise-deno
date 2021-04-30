# Fractal Noise

This module contains numerous convenience functions for creating summed, octaved and shaped noise output. These functions can utilize any noise generation functions that adhere to the base function types.

## Usage

### FractalOptions

An interface used with each fractal noise function, containing:
- `amplitude: number` A float, the initial amplitude multiplier for scaling noise output in each octave (default: `1.0`)
- `frequency: number` A float, the initial frequency for multiplying the scaled individual coordinates in each octave (default: `1.0`)
- `lacunarity: number` A float, defines the scaling of frequency between octaves (default: `2.0`)
- `octaves: number` An integer, how many octaves to stack the noise function (default: `1`)
- `persistence: number` A float, defines the scaling of amplitude between octaves (default: `0.5`)

### cubic

Accepts a `Noise3D`, a `circumference: number`, and an optional `FractalOptions`; returns a `Noise3D` for fractal noise in three dimensions.

### cylindrical

Accepts a `Noise3D` and an optional `FractalOptions`; returns a `Noise2D` for fractal noise on a cylinder's surface. This allows for "wrapped" textures across the x-axis when drawn in two dimensions.

### linear

Accepts a `Noise1D` and an optional `FractalOptions`; returns a `Noise1D` for fractal noise in one dimension.

### rectangular

Accepts a `Noise2D` and an optional `FractalOptions`; returns a `Noise2D` for fractal noise in two dimensions.

### spherical

Accepts a `Noise3D`, a `circumference: number`, and an optional `FractalOptions`; returns a `Noise2D` for fractal noise on a sphere's surface with two dimensional coordinates.
