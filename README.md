# Noise

Noise algorithms for Deno.

## Function Types

All noise functions output a float between -1 and 1.

```typescript
type Noise1D = (x: number) => number;
type Noise1D = (x: number, y: number) => number;
type Noise1D = (x: number, y: number, z: number) => number;
type Noise1D = (x: number, y: number, z: number, w: number) => number;
```
