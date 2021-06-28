import { createEEG, addInfo, epoch, concatEpochs } from "../src";

const epoch$ = createEEG().pipe(
  addInfo({ samplingRate: 256 }),
  epoch({ duration: 4, interval: 256 }),
  concatEpochs()
);

epoch$.subscribe(console.log);
