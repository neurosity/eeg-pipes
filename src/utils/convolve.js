/**
 * @method convolve
 * Returns the discrete, linear convolution of two one-dimensional sequences. Convolution in time/space is equivalent to multiplication in the frequency domain. Thus, it can be used to compute filter coefficients that will combine the effects of multiple filters.
 * @example [1,2,3], [4,5,6]
 * @param {Array<number>} vec1, {Array<number>} vec2
 * @returns {Array<number>}
 */

export const convolve = (vec1, vec2) => {
  if (vec1.length === 0 || vec2.length === 0) {
    throw new Error("Vectors can not be empty!");
  }
  const volume = vec1;
  const kernel = vec2;
  let displacement = 0;
  const convVec = [];

  for (let i = 0; i < volume.length; i++) {
    for (let j = 0; j < kernel.length; j++) {
      if (displacement + j !== convVec.length) {
        convVec[displacement + j] =
          convVec[displacement + j] + volume[i] * kernel[j];
      } else {
        convVec.push(volume[i] * kernel[j]);
      }
    }
    displacement++;
  }

  return convVec;
};
