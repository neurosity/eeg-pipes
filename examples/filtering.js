const {
  createMockStream,
  addInfo,
  bufferCount,
  chunk,
  notchFilter,
  safeNotchFilter,
  safeBandpassFilter
} = require("../");

// Test Samples
const eeg1$ = createMockStream().pipe(notchFilter({ nbChannels: 4 }));

// Test Chunks
const eeg2$ = createMockStream().pipe(
  bufferCount(5),
  chunk(),
  notchFilter({ nbChannels: 4 })
);

// Test NaNStream
const eeg3$ = createMockStream().pipe(
  bufferCount(5),
  chunk(),
  notchFilter({ nbChannels: 4 })
);

// Test NaNStream
const eeg4$ = createMockStream().pipe(
  bufferCount(5),
  chunk(),
  safeBandpassFilter({ nbChannels: 4 })
);

eeg4$.subscribe(console.log);
