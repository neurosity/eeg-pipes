import { createEEG, bufferFFT, powerByBand } from "../src";

const eeg$ = createEEG().pipe(
  bufferFFT({ bins: 256 }),
  powerByBand()
);

eeg$.subscribe(console.log);
