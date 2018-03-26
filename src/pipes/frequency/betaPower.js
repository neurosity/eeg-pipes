import { createPipe } from "../../utils/createPipe";
import { averagePower } from "./averagePower";
import { sliceFFT } from "./sliceFFT";

import { FREQUENCY_BANDS as frequencyBands } from "../../constants";

/**
 * @method betaPower
 * Filters FFT buffer based on beta frequency range and averages the power
 *
 * @returns {Observable} fftBuffer
 */
export const betaPower = () => source =>
  createPipe(
    source,
    sliceFFT(frequencyBands.beta),
    averagePower()
  );
