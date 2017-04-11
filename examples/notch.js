
const BrainObservable = require('../src/index').Cyton;

const options = {
    verbose: true,
    simulate: true
};

const brainwaves$ = BrainObservable(options)
    .bufferCount(128)
    .bufferToFFT()
    .toMicrovolts()
    .notchFilter({ cutoffFrequency: 50 })
    .subscribe(fftBuffer =>
        console.log('fftBuffer with notch filter', fftBuffer)
    );
