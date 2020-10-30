import { pipe } from "rxjs";
import { map } from "rxjs/operators";

import { sum } from "../../utils/stats";
import { IPSD } from "../../types/psd";

/**
 * Takes a stream of PSDs and returns a stream of arrays, containing the absolute power in each channel
 * @method absolutePower
 * @example eeg$.pipe(epoch({ duration: 256, interval: 100, samplingRate: 256 }), fft({ bins: 256 }), sliceFFT(10, 20), absolutePower())
 * @returns {Observable} band powers array
 */
export const absolutePower = () =>
  pipe(
    map((inputPSD: IPSD) =>
      inputPSD.psd.reduce(
        (acc, channel) => [...acc, sum(channel)],
        []
      )
    )
  );
