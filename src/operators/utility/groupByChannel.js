
const { Observable } = require('rxjs/Observable');
const isBuffer = require('../../utils/isBuffer');
const groupChannels = require('../../utils/groupByChannel');

/**
 * @method groupByChannel
 * Takes a samples buffer and returns a buffer of channel groups
 * 
 * @returns {Observable} samplesBuffer
 */
module.exports = function groupByChannel () {
    
    return Observable.create(subscriber => {

        const source = this;

        const subscription = source.subscribe(samplesBuffer => {
            try {
                subscriber.next(groupChannels(samplesBuffer));
            } catch(error) {
                subscriber.error(error);
            }
        },

        error => subscriber.error(error),
        () => subscriber.complete());

        return subscription;
    });
};
