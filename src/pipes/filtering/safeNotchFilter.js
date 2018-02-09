import { CalcCascades, IirFilter } from "fili";
import { map } from "rxjs/operators";
import { createPipe } from "../../utils/createPipe";
import {
  SAMPLE_RATE as defaultsamplingRate,
  ORDER as defaultOrder,
  CHARACTERISTIC as defaultCharacteristic
} from "../../constants";

/**
 * @method safeNotchFilter
 * Applies a notch filter to EEG Data. Can be applied to Samples or Chunks. Must provide nbChannels. cutOffFrequency will default to 60hz.
 * @example { nbChannels = 4, samplingRate = 256, cutOffFrequency = 60 }
 * @param {Object} options
 * @returns {Observable}
 */

const createNotchIIR = options => {
  const calc = new CalcCascades();
  const coeffs = calc.bandstop(options);
  return new IirFilter(coeffs);
};

const interpolate = (before, after) => {
  if (!isNaN(before)) {
    if (!isNaN(after)) {
      return (before + after) / 2;
    }
    return before;
  }
  if (!isNaN(after)) {
    return after;
  }
  return 0;
};

export const safeNotchFilter = ({
  nbChannels,
  order = defaultOrder,
  characteristic = defaultCharacteristic,
  cutoffFrequency = 60,
  samplingRate = defaultsamplingRate,
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
      const isChunk = Array.isArray(eegObject.data[0]);
      const stepFunction = isChunk ? "multiStep" : "singleStep";
      return {
        ...eegObject,
        data: eegObject.data.map((channel, index) => {
          const nans = [];
          // If Chunk, map through channel data, cleaning NaNs by interpolating. Store index of each NaN for reinsertion later
          if (isChunk) {
            
            channel = channel.map((sample, sampleIndex) => {
              if (isNaN(sample)) {
                nans.push(sampleIndex);
                const interpolation = interpolate(
                  channel[sampleIndex - 1],
                  channel[sampleIndex + 1]
                );
                return interpolation;
              }
              return sample;
            });
          } else if (isNaN(channel)) {
            return channel;
          }
          const filteredData = notchArray[index][stepFunction](channel);
          if (nans.length > 0) {
            nans.forEach(nan => {
              filteredData[nan] = NaN;
            });
          }
          return filteredData;
        })
      };
    })
  );
};
