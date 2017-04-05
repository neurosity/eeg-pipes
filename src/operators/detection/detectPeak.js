
const { Observable } = require('rxjs/Observable');

/**
 * @method detectPeak
 * Detects peak
 * 
 * @param {Number} frequency
 * @returns {Observable} buffer
 */
module.exports = function detectPeak (voltage) {

    const detect = buffer => {
        return buffer
            .map(channel => {
                const average = channel.reduce((a, b) => a + b) / channel.length;
                return average * 100 / voltage;
            });
    };

    return Observable.create(subscriber => {

        const source = this;

        const subscription = source.subscribe(buffer => {
            try {
                subscriber.next(detect(buffer));
            } catch(error) {
                subscriber.error(error);
            }
        },

        error => subscriber.error(error),
        () => subscriber.complete());

        return subscription;
    });
};
