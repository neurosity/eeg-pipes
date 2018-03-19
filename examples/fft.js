const { createEEG, alphaRange, bufferFFT } = require("../");

const eeg1$ = createEEG().pipe(
  bufferFFT({ bins: 256 }),
  alphaRange()
);

eeg1$.subscribe(console.log);
