
import { map } from 'rxjs/operators';

import { createPipe } from '../../utils/createPipe';

const isObject = object => object instanceof Object;
const isFunction = object => typeof object === 'function';

const patch = sample => info => ({
    ...sample,
    info: {
        ...(sample.info || {}),
        ...(info || {})
    }
});

/**
 * @method addInfo
 * Annotates stream with metadata.
 * @example { sampleRate, bins }
 * 
 * @param info
 * @returns {Observable} sample
 */
export const addInfo = (arg = {}) =>
    source => createPipe(
        source,
        map(sample => {
            if (!isObject(sample)
            || (!isObject(arg) && !isFunction(arg))) {
                return sample;
            }
            const info = isFunction(arg) ? arg(sample) : arg;
            return patch(sample)(info);
        })
    );
