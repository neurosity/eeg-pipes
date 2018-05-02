const { createEEG, addInfo, epoch } = require("..");

const eeg$ = createEEG().pipe(
  addInfo({ samplingRate: 256 }),
  epoch({ duration: 512, interval: 256 })
);

eeg$.subscribe(console.log);
