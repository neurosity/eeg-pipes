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
 * @method notchFilter
 * Applies notch filter to a buffer of EEG data
 *
 * @param {Object} options
 * @returns {Observable}
 */
export const notchFilter = (
  {
    order = defaultOrder,
    characteristic = defaultCharacteristic,
    cutoffFrequency = 60,
    sampleRate = defaultSampleRate,
    Fs = sampleRate,
    Fc = cutoffFrequency,
    gain = defaultGain,
    preGain = defaultPreGain,
    BW = 0.1
  } = {}
) => source =>
  createPipe(
    source,
    map(channelGroupBuffer => {
      const notch = channelGroup => {
        const options = { order, characteristic, Fs, Fc, gain, preGain, BW };
        const calc = new CalcCascades();
        const coeffs = calc.bandstop(options);
        const filter = new IirFilter(coeffs);

        return filter.multiStep(channelGroup);
      };

      return channelGroupBuffer.map(notch);
    })
  );
