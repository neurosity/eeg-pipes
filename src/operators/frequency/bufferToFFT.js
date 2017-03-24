
const { Observable } = require('rxjs/Observable');
const Fili = require('fili');
const groupByChannel = require('../../utils/groupByChannel');
const isBuffer = require('../../utils/isBuffer');

/**
 * @method bufferToFFT
 * Takes a buffer of samples and returns an FFT buffer
 * 
 * @param {Object} options
 * @returns {Observable}
 */
module.exports = function bufferToFFT ({ 
    windowFunction = 'none' 
} = {}) {

    const toFFT = samplesBuffer => {

        const fft = channelGroup => {
            const fft = new Fili.Fft(channelGroup.length);
            const fftResult = fft.forward(channelGroup, windowFunction);
            const fftMagnitude = fft.magnitude(fftResult);
            return fftMagnitude;
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
