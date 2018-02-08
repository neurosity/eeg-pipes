import { createPipe } from "../../utils/createPipe";
import { filterByRange } from "./filterByRange";

import { FREQUENCY_BANDS as frequencyBands } from "../../constants";

/**
 * @method deltaRange
 * Filters FFT buffer based on delta frequency range
 *
 * @returns {Observable} fftBuffer
 */
export const deltaRange = () => source =>
  createPipe(source, filterByRange(frequencyBands.delta));
