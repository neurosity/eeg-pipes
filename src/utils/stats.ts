/**
 * A collection of useful statistics functions
 * Adapted from Daniel Hug's gist: https://gist.github.com/Daniel-Hug/7273430
 */

export const max = array => Reflect.apply(Math.max, null, array);

export const min = array => Reflect.apply(Math.min, null, array);

export const range = array => max(array) - min(array);

export const sum = array => {
  let num = 0;
  for (let i = 0, l = array.length; i < l; i++) {
    num += array[i];
  }
  return num;
};

export const mean = (array: number[]): number =>
  sum(array) / array.length;

export const variance = array => {
  const arrayMean = mean(array);
  return mean(array.map(num => Math.pow(num - arrayMean, 2)));
};

export const standardDeviation = (array: number[]) =>
  Math.sqrt(variance(array));

export const meanAbsoluteDeviation = (array: number[]) => {
  const arrayMean = mean(array);
  return mean(array.map(num => Math.abs(num - arrayMean)));
};

/**
 * The i-th difference of a signal X with length n is Xn+i - Xn
 */
export const difference = (
  array: number[],
  span: number = 1
): number[] => {
  if (span > array.length - 1)
    throw new Error("Span must be less than the array length");

  let diff = new Array(array.length - span);

  for (let i = 0; i < array.length - span; i++) {
    diff[i] = array[i + span] - array[i];
  }

  return diff;
};

// Function aliases:
export function average(array: number[]): number {
  return mean(array);
}

export const absolute = (array: number[]): number[] =>
  array.map(Math.abs);
