import { CalcCascades, IirFilter } from "fili";
import { map } from "rxjs/operators";
import { createPipe } from "../../utils/createPipe";
import {
  SAMPLE_RATE as defaultSampleRate,
  ORDER as defaultOrder,
  CHARACTERISTIC as defaultCharacteristic
} from "../../constants";

/**
 * @method notchFilter
 * Applies notch filter to EEG Data. Can be applied to Samples or Chunks. Must provide nbChannels. cutOffFrequency will default to 60hz.
 * @example { nbChannels = 4, samplingRate = 256, cutOffFrequency = 60 }
 * @param {Object} options
 * @returns {Observable}
 */

const createNotchIIR = options => {
  const calc = new CalcCascades();
  const coeffs = calc.bandstop(options);
  return new IirFilter(coeffs);
};

export const notchFilter = ({
  nbChannels,
  order = defaultOrder,
  characteristic = defaultCharacteristic,
  cutoffFrequency = 60,
  samplingRate = defaultSampleRate,
  Fs = samplingRate,
  Fc = cutoffFrequency,
  BW = 0.1
} = {}) => source => {
  if (!nbChannels) {
    throw new Error(
      "Please supply nbChannels parameter to notchFilter operator"
    );
  }
  const options = {
    order,
    characteristic,
    Fs,
    Fc,
    BW
  };
  const notchArray = new Array(nbChannels)
    .fill(0)
    .map(() => createNotchIIR(options));
  return createPipe(
    source,
    map(eegObject => {
      // Should run multiStep function if inc. data is a Chunk (2D data array)
      if (Array.isArray(eegObject.data[0])) {
        return {
          ...eegObject,
          data: eegObject.data.map((channel, index) =>
            notchArray[index].multiStep(channel)
          )
        };
      }

      // Should run singleStep if inc. data is a Sample (1D array)
      return {
        ...eegObject,
        data: eegObject.data.map((channel, index) =>
          notchArray[index].singleStep(channel)
        )
      };
    })
  );
};
