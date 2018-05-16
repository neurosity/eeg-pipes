import { map } from "rxjs/operators";

import { createPipe } from "../../utils/createPipe";
import { average } from "../../utils";

/**
 * Takes a stream of PSDs and returns a sream of arrays, containing the average power in each channel
 * @method averagePower
 * @example eeg$.pipe(epoch({ duration: 256, interval: 100, samplingRate: 256 }), fft({ bins: 256 }), sliceFFT(10, 20), averagePower())
 * @returns {Observable} band powers array
 */
export const averagePower = () => source =>
  createPipe(
    source,
    map(inputPSD =>
      inputPSD.psd.reduce((acc, channel) => [...acc, average(channel)], [])
    )
  );
