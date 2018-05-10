import { bufferCount, scan, filter } from "rxjs/operators";

import { createPipe } from "../../utils/createPipe";
import { bufferToEpoch } from "../utility/bufferToEpoch";

import {
  EPOCH_DURATION as defaultEpochDuration,
  EPOCH_INTERVAL as defaultEpochInterval,
  DATA_PROP as defaultDataProp
} from "../../constants";

/**
 * Converts a stream of individual Samples of EEG data into a stream of Epochs of a given duration emitted at specified interval. This operator functions similarly to a circular buffer internally and allows overlapping Epochs of data to be emitted (e.g. emitting the last one second of data every 100ms). Requires samplingRate parameter unless stream already contains samplingRate in info.
 * @method epoch
 * @example eeg$.pipe(epoch({ duration: 1024, interval: 100, samplingRate: 256 }))
 * @param {Object} options - Epoching options
 * @param {number} options.duration Number of samples to include in each epoch
 * @param {number} options.interval Time between emitted Epochs
 * @param {number} [options.samplingRate] Sampling rate
 * @param {string} [options.dataProp='data'] Name of the key associated with eeg data
 * @returns {Observable} Epoch
 */
export const epoch = ({
  duration = defaultEpochDuration,
  interval = defaultEpochInterval,
  samplingRate,
  dataProp = defaultDataProp
} = {}) => source$ =>
  createPipe(
    source$,
    bufferCount(interval),
    scan((acc, val) =>
      acc.concat(val).slice(acc.length < duration ? 0 : -duration)
    ),
    filter(samplesArray => samplesArray.length === duration),
    bufferToEpoch({ samplingRate, dataProp })
  );
