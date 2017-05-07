
const { Observable } = require('rxjs/Observable');

/**
 * @method metadata
 * Annotates stream with metadata.
 * @example { name, email }
 * 
 * @param data
 * @returns {Observable} sample
 */
module.exports = function metadata (data = {}) {

    const annotate = sample => {
        if (sample instanceof Object) {
            const _timestamp = Date.now();
            const metadata = Object.assign({}, data, { _timestamp });
            return Object.assign({}, sample, { metadata });
        }
        return sample;
    };
    
    return Observable.create(subscriber => {

        const source = this;

        const subscription = source.subscribe(sample => {
            try {
                subscriber.next(annotate(sample));
            } catch(error) {
                subscriber.error(error);
            }
        },

        error => subscriber.error(error),
        () => subscriber.complete());

        return subscription;
    });
};
