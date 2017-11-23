
import { map } from 'rxjs/operators';

import { createPipe } from '../../utils/createPipe';
import { groupByChannel as groupChannels } from '../../utils/groupByChannel';

import {
    DATA_PROP as defaultDataProp
} from '../../constants';

/**
 * @method groupByChannel
 * Takes a samples buffer and returns a buffer of channel groups
 * 
 * @returns {Observable} samplesBuffer
 */
export const groupByChannel = ({ dataProp = defaultDataProp } = {}) =>
    source => createPipe(
        source,
        map(samplesBuffer => groupChannels(samplesBuffer, dataProp))
    );
