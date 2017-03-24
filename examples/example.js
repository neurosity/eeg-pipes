
const OpenBCIObservable = require('../src/index');

const options = {
    verbose: true,
    simulate: true
};

const brainwaves$ = OpenBCIObservable(options)
    .pickChannels(7, 8)
    .bufferCount(128)
    .bufferToFFT()
    .toMicrovolts()
    .subscribe(buffer =>
        console.log('buffer', buffer)
    );
