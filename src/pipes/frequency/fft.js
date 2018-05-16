import { FFT } from "dsp.js";
import { map } from "rxjs/operators";
import { createPipe } from "../../utils/createPipe";

import {
  SAMPLE_RATE as defaultSampleRate,
  FFT_BINS as defaultFftBins,
  DATA_PROP as defaultDataProp
} from "../../constants";

/**
 * Applys a Fast Fourier Transform to an Epoch of EEG data and returns a PSD (Power Spectral Density). Frequency resolution will be samplingRate / bins
 * @method fft
 * @example eeg$.pipe(epoch({ duration: 1024, interval: 100, samplingRate: 256 }), fft({ bins: 1024 }))
 * @param {Object} options - FFT options
 * @param {number} options.bins Number of FFT bins. Must be a power of two and same size as input Epoch duration
 * @param {String} [options.dataProp='data] Name of the key associated with eeg data
 *
 * @returns {Observable<PSD>}
 */
export const fft = ({
  bins = defaultFftBins,
  dataProp = defaultDataProp
} = {}) => source => {
  const transformChannel = (channel, samplingRate) => {
    const safeSamples = channel.map(sample => {
      if (isNaN(sample) || !sample) {
        return 0;
      }
      return sample;
    });
    const fft = new FFT(bins, samplingRate);
    fft.forward(safeSamples);
    return Array.from(fft.spectrum);
  };
  return createPipe(
    source,
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
