
const { Observable } = require('rxjs/Observable');
const filterByBand = require('../../utils/filterByBand');

/**
 * @method deltaRange
 * Filters FFT buffer based on delta frequency range
 * 
 * @returns {Observable} fftBuffer
 */
module.exports = function deltaRange () {
    
    return Observable.create(subscriber => {

        const source = this;

        const subscription = source.subscribe(fftBuffer => {
            try {
                subscriber.next(filterByBand(fftBuffer, 'delta'));
            } catch(error) {
                subscriber.error(error);
            }
        },

        error => subscriber.error(error),
        () => subscriber.complete());

        return subscription;
    });
};
