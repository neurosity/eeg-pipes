<<<<<<< HEAD
const {
  createMockStream,
  createMockNaNStream,
  alphaRange,
  bufferFFT,
  bufferCount,
  chunk,
  chunkFFT
} = require("../");

const eeg1$ = createMockStream().pipe(bufferFFT({ bins: 256 }), alphaRange());
=======
const { createEEG, alphaPower, bufferFFT } = require("../");

const eeg1$ = createEEG().pipe(
  bufferFFT({ bins: 256 }),
  alphaPower()
);
>>>>>>> 85a0052fffd1c3822a9ebffc0edd8d2d16ed50b9

const eeg2$ = createMockNaNStream().pipe(bufferCount(1000), chunk(), chunkFFT({ nbChannels: 4, sampleRate: 1000 }));

eeg2$.subscribe(console.log);
