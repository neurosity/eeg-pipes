import { CalcCascades, IirFilter } from "fili";
import { map } from "rxjs/operators";

import { createPipe } from "../../utils/createPipe";

import { SAMPLE_RATE as defaultSampleRate } from "../../constants";

/**
 * @method lowPassFilter
 * Applies a low pass filter to FFT buffer
 *
 * @param {Object} options
 * @returns {Observable}
 */
export const lowPassFilter = (
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
      const lowPass = channelGroup => {
        const options = { order, characteristic, Fs, Fc, gain, preGain };
        const calc = new CalcCascades();
        const coeffs = calc.lowpass(options);
        const filter = new IirFilter(coeffs);

        return filter.multiStep(channelGroup);
      };

      return channelGroupBuffer.map(lowPass);
    })
  );
