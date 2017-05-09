
const { Observable } = require('rxjs/Observable');

/**
 * @method detectPeak
 * Detects peak
 * 
 * @param {Number} config
 * @returns {Observable} peak
 */
module.exports = function detectPeak (config = {
    min: 0,
    max: 100,
    adjustBy: 1
}) {

    const { min, max, adjustBy } = config;

    this.previousPeak = min;
    this.previousAverage = null;

    const average = buffer =>
        buffer.reduce((a, b) => a + b) / buffer.length;

    const getPeak = buffer => {
        const currentAverage = average(buffer.map(average));
        let currentPeak;
        this.previousAverage = this.previousAverage ? this.previousAverage : currentAverage;
        if (currentAverage > this.previousAverage && this.previousPeak !== max) {
            currentPeak = this.previousPeak + adjustBy;
        } else if (currentAverage < this.previousAverage && this.previousPeak !== min) {
            currentPeak = this.previousPeak - adjustBy;
        } else {
            currentPeak = this.previousPeak;
        }
        this.previousPeak = currentPeak;
        return currentPeak;
    };

    return Observable.create(subscriber => {

        const source = this;

        const subscription = source.subscribe(buffer => {
            try {
                subscriber.next(getPeak(buffer));
            } catch(error) {
                subscriber.error(error);
            }
        },

        error => subscriber.error(error),
        () => subscriber.complete());

        return subscription;
    });
};
