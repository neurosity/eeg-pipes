import { CalcCascades, IirFilter } from "fili";
import { map } from "rxjs/operators";

import { createPipe } from "../../utils/createPipe";
import {
  SAMPLE_RATE as defaultSampleRate,
  ORDER as defaultOrder,
  CHARACTERISTIC as defaultCharacteristic,
  GAIN as defaultGain,
  PREGAIN as defaultPreGain
} from "../../constants";

/**
 * @method highPassFilter
 * Applies a high pass filter to an EEG buffer
 *
 * @param {Object} options
 * @returns {Observable}
 */
export const highPassFilter = (
  {
    order = defaultOrder,
    characteristic = defaultCharacteristic,
    cutoffFrequency = 2,
    sampleRate = defaultSampleRate,
    Fs = sampleRate,
    Fc = cutoffFrequency,
    gain = defaultGain,
    preGain = defaultPreGain
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
