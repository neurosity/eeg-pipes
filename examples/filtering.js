const {
  createMockStream,
  createMockNaNStream,
  addInfo,
  bufferCount,
  chunk,
  notchFilter,
  bandpassFilter,
  safeNotchFilter,
  safeHighpassFilter,
  safeBandpassFilter
} = require("../");
const createEEGStream = require("./datasets/createEEGStream");

// Test Samples
const eeg1$ = createMockStream().pipe(notchFilter({ nbChannels: 4 }));

// Test Chunks and normal notch against stream with NaNs. Will error out
const eeg2$ = createMockNaNStream().pipe(
  bufferCount(5),
  chunk(),
  notchFilter({ nbChannels: 4 })
);

// Test Chunks and safe notch against stream with NaNs. Should be fine
const eeg3$ = createMockNaNStream().pipe(
  bufferCount(5),
  chunk(),
  safeNotchFilter({ nbChannels: 4, order: 2 })
);

// Test Chunks and safe notch against stream with NaNs. Should be fine
const eeg4$ = createMockNaNStream().pipe(
  bufferCount(5),
  chunk(),
  safeHighpassFilter({ nbChannels: 4, cutoffFrequency: 2, samplingRate: 1000 })
);

const eeg5$ = createEEGStream().pipe(safeBandpassFilter({ nbChannels: 4 }));

const eeg6$ = createEEGStream().pipe(safeNotchFilter({ nbChannels: 4, order: 3 })); 

eeg6$.subscribe(console.log);
