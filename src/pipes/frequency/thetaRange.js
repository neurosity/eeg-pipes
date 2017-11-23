
import { map } from 'rxjs/operators';

import { createPipe } from '../../utils/createPipe';
import { filterByBand } from '../../utils/filterByBand';

/**
 * @method thetaRange
 * Filters FFT buffer based on theta frequency range
 * 
 * @returns {Observable} fftBuffer
 */
export const thetaRange = () =>
    source => createPipe(
        source,
        map(fftBuffer => filterByBand(fftBuffer, 'theta'))
    );
