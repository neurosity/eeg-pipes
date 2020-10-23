import { pipe } from "rxjs";
import { map } from "rxjs/operators";

import { ISample } from "../../types/sample";
import { Info } from "../../types/info";

const isObject = object =>
  object instanceof Object && object === Object(object);
const isFunction = object => typeof object === "function";

const patch = (sample: ISample) => (info: Info) => ({
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
 * @param {Object} info Info to be added to the EEG stream. Relevant info may include: `samplingRate` and `channelNames`
 * @returns {Observable<Sample|Epoch|PSD>}
 */
export const addInfo = (infoValue: any) =>
  pipe(
    map((sample: any) => {
      if (
        !isObject(sample) ||
        (!isObject(infoValue) && !isFunction(infoValue))
      ) {
        return sample;
      }
      const info: Info = isFunction(infoValue)
        ? infoValue(sample)
        : infoValue;
      return patch(sample)(info);
    })
  );
