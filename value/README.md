# Value Noise

This module contains functions that are relatively naive implementations of simple value noise generation.

## Usage

The default `depth` for `NoiseOptions` for these functions is dependent on the dimension of the noise, due to the exponential permutation requirements for higher dimensions.

### valueNoise1D

Accepts `NoiseOptions` (default `depth` is `1024`) and returns a `Noise1D` function.

### valueNoise2D

Accepts `NoiseOptions` (default `depth` is `512`) and returns a `Noise2D` function.

### valueNoise3D

Accepts `NoiseOptions` (default `depth` is `256`) and returns a `Noise3D` function.

### valueNoise4D

Accepts `NoiseOptions` (default `depth` is `128`) and returns a `Noise4D` function.
