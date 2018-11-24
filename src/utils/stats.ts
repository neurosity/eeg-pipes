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

export const mean = array => sum(array) / array.length;

export const variance = array => {
  const arrayMean = mean(array);
  return mean(array.map(num => Math.pow(num - arrayMean, 2)));
};

export const standardDeviation = array => Math.sqrt(variance(array));

export const meanAbsoluteDeviation = array => {
  const arrayMean = mean(array);
  return mean(array.map(num => Math.abs(num - arrayMean)));
};

// Function aliases:
export function average(array) {
  return mean(array);
}
