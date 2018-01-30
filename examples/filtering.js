const { createMockStream, addInfo, bufferCount, chunk, notchFilter } = require("../");

// Test Samples
const eeg1$ = createMockStream().pipe(notchFilter({ nbChannels: 4 }));

// Test Chunks
const eeg2$ = createMockStream().pipe(
  bufferCount(5),
  chunk(),
  notchFilter({ nbChannels: 4 })
);

eeg2$.subscribe(console.log);
