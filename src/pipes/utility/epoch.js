import { bufferCount, scan, filter, tap } from "rxjs/operators";

import { createPipe } from "../../utils/createPipe";
import { chunk } from "../utility/chunk";

import {
  EPOCH_DURATION as defaultEpochDuration,
  EPOCH_INTERVAL as defaultEpochInterval,
  DATA_PROP as defaultDataProp,
  SAMPLE_RATE as defaultSamplingRate
} from "../../constants";

/**
 * @method epoch
 * Implements a standard circular buffer for converting streams of EEG data into epochs of a given size emitted at a specified interval.
 * Requires samplingRate parameter unless stream already contains samplingRate in info.
 *
 * @returns {Observable} Epoch
 */
export const epoch = ({
  duration = defaultEpochDuration,
  interval = defaultEpochInterval,
  dataProp = defaultDataProp
} = {}) => source$ =>
  createPipe(
    source$,
    bufferCount(interval),
    scan((acc, val) =>
      acc.concat(val).slice(acc.length < duration ? 0 : -duration)
    ),
    filter(samplesArray => samplesArray.length === duration),
    chunk({ dataProp })
  );
