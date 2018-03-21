import { map } from "rxjs/operators";

import { createPipe } from "../../utils/createPipe";

import { SAMPLE_RATE as defaultSampleRate } from "../../constants";

/**
 * @method sliceFFT
 * Filters FFT buffer by frequency range.
 *
 * @param {array} range: [min, max]
 * @param {number} sampleRate
 * @returns {Observable} fftBuffer
 */
export const sliceFFT = (
  [min = 0, max = 128],
  sampleRate = defaultSampleRate
) => source =>
  createPipe(
    source,
    map(fftBuffer => {
      if (!fftBuffer.length || !fftBuffer[0].length) {
        return fftBuffer;
      }

      const bins = fftBuffer[0].length * 2;

      const ranges = Array.from({ length: bins / 2 }, (range, index) =>
        Math.ceil(index * (sampleRate / bins))
      );

      return fftBuffer.map(channel =>
        channel.filter(
          (spectrum, index) => ranges[index] >= min && ranges[index] <= max
        )
      );
    })
  );
