import { pipe, from } from "rxjs";
import { flatMap } from "rxjs/operators";

import { transpose } from "../../utils/transpose";
import { ISample } from "../../types/sample";

/**
 * Converts epochs into a stream of individual Samples. This basically undo the `epoch` pipe.
 * @method samples
 * @example epochs$.pipe(samples())
 * @returns {Observable} Sample
 */
export const samples = () =>
  pipe(
    flatMap((epoch: any) => {
      const { info } = epoch;
      const data: number[][] = epoch.data;

      const samplesByIndex = transpose(data);

      let samples: ISample[] = [];

      for (let [sampleIndex, data] of samplesByIndex.entries()) {
        const sampleOffset = sampleIndex * (1000 / info.samplingRate);
        const timestamp = info.startTime + sampleOffset;
        const sample: ISample = {
          data,
          timestamp
        };

        samples.push(sample);
      }

      return from(samples);
    })
  );
