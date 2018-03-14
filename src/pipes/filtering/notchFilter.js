import { CalcCascades, IirFilter } from "fili";
import { map } from "rxjs/operators";
import { createPipe } from "../../utils/createPipe";
import {
  SAMPLE_RATE as defaultsamplingRate,
  ORDER as defaultOrder,
  CHARACTERISTIC as defaultCharacteristic,
  NOTCH_BW as defaultNotchBW
} from "../../constants";

/**
 * @method notchFilter
 * Applies a notch filter to EEG Data. Can be applied to Samples or Chunks. Must provide nbChannels. cutOffFrequency will default to 60hz.
 * @example { nbChannels = 4, samplingRate = 256, cutOffFrequency = 60 }
 * @param {Object} options
 * @returns {Observable}
 */

const createNotchIIR = (options, filterHarmonics) => {
  const calc = new CalcCascades();
  const coeffs = calc.bandstop(options);

  if (filterHarmonics) {
    const thirdHarmonicCoeffs = calc.bandstop({
      ...options,
      Fc: options.Fc * 3
    });
    const firstFilter = new IirFilter(coeffs);
    const thirdFilter = new IirFilter(thirdHarmonicCoeffs);
    return (signal, stepFunction) =>
      thirdFilter[stepFunction](firstFilter[stepFunction](signal));
  }
  const filter = new IirFilter(coeffs);
  return (signal, stepFunction) => filter[stepFunction](signal);
};

export const notchFilter = ({
  nbChannels,
  order = defaultOrder,
  characteristic = defaultCharacteristic,
  cutoffFrequency = 60,
  samplingRate = defaultsamplingRate,
  bandWidth = defaultNotchBW,
  filterHarmonics = false
} = {}) => source => {
  if (!nbChannels) {
    throw new Error(
      "Please supply nbChannels parameter to notchFilter operator"
    );
  }
  const options = {
    order,
    characteristic,
    Fs: samplingRate,
    Fc: cutoffFrequency,
    BW: bandWidth
  };
  const notchArray = new Array(nbChannels)
    .fill(0)
    .map(() => createNotchIIR(options, filterHarmonics));
  return createPipe(
    source,
    map(eegObject => {
      const isChunk = Array.isArray(eegObject.data[0]);
      const stepFunction = isChunk ? "multiStep" : "singleStep";
      return {
        ...eegObject,
        data: eegObject.data.map((channel, index) =>
          notchArray[index](channel, stepFunction)
        )
      };
    })
  );
};
