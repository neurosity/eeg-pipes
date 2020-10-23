import { pipe } from "rxjs";
import { map } from "rxjs/operators";
import { mean } from "../../utils/stats";

/**
 * @method means
 * Calculate mean of every channel in EEG epoch
 *
 * @example eeg$.pipe(epoch({ duration: 1024, interval: 100, samplingRate: 256 }), means())
 * @returns {number[]} Means
 */
export const means = () =>
  pipe(map((epoch: any) => epoch.data.map(mean)));
