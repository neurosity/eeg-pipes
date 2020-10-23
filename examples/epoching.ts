import { createEEG, addInfo, epoch } from "../src";

const eeg1$ = createEEG().pipe(
  addInfo({ samplingRate: 256 }),
  epoch({ duration: 512, interval: 256 })
);

const eeg2$ = createEEG({ NaNRange: [0, 3] }).pipe(
  addInfo({ samplingRate: 250 }),
  epoch({ duration: 256, interval: 250 })
);

const eeg3$ = createEEG({ samplingRate: 1000 }).pipe(
  epoch({ duration: 1024, interval: 100, samplingRate: 256 })
);

// Should leave info.samplingRate = 128 intact
const eeg4$ = createEEG({ samplingRate: 128 }).pipe(
  addInfo({ samplingRate: 128 }),
  epoch({ duration: 256, interval: 250 })
);

eeg2$.subscribe(console.log);
