import { pipe } from "rxjs";
import { map } from "rxjs/operators";
import { average } from "../../utils/stats";

import { IEpoch } from "../../types/epoch";

/**
 * @method center
 * Demeans an epoch of EEG data by subtracting the mean of each channel's values in the epoch from all channels
 * @example eeg$.pipe(epoch({ duration: 1024, interval: 100, samplingRate: 256 }), deMean())
 * @param {mean} number to center values on
 * @returns {Observable} Epoch
 */
export const center = (mean: number = 0) =>
  pipe(
    map((epoch: any) => {
      const channelMeans = epoch.data.map(average);
      return {
        ...epoch,
        data: epoch.data.map((channelData, index) =>
          channelData.map(value => value - channelMeans[index] + mean)
        )
      };
    })
  );

export const deMean = center;
