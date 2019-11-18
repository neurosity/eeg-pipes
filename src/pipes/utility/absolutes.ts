import { pipe } from "rxjs";
import { map } from "rxjs/operators";
import { absolute } from "../../utils/stats";

/**
 * @method absolutes
 * TLDR: Math.abs
 * @returns {number[]} Differences
 * @example
 * eeg$.pipe(absolutes())
 * // So, if EEG is [[1,-2,3,-4,5], [3,-4,2,-1,3]], the absolutes will be calculated as:
 * // [[1,2,3,4,5], [3,4,2,1,3]]
 */
export const absolutes = () =>
  pipe(
    map((epoch: any) => ({
      ...epoch,
      data: epoch.data.map(absolute)
    }))
  );
