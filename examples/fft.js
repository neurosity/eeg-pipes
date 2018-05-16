const {
  createEEG,
  addInfo,
  epoch,
  fft,
  alphaPower,
  bufferFFT,
  bufferCount,
  bufferToEpoch
} = require("../");

const eeg1$ = createEEG({ sine: 7, sampleRate: 1024 }).pipe(
  bufferFFT({ bins: 1024 })
);

const eeg2$ = createEEG({ sine: 7, sampleRate: 1024 }).pipe(
  addInfo({ samplingRate: 1024 }),
  epoch({ duration: 1024, interval: 1024 }),
  fft({ bins: 1024 })
);

const eeg3$ = createEEG().pipe(
  addInfo({ samplingRate: 256 }),
  epoch({ duration: 512, interval: 100 }),
  fft({ bins: 512 })
);

const eeg4$ = createEEG({ sine: 7, sampleRate: 256 }).pipe(
  addInfo({ samplingRate: 256 }),
  epoch({ duration: 1000, interval: 256 }),
  fft({ bins: 512 })
);

eeg4$.subscribe(console.log);
