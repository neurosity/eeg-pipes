const { createMockStream, alphaRange, bufferFFT } = require("../");

const eeg1$ = createMockStream().pipe(
  bufferFFT({bins: 256}),
  alphaRange()
);

eeg1$.subscribe(console.log);
