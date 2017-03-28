
const OpenBCIObservable = require('../src/index');

const options = {
    verbose: true,
    simulate: true
};

const brainwaves$ = OpenBCIObservable(options)
    .bufferCount(128)
    .bufferToFFT()
    .toMicrovolts()
    .notchFilter({ cutoffFrequency: 50 })
    .subscribe(fftBuffer =>
        console.log('fftBuffer with notch filter', fftBuffer)
    );
