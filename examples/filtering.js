const { createEEG, notchFilter, epoch, bandpassFilter } = require("../");

const NaNRange = [0.29, 0.31];

const eeg1$ = createEEG({ mock: true }).pipe(notchFilter({ nbChannels: 4 }));

const eeg2$ = createEEG({ NaNRange }).pipe(notchFilter({ nbChannels: 4 }));

const eeg3$ = createEEG({ NaNRange }).pipe(
  epoch({ duration: 256, interval: 100, samplingRate: 256 }),
  bandpassFilter({
    nbChannels: 4,
    cutoffFrequencies: [2, 40],
    samplingRate: 256
  })
);

eeg3$.subscribe(console.log);
