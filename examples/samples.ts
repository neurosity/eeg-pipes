import { createEEG, addInfo, epoch, samples } from "../src";
import { take } from "rxjs/operators";

const epoch$ = createEEG().pipe(
  addInfo({ samplingRate: 256 }),
  epoch({ duration: 4, interval: 256 })
);

const samples$ = epoch$.pipe(samples());

epoch$.pipe(take(1)).subscribe(console.log);

samples$.pipe(take(4)).subscribe(console.log);
