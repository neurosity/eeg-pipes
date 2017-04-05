
const OpenBCIObservable = require('../src/index');

const options = {
    verbose: true,
    simulate: true
};

const brainwaves$ = OpenBCIObservable(options)
    .toMicrovolts()
    .bufferCount(256) // bins
    .bufferToFFT()
    .subscribe(fftBuffer =>
        console.log('fftBuffer', fftBuffer)
    );
