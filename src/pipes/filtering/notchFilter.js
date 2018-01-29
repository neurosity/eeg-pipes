import { CalcCascades, IirFilter } from "fili";
import { scan, map } from "rxjs/operators";

import { createPipe } from "../../utils/createPipe";
import {
  CHANNELS as defaultNbChannels,
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

const createNotchIIR = options => {
  const calc = new CalcCascades();
  const coeffs = calc.bandstop(options);
  return new IirFilter(coeffs);
};

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
    BW = 0.1,
    nbChannels = defaultNbChannels
  } = {}
) => source =>
  createPipe(
    source,
    scan(
      (acc, curr) => [
        curr.map((channel, index) => acc[1][index].multiStep(channel)),
        acc[1]
      ],
      [
        new Array(nbChannels).fill(0),
        new Array(nbChannels)
          .fill(0)
          .map(x =>
            createNotchIIR({ order, characteristic, Fs, Fc, gain, preGain, BW })
          )
      ]
    ),
    // Pluck just the data array to emit
    map(dataAndFilter => dataAndFilter[0])
  );
