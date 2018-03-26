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

const eeg2$ = createMockNaNStream().pipe(bufferCount(1000), chunk(), chunkFFT({ nbChannels: 4, sampleRate: 1000 }));

eeg2$.subscribe(console.log);
