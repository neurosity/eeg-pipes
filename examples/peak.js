
const OpenBCIObservable = require('../src/index');

const options = {
    verbose: true,
    simulate: true
};

const brainwaves$ = OpenBCIObservable(options)
    .toMicrovolts()
    .bufferCount(256) // bins
    .bufferToFFT()
    .alphaRange()
    .detectPeak(50) // voltage
    .subscribe(score =>
        console.log('peak detected', score)
    );
