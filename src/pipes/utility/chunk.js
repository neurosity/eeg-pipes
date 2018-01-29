import { map } from "rxjs/operators";

import { createPipe } from "../../utils/createPipe";
import { groupByChannel } from "../../utils/groupByChannel";

import {
  DATA_PROP as defaultDataProp,
  SAMPLE_RATE as defaultSamplingRate
} from "../../constants";

/**
 * @method chunk
 * Takes an array of Samples and returns a Chunk with a 2D data array grouped by channel.
 *  Will add startTime and samplingRate info to emitted Chunks.
 * Requires samplingRate parameter unless stream already contains samplingRate in info.
 *
 * @returns {Observable} Chunk
 */
export const chunk = ({
  dataProp = defaultDataProp,
  samplingRate = defaultSamplingRate
} = {}) => source$ =>
  createPipe(
    source$,
    map(samplesArray => ({
      data: groupByChannel(samplesArray, dataProp),
      info: {
        ...samplesArray[0].info,
        startTime: samplesArray[0].timestamp,
        samplingRate: samplesArray[0].samplingRate
          ? samplesArray[0].samplingRate
          : samplingRate
      }
    }))
  );
