/**
 * A collection of useful statistics functions
 * Adapted from Daniel Hug's gist: https://gist.github.com/Daniel-Hug/7273430
 */

const max = array => Reflect.apply(Math.max, null, array);

const min = array => Reflect.apply(Math.min, null, array);

const range = array => max(array) - min(array);

// Array.isArray(value) ? average(value) : value;

const sum = array => {
  let num = 0;
  for (let i = 0, l = array.length; i < l; i++) {
    num += array[i];
  }
  return num;
};

const mean = array => sum(array) / array.length;

const variance = array => {
  const arrayMean = mean(array);
  return mean(array.map(num => Math.pow(num - arrayMean, 2)));
};

const standardDeviation = array => Math.sqrt(variance(array));

const meanAbsoluteDeviation = array => {
  const arrayMean = mean(array);
  return mean(array.map(num => Math.abs(num - arrayMean)));
};

// Function aliases:
const average = mean;

module.exports = {
  max,
  min,
  sum,
  range,
  average,
  mean,
  variance,
  standardDeviation,
  meanAbsoluteDeviation
};
