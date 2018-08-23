const { createEEG, epoch, addInfo, addSignalQuality } = require("..");

// Without  channel names
const eeg1$ = createEEG().pipe(
  epoch({ duration: 256, interval: 256 }),
  addSignalQuality()
);

// With channel names
const eeg2$ = createEEG().pipe(
  epoch({ duration: 256, interval: 256 }),
  addInfo({ channelNames: ["TP9", "AF7", "AF8", "TP10"] }),
  addSignalQuality()
);

eeg2$.subscribe(console.log);
