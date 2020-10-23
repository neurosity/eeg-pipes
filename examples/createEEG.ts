import { createEEG } from "../src";

// defaults to muse-lsl.csv
const eeg$ = createEEG();

// with custom csv file, can load file via webpack loader
const withCustomCsv$ = createEEG({
  csv: [] // insert your parsed csv content here
});

// with randomly generated data
const mock$ = createEEG({
  mock: true
});

// with NaN range injection
const mockNaN$ = createEEG({
  mock: true,
  NaNRange: [0.29, 0.31]
});

const sine$ = createEEG({ sine: 1 });

sine$.subscribe(console.log);
