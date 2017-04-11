
const { Observable } = require('rxjs/Observable');

/**
 * @method detectPeak
 * Detects peak
 * 
 * @param {Number} frequency
 * @returns {Observable} buffer
 */
module.exports = function detectPeak (threshhold) {

    const average = list =>
        list.reduce((a, b) => a + b) / list.length;

    const detect = buffer => {
        return average(
            buffer.map(channel =>
                average(channel) * 100 / threshhold)
        );
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
