
const BrainObservable = require('../src/index').Cyton;

const options = {
    verbose: true,
    simulate: true
};

const brainwaves$ = BrainObservable(options)
    .toMicrovolts()
    .bufferCount(256) // bins
    .bufferToFFT()
    .subscribe(fftBuffer =>
        console.log('fftBuffer', fftBuffer)
    );
