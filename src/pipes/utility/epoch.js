import { bufferCount, scan } from "rxjs/operators";

import { createPipe } from "../../utils/createPipe";
import { groupByChannel } from "../../utils/groupByChannel";

import {
  EPOCH_DURATION as defaultEpochDuration,
  EPOCH_INTERVAL as defaultEpochInterval,
  DATA_PROP as defaultDataProp,
  SAMPLE_RATE as defaultSamplingRate
} from "../../constants";

/**
 * @method epoch
 * Implements a standard  circular buffer for converting streams of EEG data into epochs of a given size emitted at a specified interval.
 * Requires samplingRate parameter unless stream already contains samplingRate in info.
 *
 * @returns {Observable} Epoch
 */
export const epoch = ({
  duration = defaultEpochDuration,
  interval = defaultEpochInterval,
  dataProp = defaultDataProp,
  samplingRate = defaultSamplingRate
} = {}) => source$ =>
  createPipe(
    source$,
    bufferCount(interval),
    scan((acc, val) => {
      const transposedSamples = groupByChannel(val);
      if (acc === null) {
        return {
          [dataProp]: new Array(val[0][dataProp].length)
            .fill(new Array(duration - interval).fill(0))
            .map((channelData, channelIndex) =>
              channelData.concat(transposedSamples[channelIndex])
            ),
          info: val[0].samplingRate
            ? {
                ...val[0].info,
                samplingRate: val[0].samplingRate,
                startTime:
                  val[0].timestamp -
                  (duration - interval) * (1000 / val[0].samplingRate)
              }
            : {
                ...val[0].info,
                samplingRate: samplingRate,
                startTime:
                  val[0].timestamp -
                  (duration - interval) * (1000 / samplingRate)
              }
        };
      }
      return {
        [dataProp]: transposedSamples.map((channelData, channelIndex) =>
          acc[dataProp][channelIndex].concat(channelData).slice(interval)
        ),
        info: {
          ...val[0].info,
          startTime:
            acc.info.startTime + interval * (1000 / acc.info.samplingRate)
        }
      };
    }, null)
  );
