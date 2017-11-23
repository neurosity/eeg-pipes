
import { map } from 'rxjs/operators';

import { createPipe } from '../../utils/createPipe';
import { filterByBand } from '../../utils/filterByBand';

/**
 * @method betaRange
 * Filters FFT buffer based on beta frequency range
 * 
 * @returns {Observable} fftBuffer
 */
export const betaRange = () =>
    source => createPipe(
        source,
        map(fftBuffer => filterByBand(fftBuffer, 'beta'))
    );
