import { createPipe } from "../../utils/createPipe";
import { filterByRange } from "./filterByRange";

import { FREQUENCY_BANDS as frequencyBands } from "../../constants";

/**
 * @method gammaRange
 * Filters FFT buffer based on gamma frequency range
 *
 * @returns {Observable} fftBuffer
 */
export const gammaRange = () => source =>
  createPipe(source, filterByRange(frequencyBands.gamma));
