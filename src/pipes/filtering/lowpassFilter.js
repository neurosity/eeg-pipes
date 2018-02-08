import { CalcCascades, IirFilter } from "fili";
import { map } from "rxjs/operators";
import { createPipe } from "../../utils/createPipe";
import {
  SAMPLE_RATE as defaultsamplingRate,
  ORDER as defaultOrder,
  CHARACTERISTIC as defaultCharacteristic
} from "../../constants";

/**
 * @method lowpassFilter
 * Applies a low pass filter to EEG Data. Can be applied to Samples or Chunks. Must provide nbChannels. cutOffFrequency will default to 50hz.
 * @example { nbChannels = 4, samplingRate = 256, cutOffFrequency = 30 }
 * @param {Object} options
 * @returns {Observable}
 */

const createLowpassIIR = options => {
  const calc = new CalcCascades();
  const coeffs = calc.lowpass(options);
  return new IirFilter(coeffs);
};

export const lowpassFilter = ({
  nbChannels,
  order = defaultOrder,
  characteristic = defaultCharacteristic,
  cutoffFrequency = 50,
  samplingRate = defaultsamplingRate,
  Fs = samplingRate,
  Fc = cutoffFrequency,
  BW = 0.1
} = {}) => source => {
  if (!nbChannels) {
    throw new Error(
      "Please supply nbChannels parameter to lowpassFilter operator"
    );
  }
  const options = {
    order,
    characteristic,
    Fs,
    Fc,
    BW
  };
  const lowpassArray = new Array(nbChannels)
    .fill(0)
    .map(() => createLowpassIIR(options));
  return createPipe(
    source,
    map(eegObject => {
      // Should run multiStep function if inc. data is a Chunk (2D data array)
      if (Array.isArray(eegObject.data[0])) {
        return {
          ...eegObject,
          data: eegObject.data.map((channel, index) =>
            lowpassArray[index].multiStep(channel)
          )
        };
      }

      // Should run singleStep if inc. data is a Sample (1D array)
      return {
        ...eegObject,
        data: eegObject.data.map((channel, index) =>
          lowpassArray[index].singleStep(channel)
        )
      };
    })
  );
};
