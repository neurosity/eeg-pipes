
import { map } from 'rxjs/operators';

import { createPipe } from '../../utils/createPipe';

import {
    DATA_PROP as defaultDataProp
} from '../../constants';

/**
 * @method pickChannels
 * Selects channel based on channel number
 * 
 * @param {Object} options
 * @returns {Observable} sample
 */
export const pickChannels = ({ channels = [], dataProp = defaultDataProp } = {}) =>
    source => createPipe(
        source,
        map(sample => {

            const channelData = sample[dataProp]
                .filter((channel, index) => 
                    channels.includes(index + 1)
                );

            return {
                ...sample,
                [dataProp]: channelData
            };
        })
    );
