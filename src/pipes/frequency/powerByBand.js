import { of } from "rxjs/observable/of";
import { zip } from "rxjs/observable/zip";
import { flatMap } from "rxjs/operators";

import { createPipe } from "../../utils/createPipe";
import { averagePower } from "./averagePower";
import { sliceFFT } from "./sliceFFT";

import {
    SAMPLE_RATE as defaultSampleRate,
    FREQUENCY_BANDS as defaultBands
} from "../../constants";

/**
 * @method powerByBand
 * Returns an object with average band powers for all the classic EEG bands.
 *
 * @param {object} bands { [bandName]: range[min, max] }
 * @returns {Observable} bands { [bandName]: bandPower }
 */
export const powerByBand = (
  bands = defaultBands,
  sampleRate = defaultSampleRate
) => source =>
  createPipe(
    source,
    flatMap(fftBuffer => {
      const entries = Object.entries(bands);
      const bandPowers = entries.map(([, range ]) =>
        of(fftBuffer).pipe(
          sliceFFT(range, sampleRate),
          averagePower()
        )
      );
      const zipPowers = (...powers) =>
        powers.reduce((acc, power, index) => ({
          ...acc,
          [entries[index][0]]: power
        }), {});
      return zip(...bandPowers, zipPowers);
    })
  );
