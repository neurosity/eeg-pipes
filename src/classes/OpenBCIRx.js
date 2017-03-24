
const OpenBCI = require('openbci');
const OpenBCIBoard = OpenBCI.OpenBCIBoard;
const { OBCISimulatorPortName } = OpenBCI.OpenBCIConstants;
const OpenBCIObservable = require('./OpenBCIObservable');

module.exports = class OpenBCIRx extends OpenBCIBoard {
    
    constructor (options) {
        super(options); 
        this.start();
    }

    start () { 
        return new Promise((resolve, reject) => {
            
            const onConnect = () => 
                this.on('ready', () => {
                    this.streamStart();
                    resolve();
                });

            const onError = error => 
                reject(error);
            
            this.autoFindOpenBCIBoard()
                .then(portName => {
                    if (portName) {
                        this.connect(portName)
                            .then(onConnect);
                    } else {
                        onError('No port was found.');
                    }
                })
                .catch(error => {
                    console.log(error);
                    this.connect(OBCISimulatorPortName)
                        .then(onConnect)
                        .catch(onError);
                });
         });
    }

    toObservable () {
        return OpenBCIObservable
            .create(subscriber => {
                const streamSample = sample =>
                    subscriber.next(sample);

                this.on('sample', streamSample);
            });
    }
}
