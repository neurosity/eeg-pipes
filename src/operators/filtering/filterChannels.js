
const { Observable } = require('rxjs/Observable');

/**
 * @method filterChannels
 * Filters out channel based on channel number
 * 
 * @param {Number} channelNumber
 * @returns {Observable} sample
 */
module.exports = function filterChannels (...channelNumbers) {

    const filter = sample => {

        const channelData = sample.channelData
            .filter((channel, index) => 
                !channelNumbers.includes(index + 1)
            );

        return Object.assign({}, sample, {
            channelData
        });
    };

    return Observable.create(subscriber => {

        const source = this;

        const subscription = source.subscribe(sample => {
            try {
                subscriber.next(filter(sample));
            } catch(error) {
                subscriber.error(error);
            }
        },

        error => subscriber.error(error),
        () => subscriber.complete());

        return subscription;
    });
};
