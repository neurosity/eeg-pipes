
const { Observable } = require('rxjs/Observable');
const filterByBand = require('../../utils/filterByBand');

/**
 * @method alphaRange
 * Filters FFT buffer based on alpha frequency range
 * 
 * @returns {Observable} fftBuffer
 */
module.exports = function alphaRange () {
    
    return Observable.create(subscriber => {

        const source = this;

        const subscription = source.subscribe(fftBuffer => {
            try {
                subscriber.next(filterByBand(fftBuffer, 'alpha'));
            } catch(error) {
                subscriber.error(error);
            }
        },

        error => subscriber.error(error),
        () => subscriber.complete());

        return subscription;
    });
};
