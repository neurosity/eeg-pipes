import { pipe } from "rxjs";
import { averagePower } from "./averagePower";
import { sliceFFT } from "./sliceFFT";

import { FREQUENCY_BANDS as frequencyBands } from "../../constants";

/**
 * Returns the average theta power from a stream of PSDs
 * @method thetaPower
 * @example eeg$.pipe(epoch({ duration: 256, interval: 100, samplingRate: 256 }), fft({ bins: 256 }), thetaPower())
 * @returns {Observable<Array<number>>}
 */
export const thetaPower = () =>
  pipe(
    sliceFFT(frequencyBands.theta),
    averagePower()
  );
