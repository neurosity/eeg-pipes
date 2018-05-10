import { map } from "rxjs/operators";

import { createPipe } from "../../utils/createPipe";

const isObject = object => object instanceof Object;
const isFunction = object => typeof object === "function";

const patch = sample => info => ({
  ...sample,
  info: {
    ...(sample.info || {}),
    ...(info || {})
  }
});

/**
 * Annotates stream with user-defined metadata
 * @method addInfo
 * @example eeg$.pipe(addinfo({ samplingRate: 256, channelNames: ["Af7", "Fp1", "Fp2", "Af8"] })
 *
 * @param {Object} info - Info to be added to the EEG stream. Relevant info may include: `samplingRate` and `channelNames`
 * @returns {Observable<Sample | Epoch | PSD>}
 */
export const addInfo = (arg = {}) => source =>
  createPipe(
    source,
    map(sample => {
      if (!isObject(sample) || (!isObject(arg) && !isFunction(arg))) {
        return sample;
      }
      const info = isFunction(arg) ? arg(sample) : arg;
      return patch(sample)(info);
    })
  );
