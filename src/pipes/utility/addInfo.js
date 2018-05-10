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
 * Annotates stream with user-defined metadata. Can be applied to Samples or Chunks
 * @method addInfo
 * @example { samplingRate: 256, channelNames: ["Af&", "Fp1", "Fp2", "Af8"] }
 *
 * @param info
 * @returns {Observable} Sample or Chunk
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
