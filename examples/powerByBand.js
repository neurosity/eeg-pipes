const { createEEG, bufferFFT, powerByBand } = require("..");

const eeg$ = createEEG().pipe(
  bufferFFT({ bins: 256 }),
  powerByBand()
);

eeg$.subscribe(console.log);
