
const BrainObservable = require('../src/index').Cyton;

const options = {
    verbose: true,
    simulate: true
};

const subject = {
    firstName: 'Hans',
    lastName: 'Berger',
    email: 'hans@berger.eeg'
};

const brainwaves$ = BrainObservable(options)
    .metadata(subject)
    .subscribe(sample =>
        console.log('sample', sample)
    );
