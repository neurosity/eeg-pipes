import { CalcCascades, IirFilter } from "fili";
import { map } from "rxjs/operators";
import { createPipe } from "../../utils/createPipe";
import { isEpoch } from "../../utils/isEpoch";
import {
  SAMPLING_RATE as defaultsamplingRate,
  ORDER as defaultOrder,
  CHARACTERISTIC as defaultCharacteristic,
  NOTCH_BW as defaultNotchBW
} from "../../constants";

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
 * Applies a notch filter to EEG Data. Can be applied to both raw or epoched data. Has the ability to filter out harmonics of line noise (e.g. 120Hz, 180Hz), though this is only needed for high-frequency devices with >= 1000hz sampling rate
 * @method notchFilter
 * @example eeg$
  .pipe(notchFilter({ cutoffFrequency: 60, nbChannels: 10, samplingRate: 1000, filterHarmonics: true }))
 * @param {Object} options - Filter options
 * @param {number} options.nbChannels Number of channels
 * @param {number} [options.cutoffFrequency=60] Cutoff frequency in Hz
 * @param {number} [options.bandWidth=0.5] Width of the cutoff centered around the notched frequency. Larger values reduce filter out more of the notch frequency at the cost of also reducing nearby frequencies
 * @param {boolean} [options.filterHarmonics=false] Whether to filter harmonics of the notch frequency as well
 * @param {number} [options.samplingRate=250] Sampling rate of the EEG device
 * @param {string} [options.characteristic='butterworth'] Filter characteristic. Options are 'bessel' and 'butterworth'
 * @param {number} [options.order=2] Number of 2nd order biquad filters applied to the signal
 * 
 * @returns {Observable<Sample | Epoch>}
 */
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
    throw new Error("Please supply nbChannels parameter");
  }
  const notchArray = new Array(nbChannels).fill(0).map(() =>
    createNotchIIR(
      {
        order,
        characteristic,
        Fs: samplingRate,
        Fc: cutoffFrequency,
        BW: bandWidth
      },
      filterHarmonics
    )
  );
  return createPipe(
    source,
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
          const filteredData = notchArray[index](safeChannel, "multiStep");

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
          return notchArray[index](channel, "singleStep");
        }
        return channel;
      })
    }))
  );
};
