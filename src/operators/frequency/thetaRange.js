
const { Observable } = require('rxjs/Observable');
const filterByBand = require('../../utils/filterByBand');

/**
 * @method thetaRange
 * Filters FFT buffer based on theta frequency range
 * 
 * @returns {Observable} fftBuffer
 */
module.exports = function thetaRange () {
    
    return Observable.create(subscriber => {

        const source = this;

        const subscription = source.subscribe(fftBuffer => {
            try {
                subscriber.next(filterByBand(fftBuffer, 'theta'));
            } catch(error) {
                subscriber.error(error);
            }
        },

        error => subscriber.error(error),
        () => subscriber.complete());

        return subscription;
    });
};
