import { FFT } from "dsp.js";
import { bufferCount, map } from "rxjs/operators";

import { createPipe } from "../../utils/createPipe";
import { groupByChannel } from "../../utils/groupByChannel";

import {
  SAMPLING_RATE as defaultsamplingRate,
  FFT_BINS as defaultFftBins,
  DATA_PROP as defaultDataProp
} from "../../constants";

/**
 * Takes a stream of Samples and applies a Fast Fourier Transform to return a stream of PSDs (Power Spectral Density). Note: this operator works by buffering the stream of samples into buffers that are as long as the supplied number of bins. Because it doesn't allow as much flexibility in terms of how often data is emitted we recommend using a combination of the `epoch` and `fft` operators instead.
 * @method bufferFFT
 * @example eeg$.pipe(bufferFFT({ bins: 1024 }))
 * @param {Object} options - FFT options
 * @param {number} options.bins Number of FFT bins. Must be a power of 2.
 * @param {number} options.samplingRate Sampline rate of EEG siganl
 * @param {string} [options.dataProp='data] Name of the key associated with eeg data
 * @returns {Observable}
 */
export const bufferFFT = ({
  bins = defaultFftBins,
  window = null,
  samplingRate = defaultsamplingRate,
  dataProp = defaultDataProp
} = {}) => source => {
  const fft = channelGroup => {
    const safeSamples = channelGroup.map(x => {
      if (isNaN(x) || !x) {
        return 0;
      }
      return x;
    });
    const fft = new FFT(bins, samplingRate);
    fft.forward(safeSamples);
    return Array.from(fft.spectrum);
  };
  return createPipe(
    source,
    bufferCount(bins, window),
    map(samplesBuffer => groupByChannel(samplesBuffer, dataProp).map(fft))
  );
};
