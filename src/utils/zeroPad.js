/**
 * ZeroPads inputs for FFTs of non base 2
 * @method zeroPad *
 * @param Array<number> bufferedData
 * @param number fftLength
 * @returns Array<number>
 */

export const zeroPad = (buffer, fftLength) => {
  if (fftLength > buffer.length) {
    return buffer.concat(new Array(fftLength - buffer.length).fill(0));
  }
  return buffer;
};
