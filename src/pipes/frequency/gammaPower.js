import { createPipe } from "../../utils/createPipe";
import { averagePower } from "./averagePower";
import { sliceFFT } from "./sliceFFT";

import { FREQUENCY_BANDS as frequencyBands } from "../../constants";

/**
 * @method gammaPower
 * Filters FFT buffer based on gamma frequency range and averages the power
 *
 * @returns {Observable} fftBuffer
 */
export const gammaPower = () => source =>
  createPipe(
    source,
    sliceFFT(frequencyBands.gamma),
    averagePower()
  );
