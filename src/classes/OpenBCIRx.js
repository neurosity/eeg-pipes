
const OpenBCI = require('openbci');
const OpenBCIBoard = OpenBCI.OpenBCIBoard;
const { OBCISimulatorPortName } = OpenBCI.OpenBCIConstants;
const OpenBCIObservable = require('./OpenBCIObservable');

module.exports = class OpenBCIRx extends OpenBCIBoard {
    
    constructor (options) {
        super(options); 
        this.start();
    }

    async start () {
        try {
            const portName = await this.autoFindOpenBCIBoard();
            await this.stream(portName);
        } catch (error) {
            await this.stream(OBCISimulatorPortName);
        }
    }

    async stream (portName) {
        await this.connect(portName);
        this.on('ready', async () => {
            await this.streamStart();
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
