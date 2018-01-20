
import { map } from 'rxjs/operators';

import { createPipe } from '../../utils/createPipe';
import { filterByRange } from './filterByRange';

import {
    FREQUENCY_BANDS as frequencyBands
} from '../../constants';

/**
 * @method betaRange
 * Filters FFT buffer based on beta frequency range
 * 
 * @returns {Observable} fftBuffer
 */
export const betaRange = () =>
    source => createPipe(
        source,
        filterByRange(frequencyBands.beta)
    );
