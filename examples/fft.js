
const OpenBCIObservable = require('../src/index');

const options = {
    verbose: true,
    simulate: true
};

const brainwaves$ = OpenBCIObservable(options)
    .bufferCount(128)
    .bufferToFFT()
    .toMicrovolts()
    .subscribe(fftBuffer =>
        console.log('fftBuffer', fftBuffer)
    );
