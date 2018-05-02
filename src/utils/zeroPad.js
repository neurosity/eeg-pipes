/**
 * @method zeroPad
 * zeroPads inputs for FFTs of non base 2
 * @param Array<number> bufferedData, number fftLength
 * @returns Array<number>
 */

export const zeroPad = (buffer, fftLength) => {
  if (fftLength > buffer.length) {
    console.log("zeropadding: ", fftLength - buffer.length);
    return buffer.concat(new Array(fftLength - buffer.length).fill(0));
  }
  return buffer;
};
