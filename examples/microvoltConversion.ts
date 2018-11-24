import { createEEG, epoch, addInfo, voltsToMicrovolts } from "../src";

const eeg1$ = createEEG().pipe(voltsToMicrovolts());

const eeg2$ = createEEG().pipe(voltsToMicrovolts({ useLog: true }));

const eeg3$ = createEEG().pipe(
  addInfo({ samplingRate: 256 }),
  epoch({ duration: 256, interval: 100 }),
  voltsToMicrovolts()
);

eeg3$.subscribe(console.log);
