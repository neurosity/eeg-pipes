
import { map } from 'rxjs/operators';

import { createPipe } from '../../utils/createPipe';
import { filterByBand } from '../../utils/filterByBand';

/**
 * @method alphaRange
 * Filters FFT buffer based on alpha frequency range
 * 
 * @returns {Observable} fftBuffer
 */
export const alphaRange = () =>
    source => createPipe(
        source,
        map(fftBuffer => filterByBand(fftBuffer, 'alpha'))
    );
