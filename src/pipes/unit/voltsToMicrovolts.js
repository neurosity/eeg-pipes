
import { map } from 'rxjs/operators';

import { createPipe } from '../../utils/createPipe';

import {
    USE_LOG as useLog,
    DATA_PROP as defaultDataProp
} from '../../constants';

/**
 * @method toMicrovolts
 * Takes a data stream of samples and returns the values in microvolts
 * 
 * @param {Object} options
 * @returns {Observable}
 */
export const voltsToMicrovolts = ({ log = useLog, dataProp = defaultDataProp } = {}) =>
    source => createPipe(
        source,
        map(sample => ({
            ...sample,
            [dataProp]: sample[dataProp].map(volt => log
                ? Math.log10(Math.pow(10, 6) * volt)
                : Math.pow(10, 6) * volt
            )
        }))
    );
