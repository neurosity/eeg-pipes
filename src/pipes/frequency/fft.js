import { FFT } from "dsp.js";
import { pipe } from "rxjs";
import { map } from "rxjs/operators";
import { zeroPad } from "../../utils/zeroPad";

import {
  FFT_BINS as defaultFftBins,
  DATA_PROP as defaultDataProp
} from "../../constants";

/**
 * Applies a Fast Fourier Transform to a stream of Epochs of EEG data and returns a stream of PSDs (Power Spectral Density). Frequency resolution will be samplingRate / bins. If input Epoch duration is not equal to bins, data will be zero-padded or sliced so that is the same length as bins.
 * @method fft
 * @example eeg$.pipe(epoch({ duration: 256, interval: 100, samplingRate: 256 }), fft({ bins: 256 }))
 * @param {Object} options - FFT options
 * @param {number} options.bins Number of FFT bins. Must be a power of 2.
 * @param {string} [options.dataProp='data] Name of the key associated with eeg data
 *
 * @returns {Observable<PSD>}
 */
export const fft = ({
  bins = defaultFftBins,
  dataProp = defaultDataProp
} = {}) => {
  const transformChannel = (channel, samplingRate) => {
    let safeSamples = channel.map(sample => {
      if (isNaN(sample) || !sample) {
        return 0;
      }
      return sample;
    });
    const fft = new FFT(bins, samplingRate);
    if (safeSamples.length != bins) {
      if (safeSamples.length < bins) {
        safeSamples = zeroPad(safeSamples, bins);
      } else {
        safeSamples = safeSamples.slice(safeSamples.length - bins);
      }
    }
    fft.forward(safeSamples);
    return Array.from(fft.spectrum);
  };
  return pipe(
    map(epoch => ({
      psd: epoch[dataProp].map(channel =>
        transformChannel(channel, epoch.info.samplingRate)
      ),
      freqs: Array.from(
        { length: bins / 2 },
        (_, index) => index * (epoch.info.samplingRate / bins)
      ),
      info: epoch.info
    }))
  );
};
