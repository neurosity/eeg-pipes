import { map } from "rxjs/operators";

import { createPipe } from "../../utils/createPipe";
import { average } from "../../utils";
import { SAMPLE_RATE as defaultSampleRate } from "../../constants";

/**
 * @method averagePower
 * Given an fftBuffer, it outputs the average per channel
 *
 * @returns {Observable} band powers array
 */
export const averagePower = () => source =>
  createPipe(
    source,
    map(fftBuffer =>
      fftBuffer.reduce((acc, channel) => [
        ...acc,
        average(channel)
      ], [])
    )
  );
