
import { FFT } from 'dsp.js';
import { bufferCount, map } from 'rxjs/operators';

import { createPipe } from '../../utils/createPipe';
import { groupByChannel } from '../../utils/groupByChannel';

import {
    SAMPLE_RATE as defaultSampleRate,
    FFT_BINS as defaultFftBins,
    DATA_PROP as defaultDataProp
} from '../../constants';

/**
 * @method bufferFFT
 * Takes a samples and returns an FFT buffer
 * 
 * @param {Object} options
 * @returns {Observable}
 */
export const bufferFFT = ({
    bins = defaultFftBins,
    window = null,
    sampleRate = defaultSampleRate,
    dataProp = defaultDataProp
} = {}) =>
    source => createPipe(
        source,
        bufferCount(bins, window),
        map(samplesBuffer => {

            const fft = channelGroup => {
                const bins = channelGroup.length;
                const fft = new FFT(bins, sampleRate);
                fft.forward(channelGroup);
                return Array.from(fft.spectrum);
            };

            const fftBuffer = groupByChannel(samplesBuffer, dataProp)
                .map(fft);

            return fftBuffer;
        })
    );
    