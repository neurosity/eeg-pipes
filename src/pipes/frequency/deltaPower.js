import { createPipe } from "../../utils/createPipe";
import { averagePower } from "./averagePower";
import { sliceFFT } from "./sliceFFT";

import { FREQUENCY_BANDS as frequencyBands } from "../../constants";

/**
 * @method deltaPower
 * Filters FFT buffer based on delta frequency range and averages the power
 *
 * @returns {Observable} fftBuffer
 */
export const deltaPower = () => source =>
  createPipe(
    source,
    sliceFFT(frequencyBands.delta),
    averagePower()
  );
