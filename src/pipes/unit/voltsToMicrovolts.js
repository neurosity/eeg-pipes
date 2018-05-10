import { map } from "rxjs/operators";

import { createPipe } from "../../utils/createPipe";

import {
  USE_LOG as useLog,
  DATA_PROP as defaultDataProp
} from "../../constants";

/**
 * Converts a stream of EEG data (either eegObjects or Epochs) from volts to microvolts
 * @method toMicrovolts
 * @example eeg&.pipe(toMicrovolts)
 * @param {Object} options - Conversion options
 * @param {boolean} [options.useLog=false] Whether to use logarithmic conversion
 * @param {string} [options.dataProp='data'] Name of the key associated with eeg data
 *
 * @returns {Observable<Sample | Epoch>}
 */
export const voltsToMicrovolts = ({
  log = useLog,
  dataProp = defaultDataProp
} = {}) => source =>
  createPipe(
    source,
    map(eegObject => {
      const isEpoch = Array.isArray(eegObject.data[0]);
      const conversion = log
        ? volt => Math.log10(Math.pow(10, 6) * volt)
        : volt => Math.pow(10, 6) * volt;
      return {
        ...eegObject,
        [dataProp]: eegObject[dataProp].map(channel => {
          if (isEpoch) {
            return channel.map(conversion);
          }
          return conversion(channel);
        })
      };
    })
  );
