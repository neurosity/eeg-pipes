import {
  createEEG,
  addInfo,
  epoch,
  fft,
  alphaPower,
  bufferFFT,
  bufferCount,
  bufferToEpoch
} from "../src";

const eeg1$ = createEEG({
  dataType: "sine",
  sine: 7,
  samplingRate: 1024
}).pipe(bufferFFT({ bins: 1024 }));

const eeg2$ = createEEG({
  dataType: "sine",
  sine: 7,
  samplingRate: 1024
}).pipe(
  addInfo({ samplingRate: 1024 }),
  epoch({ duration: 1024, interval: 1024 }),
  fft({ bins: 1024 })
);

const eeg3$ = createEEG().pipe(
  addInfo({ samplingRate: 256 }),
  epoch({ duration: 512, interval: 100 }),
  fft({ bins: 512 })
);

const eeg4$ = createEEG({
  dataType: "sine",
  sine: 7,
  samplingRate: 256
}).pipe(
  epoch({ duration: 256, interval: 256, samplingRate: 256 }),
  fft({ bins: 256 })
);

eeg4$.subscribe(console.log);
