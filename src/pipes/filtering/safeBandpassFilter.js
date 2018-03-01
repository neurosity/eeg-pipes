import { CalcCascades, IirFilter } from "fili";
import { map } from "rxjs/operators";
import { createPipe } from "../../utils/createPipe";
import {
  SAMPLE_RATE as defaultsamplingRate,
  ORDER as defaultOrder,
  CHARACTERISTIC as defaultCharacteristic
} from "../../constants";

/**
 * @method safeBandpassFilter
 * Applies a bandpass filter to EEG Data. Filters around dropped data values while leaving them intact in output. Can be applied to Samples or Chunks. Must provide nbChannels.
 * @example { nbChannels = 4, samplingRate = 256, cutOffFrequency = 60 }
 * @param {Object} options
 * @returns {Observable}
 */

const createBandpassIIR = options => {
  const calc = new CalcCascades();
  const coeffs = calc.bandpass(options);
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

export const safeBandpassFilter = ({
  nbChannels,
  order = defaultOrder,
  characteristic = defaultCharacteristic,
  cutoffFrequencies = [2, 50],
  samplingRate = defaultsamplingRate,
  Fs = samplingRate,
  Fc = (cutoffFrequencies[1] - cutoffFrequencies[0]) / 2,
  BW = 1
} = {}) => source => {
  if (!nbChannels) {
    throw new Error(
      "Please supply nbChannels parameter to safeBandpassFilter operator"
    );
  }
  const options = {
    order,
    characteristic,
    Fs,
    Fc,
    BW
  };
  const bandpassArray = new Array(nbChannels)
    .fill(0)
    .map(() => createBandpassIIR(options));
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
          const filteredData = bandpassArray[index][stepFunction](channel);
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
