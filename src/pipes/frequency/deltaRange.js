
import { map } from 'rxjs/operators';

import { createPipe } from '../../utils/createPipe';
import { filterByBand } from '../../utils/filterByBand';

/**
 * @method deltaRange
 * Filters FFT buffer based on delta frequency range
 * 
 * @returns {Observable} fftBuffer
 */
export const deltaRange = () =>
    source => createPipe(
        source,
        map(fftBuffer => filterByBand(fftBuffer, 'delta'))
    );
