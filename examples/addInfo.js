const { createEEG, addInfo } = require("../");

const eeg1$ = createEEG().pipe(addInfo({ samplingRate: 250 }));

const eeg2$ = createEEG().pipe(
  addInfo({
    channels: ["FP1", "FP2", "OZ"]
  }),
  addInfo(sample => ({
    channels: sample.info.channels.map((channel, index) => ({
      [index]: channel
    }))
  }))
);

eeg2$.subscribe(console.log);
