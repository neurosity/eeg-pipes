const {
  createEEG,
  alphaPower,
  bufferFFT,
  bufferCount,
  chunk,
  chunkFFT,
  newFFT,
  newChunkFFT
} = require("../");

const eeg1$ = createEEG({ sine: 7, sampleRate: 1000 }).pipe(bufferFFT({ bins: 1024 }));

const eeg2$ = createEEG().pipe(
  bufferCount(512),
  chunk({ samplingRate: 1000 }),
  newChunkFFT({ bins: 500 })
);

eeg1$.subscribe(console.log);
