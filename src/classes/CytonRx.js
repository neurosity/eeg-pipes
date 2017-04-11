
const { OpenBCIBoard, OpenBCIConstants } = require('openbci');
const { OBCISimulatorPortName } = OpenBCIConstants;
const BCIObservable = require('./BCIObservable');

module.exports = class CytonRx extends OpenBCIBoard {
    
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
        return BCIObservable
            .create(subscriber => {
                const streamSample = sample =>
                    subscriber.next(sample);

                this.on('sample', streamSample);
            });
    }
}
