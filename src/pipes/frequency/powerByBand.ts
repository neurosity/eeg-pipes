import { of, zip, pipe } from "rxjs";
import { mergeMap } from "rxjs/operators";

import { averagePower } from "./averagePower";
import { sliceFFT } from "./sliceFFT";

import { FREQUENCY_BANDS as defaultBands } from "../../constants";

/**
 * Takes a stream of PSDs and returns the average power for each of the classic EEG bands (alpha, beta, theta, etc.). Classic EEG bands can be overridden by providing a custom bands object (e.g. { lowAlpha: [7.5, 10], highAlpha: [10, 12.5] })
 * @method powerByBand
 * @example eeg$.pipe(epoch({ duration: 256, interval: 100, samplingRate: 256 }), fft({ bins: 256 }), powerByBand())
 * @param {Object} [bands] Custom bands object containing corresponding names and frequency ranges
 * @param {Function} [powerMapper] Custom mapping function to compute band power (default = averagePower)
 * @returns {Observable<Array<number>>}
 */
export const powerByBand = (
  bands = defaultBands,
  powerMapper = averagePower
) =>
  pipe(
    mergeMap((inputPSD) => {
      const entries = Object.entries(bands);
      const bandPowers = entries.map(([_, range]) =>
        of(inputPSD).pipe(sliceFFT(range), powerMapper())
      );
      const zipPowers = (...powers) =>
        powers.reduce(
          (acc, power, index) => ({
            ...acc,
            [entries[index][0]]: power
          }),
          {}
        );
      return zip(...bandPowers, zipPowers);
    })
  );
