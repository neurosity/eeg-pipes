import { pipe } from "rxjs";
import { map } from "rxjs/operators";

import { standardDeviation } from "../../utils/stats";
import { DATA_PROP as defaultDataProp } from "../../constants";

/**
 * @method addSignalQuality
 * Adds a signal quality property to a stream of Epochs
 * signal quality is represented as standard deviation value for each channel
 * @example eeg$.pipe(addSignalQuality())
 * @param {Object} options - addSignalQuality options
 * @param {string} [options.dataProp='data] Name of key associated with eeg data
 * @returns {Observable<Epoch>}
 */
export const addSignalQuality = ({ dataProp = defaultDataProp } = {}) =>
  pipe(
    map((epoch: any) => {
      const names = epoch.info.channelNames
        ? epoch.info.channelNames
        : epoch[dataProp].map((_, i) => i);
      return {
        ...epoch,
        info: {
          ...epoch.info,
          signalQuality: epoch[dataProp].reduce(
            (acc, curr, index) => ({
              ...acc,
              [names[index]]: standardDeviation(curr)
            }),
            {}
          )  
        }
      };
    })
  );
