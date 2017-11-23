
import { map } from 'rxjs/operators';

import { createPipe } from '../../utils/createPipe';
import { filterByBand } from '../../utils/filterByBand';

/**
 * @method gammaRange
 * Filters FFT buffer based on gamma frequency range
 * 
 * @returns {Observable} fftBuffer
 */
export const gammaRange = () =>
    source => createPipe(
        source,
        map(fftBuffer => filterByBand(fftBuffer, 'gamma'))
    );
