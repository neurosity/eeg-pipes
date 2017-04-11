
const BrainObservable = require('../src/index');

const options = {
    verbose: true,
    simulate: true
};

const brainwaves$ = BrainObservable(options)
    .subscribe(sample =>
        console.log('sample', sample)
    );
