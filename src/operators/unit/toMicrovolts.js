
const { Observable } = require('rxjs/Observable');
const voltsToMicrovolts = require('../../utils/voltsToMicrovolts');

/**
 * @method toMicrovolts
 * Takes a data stream and returns the values in microvolts
 * 
 * @param {Object} options
 * @returns {Observable}
 */
module.exports = function toMicrovolts ({ log = false } = {}) {

    const transformSample = sample => {
        const channelData = voltsToMicrovolts(sample.channelData, log);
        return Object.assign({}, sample, { channelData });
    };

    const transformSampleBuffer = sampleBuffer =>
        sampleBuffer
            .map(transformSample);

    const transformChannelGroupBuffer = channelGroupBuffer =>
        channelGroupBuffer
            .map(channelGroup => 
                voltsToMicrovolts(channelGroup, log)
            );
    
    const transform = data => {
        if (Array.isArray(data) && Array.isArray(data[0])) {
            return transformChannelGroupBuffer(data);
        } else if (Array.isArray(data)) {
            return transformSampleBuffer(data);
        } else {
            return transformSample(data);
        }
    };

    return Observable.create(subscriber => {

        const source = this;

        const subscription = source.subscribe(data => {
            try {
                subscriber.next(transform(data));
            } catch(error) {
                subscriber.error(error);
            }
        },

        error => subscriber.error(error),
        () => subscriber.complete());

        return subscription;
    });
};
