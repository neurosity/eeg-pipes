import { CalcCascades, IirFilter } from "fili";
import { map } from "rxjs/operators";
import { createPipe } from "../../utils/createPipe";
import {
  SAMPLE_RATE as defaultSamplingRate,
  ORDER as defaultOrder,
  CHARACTERISTIC as defaultCharacteristic
} from "../../constants";

const createHighpassIIR = options => {
  const calc = new CalcCascades();
  const coeffs = calc.highpass({
    ...options,
    Fc: options.cutoffFrequencies[0]
  });
  return new IirFilter(coeffs, true);
};

const createLowpassIIR = options => {
  const calc = new CalcCascades();
  const coeffs = calc.lowpass({ ...options, Fc: options.cutoffFrequencies[1] });
  return new IirFilter(coeffs, true);
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
 * Applies a bandpass filter to EEG Data. Can be applied to both raw or epoched data
 * @method bandpassFilter
 * @example eeg$
  .pipe(bandpassFilter({ cutoffFrequencies: [2, 50], nbChannels: 4 }))
 * @param {Object} options - Filter options
 * @param {number} options.nbChannels Number of channels
 * @param {Array<number>} [options.cutoffFrequencies=[2,50]] Low and high cutoff frequencies in Hz
 * @param {number} [options.samplingRate=250] Sampling rate of the EEG device
 * @param {String} [options.characteristic='butterworth'] Filter characteristic. Options are 'bessel' and 'butterworth'
 * @param {number} [options.order=2] The number of 2nd order biquad filters applied to the signal
 * 
 * @returns {Observable<Sample | Epoch>}
 */
export const bandpassFilter = ({
  nbChannels,
  order = defaultOrder,
  characteristic = defaultCharacteristic,
  cutoffFrequencies = [2, 50],
  samplingRate = defaultSamplingRate,
  Fs = samplingRate,
  BW = 1
} = {}) => source => {
  if (!nbChannels) {
    throw new Error("Please supply nbChannels parameter");
  }
  const options = {
    order,
    characteristic,
    cutoffFrequencies,
    Fs,
    BW
  };
  const bandpassArray = new Array(nbChannels).fill(0).map(() => ({
    high: createHighpassIIR(options),
    low: createLowpassIIR(options)
  }));
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
            const filteredData = bandpassArray[index].low.multiStep(
              bandpassArray[index].high.multiStep(safeChannel)
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
            return bandpassArray[index].low.singleStep(
              bandpassArray[index].high.singleStep(channel)
            );
          }
          return channel;
        })
      };
    })
  );
};
