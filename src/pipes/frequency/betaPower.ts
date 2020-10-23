import { pipe } from "rxjs";
import { averagePower } from "./averagePower";
import { sliceFFT } from "./sliceFFT";

import { FREQUENCY_BANDS as frequencyBands } from "../../constants";

/**
 * Returns the average beta power from a stream of PSDs
 * @method betaPower
 * @example eeg$.pipe(epoch({ duration: 256, interval: 100, samplingRate: 256 }), fft({ bins: 256 }), betaPower())
 * @returns {Observable<Array<number>>}
 */
export const betaPower = () =>
  pipe(
    sliceFFT(frequencyBands.beta),
    averagePower()
  );
