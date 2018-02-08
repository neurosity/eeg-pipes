import { createPipe } from "../../utils/createPipe";
import { filterByRange } from "./filterByRange";

import { FREQUENCY_BANDS as frequencyBands } from "../../constants";

/**
 * @method thetaRange
 * Filters FFT buffer based on theta frequency range
 *
 * @returns {Observable} fftBuffer
 */
export const thetaRange = () => source =>
  createPipe(source, filterByRange(frequencyBands.theta));
