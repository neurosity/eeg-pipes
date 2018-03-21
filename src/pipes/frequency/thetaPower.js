import { createPipe } from "../../utils/createPipe";
import { averagePower } from "./averagePower";
import { sliceFFT } from "./sliceFFT";

import { FREQUENCY_BANDS as frequencyBands } from "../../constants";

/**
 * @method thetaPower
 * Filters FFT buffer based on theta frequency range and averages the power
 *
 * @returns {Observable} fftBuffer
 */
export const thetaPower = () => source =>
  createPipe(
    source,
    sliceFFT(frequencyBands.theta),
    averagePower()
  );
