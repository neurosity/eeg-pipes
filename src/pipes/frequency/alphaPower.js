import { createPipe } from "../../utils/createPipe";
import { averagePower } from "./averagePower";
import { sliceFFT } from "./sliceFFT";

import { FREQUENCY_BANDS as frequencyBands } from "../../constants";

/**
 * @method alphaPower
 * Filters FFT buffer based on alpha frequency range and averages the power
 *
 * @returns {Observable} fftBuffer
 */
export const alphaPower = () => source =>
  createPipe(
    source,
    sliceFFT(frequencyBands.alpha),
    averagePower()
  );
