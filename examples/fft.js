const { createEEG, alphaPower, bufferFFT } = require("../");

const eeg1$ = createEEG().pipe(
  bufferFFT({ bins: 256 }),
  alphaPower()
);

eeg1$.subscribe(console.log);
