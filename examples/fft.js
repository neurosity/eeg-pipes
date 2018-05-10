const {
  createEEG,
  alphaPower,
  bufferFFT,
  bufferCount,
  bufferToEpoch
} = require("../");

const eeg1$ = createEEG({ sine: 7, sampleRate: 1000 }).pipe(
  bufferFFT({ bins: 1024 })
);

eeg1$.subscribe(console.log);
