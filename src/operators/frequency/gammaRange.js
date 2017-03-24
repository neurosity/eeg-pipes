
const { Observable } = require('rxjs/Observable');
const filterByBand = require('../../utils/filterByBand');

/**
 * @method gammaRange
 * Filters FFT buffer based on gamma frequency range
 * 
 * @returns {Observable} fftBuffer
 */
module.exports = function gammaRange () {
    
    return Observable.create(subscriber => {

        const source = this;

        const subscription = source.subscribe(fftBuffer => {
            try {
                subscriber.next(filterByBand(fftBuffer, 'gamma'));
            } catch(error) {
                subscriber.error(error);
            }
        },

        error => subscriber.error(error),
        () => subscriber.complete());

        return subscription;
    });
};
