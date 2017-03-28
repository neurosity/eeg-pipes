
const OpenBCIObservable = require('../src/index');

const options = {
    verbose: true,
    simulate: true
};

const brainwaves$ = OpenBCIObservable(options)
    .subscribe(sample =>
        console.log('sample', sample)
    );
