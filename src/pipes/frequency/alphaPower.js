import { createPipe } from "../../utils/createPipe";
import { averagePower } from "./averagePower";
import { sliceFFT } from "./sliceFFT";

import { FREQUENCY_BANDS as frequencyBands } from "../../constants";

/**
 * Returns the average alpha power from a stream of PSDs
 * @method alphaPower
 * @example eeg$.pipe(epoch({ duration: 256, interval: 100, samplingRate: 256 }), fft({ bins: 256 }), alphaPower())
 * @returns {Observable<Array[number>}
 */
export const alphaPower = () => source =>
  createPipe(source, sliceFFT(frequencyBands.alpha), averagePower());
