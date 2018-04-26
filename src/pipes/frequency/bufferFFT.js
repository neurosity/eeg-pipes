import { FFT } from "dsp.js";
import { bufferCount, map } from "rxjs/operators";

import { createPipe } from "../../utils/createPipe";
import { groupByChannel } from "../../utils/groupByChannel";

import {
  SAMPLE_RATE as defaultSampleRate,
  FFT_BINS as defaultFftBins,
  DATA_PROP as defaultDataProp
} from "../../constants";

/**
 * @method bufferFFT
 * Takes a samples and returns an FFT buffer
 *
 * @param {Object} options
 * @returns {Observable}
 */
export const bufferFFT = ({
  bins = defaultFftBins,
  window = null,
  sampleRate = defaultSampleRate,
  dataProp = defaultDataProp
} = {}) => source => {
  const fft = channelGroup => {
    const safeSamples = channelGroup.map(x => {
      if (isNaN(x) || !x) {
        return 0;
      }
      return x;
    });
    const fft = new FFT(bins, sampleRate);
    fft.forward(safeSamples);
    return Array.from(fft.spectrum);
  };
  return createPipe(
    source,
    bufferCount(bins, window),
    map(samplesBuffer => groupByChannel(samplesBuffer, dataProp).map(fft))
  );
};
