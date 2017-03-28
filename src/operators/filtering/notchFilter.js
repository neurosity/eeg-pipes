
const { Observable } = require('rxjs/Observable');
const Fili = require('fili');

/**
 * @method notchFilter
 * Applies notch filter to FFT buffer
 * 
 * @param {Object} options
 * @returns {Observable}
 */
module.exports = function notchFilter ({
    order = 2,
    characteristic = 'butterworth',
    cutoffFrequency = 50,
    sampleRate = 250,
    Fs = sampleRate,
    Fc = cutoffFrequency,
    gain = 0, 
    preGain = false
}) {

    const notch = channelGroup => {
        const options = { order, characteristic, Fs, Fc, gain, preGain };
        const calc = new Fili.CalcCascades();
        const coeffs = calc.bandstop(options);
        const filter = new Fili.IirFilter(coeffs);
        
        return filter.multiStep(channelGroup);
    };

    const transform = channelGroupBuffer => 
        channelGroupBuffer.map(notch);

    return Observable.create(subscriber => {

        const source = this;

        const subscription = source.subscribe(channelGroupBuffer => {
            try {
                subscriber.next(transform(channelGroupBuffer));
            } catch(error) {
                subscriber.error(error);
            }
        },

        error => subscriber.error(error),
        () => subscriber.complete());

        return subscription;
    });
};
