const { createEEG, addInfo, bufferCount, chunk } = require("..");

const eeg$ = createEEG().pipe(
  addInfo({ samplingRate: 250 }),
  bufferCount(5),
  chunk()
);

eeg$.subscribe(console.log);
