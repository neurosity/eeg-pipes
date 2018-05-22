const {
  createEEG,
  epoch,
  fft,
  sliceFFT,
  alphaPower,
  betaPower,
  deltaPower,
  thetaPower,
  averagePower,
  powerByBand
} = require("..");

const eeg1$ = createEEG({ sine: 7, samplingRate: 256 }).pipe(
  epoch({ duration: 256, interval: 100, samplingRate: 256 }),
  fft({ bins: 256 }),
  sliceFFT([6, 8])
);

const eeg2$ = createEEG({ sine: 7, samplingRate: 256 }).pipe(
  epoch({ duration: 256, interval: 100, samplingRate: 256 }),
  fft({ bins: 256 }),
  thetaPower()
);

const eeg3$ = createEEG({ sine: 7, samplingRate: 256 }).pipe(
  epoch({ duration: 256, interval: 100, samplingRate: 256 }),
  fft({ bins: 256 }),
  powerByBand({ below: [0, 6], signal: [6.9, 7.1], above: [8, 100] })
);

const eeg4$ = createEEG({ samplingRate: 256 }).pipe(
  epoch({ duration: 256, interval: 100, samplingRate: 256 }),
  fft({ bins: 256 }),
  powerByBand()
);

eeg4$.subscribe(console.log);
