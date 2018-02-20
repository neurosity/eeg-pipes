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
 * @method chunkFFT
 * Takes a Chunk and returns an FFT buffer
 *
 * @param {Object} options
 * @returns {Observable}
 */
export const chunkFFT = ({
  bins = defaultFftBins,
  window = null,
  sampleRate = defaultSampleRate,
  dataProp = defaultDataProp
} = {}) => source => {
  const fft = channel => {
    const fft = new FFT(bins, sampleRate);
    fft.forward(channel);
    return Array.from(fft.spectrum);
  };
  return createPipe(
    source,
    map(chunk => ({
      ...chunk,
      data: chunk[dataProp].map(fft)
    }))
  );
};
