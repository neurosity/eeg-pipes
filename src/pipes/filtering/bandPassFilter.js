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

const createHighPassIIR = options => {
  const calc = new CalcCascades();
  const coeffs = calc.highpass(options);
  return new IirFilter(coeffs);
};

const createLowPassIIR = options => {
  const calc = new CalcCascades();
  const coeffs = calc.lowpass(options);
  return new IirFilter(coeffs);
};

export const bandPassFilter = (
  {
    order = defaultOrder,
    characteristic = defaultCharacteristic,
    cutoffFrequencies = [2, 55],
    sampleRate = defaultSampleRate,
    Fs = sampleRate,
    gain = defaultGain,
    preGain = defaultPreGain,
    nbChannels = defaultNbChannels
  } = {}
) => source =>
  createPipe(
    source,
    scan(
      (acc, curr) => [
        curr.map((channel, index) =>
          acc[2][index].multiStep(acc[1][index].multiStep(channel))
        ),
        acc[1], acc[2]
      ],
      [
        new Array(nbChannels).fill(0),
        new Array(nbChannels).fill(0).map(x =>
          createLowPassIIR({
            order,
            characteristic,
            Fs,
            Fc: cutoffFrequency[1],
            gain,
            preGain
          })
        ),
        new Array(nbChannels).fill(0).map(x =>
          createHighPassIIR({
            order,
            characteristic,
            Fs,
            Fc: cutoffFrequency[0],
            gain,
            preGain
          })
        )
      ]
    ),
    // Pluck just the data array to emit
    map(dataAndFilter => dataAndFilter[0])
  );

/*
  const options = { order, characteristic, Fs, gain, preGain };
  const calc = new CalcCascades();
  const lowCoeffs = calc.lowPass({ ...options, Fc: cutoffFrequency[0] });
  const highCoeffs = calc.highPass({
    ...options,
    Fc: cutoffFrequency[1]
  });
  const lowPass = new IirFilter(lowCoeffs);
  const highPass = new IirFilter(highCoeffs);

  return lowPass.multiStep(highPass.multiStep(channelGroup));
};
*/
