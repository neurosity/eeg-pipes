
const { Ganglion } = require('openbci-ganglion');
const BCIObservable = require('./BCIObservable');

module.exports = class GanglionRx extends Ganglion {

    constructor (options) {
        super(options); 
        this.start();
    }

    start () {
        this.searchStart();

        this.once('ganglionFound', (peripheral) => {
            this.searchStop();
            this.stream(peripheral);
        });
    }

    stream (peripheral) {
        this.connect(peripheral);
        this.once('ready', () => {
            this.streamStart();
        });
    }

    toObservable () {
        return BCIObservable
            .create(subscriber => {
                const streamSample = sample =>
                    subscriber.next(sample);

                this.on('sample', streamSample);
            });
    }
}
