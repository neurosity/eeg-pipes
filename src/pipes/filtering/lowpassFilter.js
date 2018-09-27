import { CalcCascades, IirFilter } from "fili";
import { pipe } from "rxjs";
import { map } from "rxjs/operators";
import { isEpoch } from "../../utils/isEpoch";
import {
  SAMPLING_RATE as defaultsamplingRate,
  ORDER as defaultOrder,
  CHARACTERISTIC as defaultCharacteristic
} from "../../constants";

const createLowpassIIR = options => {
  const calc = new CalcCascades();
  const coeffs = calc.lowpass(options);
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

/**
 * Applies a lowpass filter to EEG Data. Can be applied to both raw or epoched data
 * @method lowpassFilter
 * @example eeg$
  .pipe(lowpassFilter({ cutoffFrequency: 50, nbChannels: 4 }))
 * @param {Object} options - Filter options
 * @param {number} options.nbChannels Number of channels
 * @param {number} [options.cutoffFrequency=50] Cutoff frequency in Hz
 * @param {number} [options.samplingRate=250] Sampling rate of the EEG device
 * @param {string} [options.characteristic='butterworth'] Filter characteristic. Options are 'bessel' and 'butterworth'
 * @param {number} [options.order=2] The number of 2nd order biquad filters applied to the signal
 * 
 * @returns {Observable<Sample | Epoch>}
 */
export const lowpassFilter = ({
  nbChannels,
  order = defaultOrder,
  characteristic = defaultCharacteristic,
  cutoffFrequency = 50,
  samplingRate = defaultsamplingRate
} = {}) => {
  if (!nbChannels) {
    throw new Error("Please supply nbChannels parameter");
  }
  const lowpassArray = new Array(nbChannels).fill(0).map(() =>
    createLowpassIIR({
      order,
      characteristic,
      Fs: samplingRate,
      Fc: cutoffFrequency
    })
  );
  return pipe(
    map(eegObject => ({
      ...eegObject,
      data: eegObject.data.map((channel, index) => {
        if (isEpoch(eegObject)) {
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
          const filteredData = lowpassArray[index].multiStep(
            safeChannel
          );

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
          return lowpassArray[index].singleStep(channel);
        }
        return channel;
      })
    }))
  );
};
