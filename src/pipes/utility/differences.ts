import { pipe } from "rxjs";
import { map } from "rxjs/operators";
import { difference } from "../../utils/stats";

/**
 * @method differences
 * Calculate i-th difference of every channel in EEG epoch
 * The i-th difference of a signal X with length n is X[n+i] - X[n]
 * @param {number} span Distance between subtracted array cells
 * @returns {number[]} Differences
 * @example
 * eeg$.pipe(differences(1))
 * // So, if an EEG channel is [1,2,3,4,5], the differences will be calculated as:
 * // [2-1,3-2,4-3,5-4] = [1,1,1,1]
 * eeg$.pipe(differences(2))
 * // So, if an EEG channel is [1,2,3,4,5], the differences will be calculated as:
 * // [3-1,4-2,5-3] = [2,2,2]
 */
export const differences = (span: number = 1) =>
  pipe(
    map((epoch: any) => ({
      ...epoch,
      data: epoch.data.map((channel: number[]) =>
        difference(channel, span)
      )
    }))
  );
