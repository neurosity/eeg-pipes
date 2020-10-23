import { pipe } from "rxjs";
import { map } from "rxjs/operators";

import { standardDeviation } from "../../utils/stats";

/**
 * @method standardDeviations
 * Compute the standard deviation on each channel
 * @example eeg$.pipe(standardDeviations())
 * @returns {number[]} Standard deviations
 */
export const standardDeviations = () =>
  pipe(
    map((epoch: any) => {
      return epoch.data.map(standardDeviation);
    })
  );
