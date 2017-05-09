
const BrainObservable = require('../src/index').Cyton;

const bins = 512;
const FFTBufferSize = bins / 2;
const windowOverlap = 12;

const options = {
    verbose: true,
    simulate: false,
    simulatorInjectAlpha: true
};

const brainwaves$ = BrainObservable(options)
    .pickChannels(1, 2)
    .toMicrovolts()
    .bufferCount(bins, windowOverlap)
    .bufferToFFT()
    .alphaRange()
    .detectPeak()
    .subscribe(peak =>
        console.log('peak detected', peak)
    );
