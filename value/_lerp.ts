/**
 * Linear interpolation
 * @param low The lower limit value
 * @param high The higher limit value
 * @param t The value to interpolate
 * @returns number
 */
export function lerp(low: number, high: number, t: number): number {
  return low * (1 - t) + high * t;
}
