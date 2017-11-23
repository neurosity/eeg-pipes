
import { CalcCascades, IirFilter } from 'fili';
import { map } from 'rxjs/operators';

import { createPipe } from '../../utils/createPipe';

import {
    SAMPLE_RATE as defaultSampleRate
} from '../../constants';

/**
 * @method notchFilter
 * Applies notch filter to FFT buffer
 * 
 * @param {Object} options
 * @returns {Observable}
 */
export const notchFilter = ({
    order = 2,
    characteristic = 'butterworth',
    cutoffFrequency = 50,
    sampleRate = defaultSampleRate,
    Fs = sampleRate,
    Fc = cutoffFrequency,
    gain = 0, 
    preGain = false
} = {}) =>
    source => createPipe(
        source,
        map(channelGroupBuffer => {

            const notch = channelGroup => {
                const options = { order, characteristic, Fs, Fc, gain, preGain };
                const calc = new CalcCascades();
                const coeffs = calc.bandstop(options);
                const filter = new IirFilter(coeffs);
                
                return filter.multiStep(channelGroup);
            };

            return channelGroupBuffer.map(notch);
        })
    );
