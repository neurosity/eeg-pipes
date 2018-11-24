import { createEEG, notchFilter, epoch, bandpassFilter } from "../src";

const eeg1$ = createEEG({ mock: true }).pipe(
  notchFilter({ nbChannels: 4 })
);

const eeg2$ = createEEG({ NaNRange: [0.29, 0.31] }).pipe(
  notchFilter({ nbChannels: 4 })
);

const eeg3$ = createEEG({ NaNRange: [0.29, 0.31] }).pipe(
  epoch({ duration: 256, interval: 100, samplingRate: 256 }),
  bandpassFilter({
    nbChannels: 4,
    cutoffFrequencies: [2, 40],
    samplingRate: 256
  })
);

eeg3$.subscribe(console.log);
