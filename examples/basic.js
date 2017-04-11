
const BrainObservable = require('../src/index').Cyton;

const options = {
    verbose: true,
    simulate: true
};

const brainwaves$ = BrainObservable(options)
    .subscribe(sample =>
        console.log('sample', sample)
    );
