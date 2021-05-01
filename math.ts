// This is free and unencumbered software released into the public domain

export type Interpolate = (low: number, high: number, t: number) => number;

/**
 * Interpolates within a one-dimensional (scalar) Bezier curve.
 * @param {number[4]} values - Array of four control values
 * @param {number} t - The value to interpolate
 * @returns {number} The interpolated value
 */
export function bezier(
  [a, b, c, d]: [number, number, number, number],
  t: number,
): number {
  return (
    ((1 - t) ** 3 * a) +
    (3 * (1 - t) ** 2 * t * b) +
    (3 * (1 - t) * t ** 2 * c) +
    (t ** 3 * d)
  );
}

/**
 * Generates a function for cubic interpolation between two values, based on
 * a skew factor.
 * @param {number} factor - Float to skew first and last control values with
 * @returns {function} Interpolate function
 */
export function cerp(factor: number): Interpolate {
  const skew = 1 + factor;
  return (low: number, high: number, t: number): number => {
    return bezier([low, low * skew, high / skew, high], t);
  };
}

/**
 * Linearly interpolates between two values.
 * @param {number} low
 * @param {number} high
 * @param {number} t Something about t
 * @returns {number} Interpolated float between `low` and `high`
 */
export function lerp(low: number, high: number, t: number): number {
  return low * (1 - t) + high * t;
}
