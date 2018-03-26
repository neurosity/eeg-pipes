const { createEEG, alphaPower, bufferFFT } = require("../");

const eeg1$ = createEEG().pipe(bufferFFT({ bins: 256 }), alphaPower());

const eeg2$ = createMockNaNStream().pipe(
  bufferCount(1000),
  chunk(),
  chunkFFT({ nbChannels: 4, sampleRate: 1000 })
);

eeg2$.subscribe(console.log);
