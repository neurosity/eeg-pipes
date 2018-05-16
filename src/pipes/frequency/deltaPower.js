import { createPipe } from "../../utils/createPipe";
import { averagePower } from "./averagePower";
import { sliceFFT } from "./sliceFFT";

import { FREQUENCY_BANDS as frequencyBands } from "../../constants";

/**
 * Returns the average delta power from a stream of PSDs
 * @method deltaPower
 * @example eeg$.pipe(epoch({ duration: 256, interval: 100, samplingRate: 256 }), fft({ bins: 256 }), deltaPower())
 * @returns {Observable<Array[number>}
 */
export const deltaPower = () => source =>
  createPipe(source, sliceFFT(frequencyBands.delta), averagePower());
