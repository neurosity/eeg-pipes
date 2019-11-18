import { createEEG, epoch, means, standardDeviations } from "../src";
import { zip } from "rxjs";

const epochs$ = createEEG().pipe(
  epoch({ duration: 512, interval: 256 })
);

const means$ = epochs$.pipe(means());
const stds$ = epochs$.pipe(standardDeviations());

const features = zip(means$, stds$, (...vectors: any) =>
  vectors.flat()
);

features.subscribe(feature_vector => {
  console.log(feature_vector);
});
