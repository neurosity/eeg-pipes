const { createEEG, epoch, addSignalQuality } = require("..");
const { tap, map } = require("rxjs/operators");

const eeg1$ = createEEG().pipe(
  epoch({ duration: 256, interval: 256 }),
  addSignalQuality()
);

eeg1$.subscribe(console.log);
