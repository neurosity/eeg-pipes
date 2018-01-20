
import { map } from 'rxjs/operators';

import { createPipe } from '../../utils/createPipe';
import { filterByRange } from './filterByRange';

import {
    FREQUENCY_BANDS as frequencyBands
} from '../../constants';

/**
 * @method alphaRange
 * Filters FFT buffer based on alpha frequency range
 * 
 * @returns {Observable} fftBuffer
 */
export const alphaRange = () =>
    source => createPipe(
        source,
        filterByRange(frequencyBands.alpha)
    );
