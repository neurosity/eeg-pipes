import { CalcCascades, IirFilter } from "fili";
import { map } from "rxjs/operators";
import { createPipe } from "../../utils/createPipe";
import {
  SAMPLE_RATE as defaultsamplingRate,
  NOTCH_ORDER as defaultOrder,
  CHARACTERISTIC as defaultCharacteristic,
  NOTCH_BW as defaultNotchBW
} from "../../constants";

/**
 * @method safeNotchFilter
 * Applies a notch filter to EEG Data. Filters around NaN values while leaving them intact in output. Can be applied to Samples or Chunks. Must provide nbChannels. cutOffFrequency will default to 60hz.
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
  BW = defaultNotchBW
} = {}) => source => {
  if (!nbChannels) {
    throw new Error(
      "Please supply nbChannels parameter to notchFilter operator"
    );
  }
  const notchArray = new Array(nbChannels).fill(0).map(() =>
    createNotchIIR({
      order,
      characteristic,
      Fs,
      Fc,
      BW
    })
  );
  return createPipe(
    source,
    map(eegObject => {
      const isChunk = Array.isArray(eegObject.data[0]);
      return {
        ...eegObject,
        data: eegObject.data.map((channel, index) => {
          // If Chunk, map through channel data, cleaning NaNs by interpolating.
          if (isChunk) {
            const nans = [];
            const safeChannel = channel.map((sample, sampleIndex) => {
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

            // Then, perform filter
            const filteredData = notchArray[index].multiStep(safeChannel);

            // Afterwards, reinsert NaNs
            if (nans.length > 0) {
              nans.forEach(nan => {
                filteredData[nan] = NaN;
              });
            }
            return filteredData;
          }
          // If Sample, only filter if not NaN
          if (!isNaN(channel)) {
            return notchArray[index].singleStep(channel);
          }
          return channel;
        })
      };
    })
  );
};
