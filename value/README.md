# Value Noise

These functions are relatively naive implementations of simple value noise generation.

## Usage

### ValueOptions

An interface used in each value noise function, that contains a `depth` (size of permutation table) and `random` (a pseudo-random number generator that outputs in `(0.0, 1.0)`; default is `Math.random`). The default `depth` is dependent on the dimension of the noise, due to the exponential permutation requirements for higher dimensions.

### valueNoise1D

Accepts an optional `ValueOptions` (default `depth` is `1024`); returns a `Noise1D: (x: number) => number` function.

### valueNoise2D

Accepts an optional `ValueOptions` (default `depth` is `512`); returns a `Noise2D: (x: number, y: number) => number` function.

### valueNoise3D

Accepts an optional `ValueOptions` (default `depth` is `256`); returns a `Noise3D: (x: number, y: number, z: number) => number` function.

### valueNoise4D

Accepts an optional `ValueOptions` (default `depth` is `128`); returns a `Noise4D: (x: number, y: number, z: number, w: number) => number` function.
