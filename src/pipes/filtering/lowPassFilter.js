import { CalcCascades, IirFilter } from "fili";
import { map, scan } from "rxjs/operators";

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
 * @method lowPassFilter
 * Applies a low pass filter to FFT buffer
 *
 * @param {Object} options
 * @returns {Observable}
 */

const createLowPassIIR = options => {
  const calc = new CalcCascades();
  const coeffs = calc.lowpass(options);
  return new IirFilter(coeffs);
};

export const lowPassFilter = (
  {
    order = defaultOrder,
    characteristic = defaultCharacteristic,
    cutoffFrequency = 55,
    sampleRate = defaultSampleRate,
    Fs = sampleRate,
    Fc = cutoffFrequency,
    gain = defaultGain,
    preGain = defaultPreGain,
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
        new Array(nbChannels).fill(0).map(x =>
          createLowPassIIR({
            order,
            characteristic,
            Fs,
            Fc,
            gain,
            preGain
          })
        )
      ]
    ),
    // Pluck just the data array to emit
    map(dataAndFilter => dataAndFilter[0])
  );
