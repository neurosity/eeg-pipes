import { pipe } from "rxjs";
import { averagePower } from "./averagePower";
import { sliceFFT } from "./sliceFFT";

import { FREQUENCY_BANDS as frequencyBands } from "../../constants";

/**
 * Returns the average gamma power from a stream of PSDs
 * @method gammaPower
 * @example eeg$.pipe(epoch({ duration: 256, interval: 100, samplingRate: 256 }), fft({ bins: 256 }), gammaPower())
 * @returns {Observable<Array<number>>}
 */
export const gammaPower = () =>
  pipe(
    sliceFFT(frequencyBands.gamma),
    averagePower()
  );
