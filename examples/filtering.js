const {
  createEEG,
  addInfo,
  bufferCount,
  chunk,
  notchFilter,
  bandpassFilter,
  safeNotchFilter,
  safeHighpassFilter,
  safeBandpassFilter
} = require("../");

const NaNRange = [0.29, 0.31];

// Test Samples
const eeg1$ = createEEG({ mock: true }).pipe(notchFilter({ nbChannels: 4 }));

// Test Chunks and normal notch against stream with NaNs. Will error out
const eeg2$ = createEEG({ NaNRange }).pipe(
  bufferCount(5),
  chunk(),
  notchFilter({ nbChannels: 4 })
);

// Test Chunks and safe notch against stream with NaNs. Should be fine
const eeg3$ = createEEG({ NaNRange }).pipe(
  bufferCount(5),
  chunk(),
  safeNotchFilter({ nbChannels: 4 })
);

// Test Chunks and safe notch against stream with NaNs. Should be fine
const eeg4$ = createEEG({ NaNRange }).pipe(
  bufferCount(5),
  chunk(),
  safeHighpassFilter({ nbChannels: 4, cutoffFrequency: 2, samplingRate: 1000 })
);

const eeg5$ = createEEG().pipe(safeBandpassFilter({ nbChannels: 4 }));

eeg5$.subscribe(console.log);
