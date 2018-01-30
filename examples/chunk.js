const { createMockStream, addInfo, bufferCount, chunk } = require("../");

const eeg1$ = createMockStream().pipe(
  addInfo({ samplingRate: 250 }),
  bufferCount(5),
  chunk()
);

eeg1$.subscribe(console.log);
