import { pipe } from "rxjs";
import { map } from "rxjs/operators";

/**
 * Slices a stream of PSDs to a specific frequency range defined by a minimum and maximum frequency in Hz
 * @method sliceFFT
 * @example eeg$.pipe(epoch({ duration: 256, interval: 100, samplingRate: 256 }), fft({ bins: 256 }), sliceFFT([2, 30]))
 * @param {Array<number>} range Array containing minimum and maximum frequencies
 * @returns {Observable<PSD>}
 */
export const sliceFFT = ([min = 0, max = 128]) =>
  pipe(
    map(inputPSD => {
      if (
        !inputPSD.psd ||
        !inputPSD.psd.length ||
        !inputPSD.psd[0].length
      ) {
        return { psd: inputPSD };
      }

      const filteredPSD = inputPSD.psd.map(channel =>
        channel.filter(
          (spectrum, index) =>
            inputPSD.freqs[index] >= min && inputPSD.freqs[index] <= max
        )
      );

      return {
        ...inputPSD,
        psd: filteredPSD,
        freqs: inputPSD.freqs.filter(freq => freq >= min && freq <= max)
      };
    })
  );
