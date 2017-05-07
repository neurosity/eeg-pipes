
const slayer = require('slayer');
const { Observable } = require('rxjs/Observable');

/**
 * @method detectPeak
 * Detects peak
 * 
 * @param {Number} frequency
 * @returns {Observable} buffer
 */
module.exports = function detectPeak (config = {
    minPeakDistance: 30,
    minPeakHeight: 0
}) {

    const average = buffer =>
        buffer.reduce((a, b) => a + b) / buffer.length;

    const getSpikes = async (buffer) => {
        const channels = buffer.map(
            channel => slayer(config).fromArray(channel)
        );

        return await Promise.all(channels)
    };

    return Observable.create(subscriber => {

        const source = this;

        const subscription = source.subscribe(buffer => {
            try {
                getSpikes(buffer)
                    .then(channels => {
                        const peaks = channels
                            .map(channel => channel[0].x)
                        subscriber.next(average(peaks));
                    });
            } catch(error) {
                subscriber.error(error);
            }
        },

        error => subscriber.error(error),
        () => subscriber.complete());

        return subscription;
    });
};
