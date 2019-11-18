import {
  createEEG,
  epoch,
  means,
  standardDeviations,
  differences,
  absolutes,
  center
} from "../src";
import { zip } from "rxjs";

const epochs$ = createEEG().pipe(
  epoch({ duration: 512, interval: 256 })
);

const means$ = epochs$.pipe(means());
const stds$ = epochs$.pipe(standardDeviations());

const epochsStandardized$ = zip(
  stds$,
  epochs$.pipe(center(0)),
  (stds, epoch) => ({
    ...epoch,
    data: epoch.data.map((channel: number[], channelIndex: number) => {
      return channel.map(value => value / stds[channelIndex]);
    })
  })
);

const mean_abs_1st_diff_raw$ = epochs$.pipe(
  differences(1),
  absolutes(),
  means()
);

const mean_abs_2nd_diff_raw$ = epochs$.pipe(
  differences(2),
  absolutes(),
  means()
);

const mean_abs_1st_diff_standardized$ = epochsStandardized$.pipe(
  differences(1),
  absolutes(),
  means()
);

const mean_abs_2nd_diff_standardized$ = epochsStandardized$.pipe(
  differences(2),
  absolutes(),
  means()
);

const features = zip(
  means$,
  stds$,
  mean_abs_1st_diff_raw$,
  mean_abs_2nd_diff_raw$,
  mean_abs_1st_diff_standardized$,
  mean_abs_2nd_diff_standardized$,
  (...vectors: any) => vectors.flat()
);

features.subscribe(feature_vector => {
  console.log(feature_vector);
});
