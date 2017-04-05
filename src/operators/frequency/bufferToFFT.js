
const { Observable } = require('rxjs/Observable');
const { FFT } = require('dsp.js');
const groupByChannel = require('../../utils/groupByChannel');

/**
 * @method bufferToFFT
 * Takes a buffer of samples and returns an FFT buffer
 * 
 * @param {Object} options
 * @returns {Observable}
 */
module.exports = function bufferToFFT ({
    sampleRate = 250
} = {}) {

    const toFFT = samplesBuffer => {

        const fft = channelGroup => {
            const bins = channelGroup.length;
            const fft = new FFT(bins, sampleRate);
            fft.forward(channelGroup);
            return fft.spectrum;
        };

        const fftBuffer = groupByChannel(samplesBuffer)
            .map(fft);

        return fftBuffer;
    };

    return Observable.create(subscriber => {

        const source = this;

        const subscription = source.subscribe(samplesBuffer => {
            try {
                subscriber.next(toFFT(samplesBuffer));
            } catch(error) {
                subscriber.error(error);
            }
        },

        error => subscriber.error(error),
        () => subscriber.complete());

        return subscription;
    });
};
