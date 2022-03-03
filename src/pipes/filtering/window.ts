import { WindowFunction, DSP } from "@neurosity/dsp";
import { pipe } from "rxjs";
import { map } from "rxjs/operators";
import { isEpoch } from "../../utils/isEpoch";
import { CHANNELS as defaultChannels } from "../../constants";

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
 * All window function types supported by the current DSP library (dsp.js)
 */
export type WindowType =
  | "BARTLETT"
  | "BARTLETTHANN"
  | "BLACKMAN"
  | "COSINE"
  | "GAUSS"
  | "HAMMING"
  | "HANN"
  | "LANCZOS"
  | "RECTANGULAR"
  | "TRIANGULAR";

const WindowTypeMap = {
  BARTLETT: DSP.BARTLETT,
  BARTLETTHANN: DSP.BARTLETTHANN,
  BLACKMAN: DSP.BLACKMAN,
  COSINE: DSP.COSINE,
  GAUSS: DSP.GAUSS,
  HAMMING: DSP.HAMMING,
  HANN: DSP.HANN,
  LANCZOS: DSP.LANCZOS,
  RECTANGULAR: DSP.RECTANGULAR,
  TRIANGULAR: DSP.TRIANGULAR
};

/**
 * Applies a window function to EEG Data. Can be applied to both raw or epoched data.
 * @method window
 * @example eeg$
  .pipe(window({ windowType: 'HAMMING', nbChannels: 4 }))
 * @param {Object} options - Filter options
 * @param {number} options.nbChannels Number of channels
 * @param {WindowType} [options.windowType] Window function type to apply (default = 'HAMMING')
 * 
 * @returns {Observable<Sample | Epoch>}
 */
export const window = ({
  windowType = "HAMMING",
  nbChannels = defaultChannels
}: { windowType?: WindowType; nbChannels?: number } = {}) => {
  if (!nbChannels) {
    throw new Error("Please supply nbChannels parameter");
  }
  const windowFunction = new WindowFunction(WindowTypeMap[windowType]);

  return pipe(
    map((eegObject: any) => ({
      ...eegObject,
      data: eegObject.data.map((channel) => {
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
          const filteredData = windowFunction.process(safeChannel);

          // Afterwards, reinsert NaNs
          if (nans.length > 0) {
            nans.forEach((nan) => {
              filteredData[nan] = NaN;
            });
          }
          return filteredData;
        }
        // If Sample, only filter if not NaN
        if (!isNaN(channel)) {
          return windowFunction.process(channel);
        }
        return channel;
      })
    }))
  );
};
