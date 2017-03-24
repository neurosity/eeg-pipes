
const { Observable } = require('rxjs/Observable');
const filterByBand = require('../../utils/filterByBand');

/**
 * @method betaRange
 * Filters FFT buffer based on beta frequency range
 * 
 * @returns {Observable} fftBuffer
 */
module.exports = function betaRange () {
    
    return Observable.create(subscriber => {

        const source = this;

        const subscription = source.subscribe(fftBuffer => {
            try {
                subscriber.next(filterByBand(fftBuffer, 'beta'));
            } catch(error) {
                subscriber.error(error);
            }
        },

        error => subscriber.error(error),
        () => subscriber.complete());

        return subscription;
    });
};
