import { CalcCascades, IirFilter } from "fili";
import { map } from "rxjs/operators";

import { createPipe } from "../../utils/createPipe";

import { SAMPLE_RATE as defaultSampleRate } from "../../constants";

/**
 * @method highPassFilter
 * Applies a high pass filter to an EEG buffer
 *
 * @param {Object} options
 * @returns {Observable}
 */
export const highPassFilter = (
  {
    order = 2,
    characteristic = "butterworth",
    cutoffFrequency = 100,
    sampleRate = defaultSampleRate,
    Fs = sampleRate,
    Fc = cutoffFrequency,
    gain = 0,
    preGain = false
  } = {}
) => source =>
  createPipe(
    source,
    map(channelGroupBuffer => {
      const highPass = channelGroup => {
        const options = { order, characteristic, Fs, Fc, gain, preGain };
        const calc = new CalcCascades();
        const coeffs = calc.highpass(options);
        const filter = new IirFilter(coeffs);

        return filter.multiStep(channelGroup);
      };

      return channelGroupBuffer.map(highPass);
    })
  );
