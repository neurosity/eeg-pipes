import { map } from "rxjs/operators";
import { createPipe } from "../../utils/createPipe";

import { DATA_PROP as defaultDataProp } from "../../constants";

/**
 * @method removeChannels
 * Removes channels from stream based on channel number (indexed at one)
 *
 * @param {Object} options
 * @returns {Observable} sample
 */
export const removeChannels = (
  { channels = [], dataProp = defaultDataProp } = {}
) => source =>
  createPipe(
    source,
    map(sample => {
      const channelData = sample[dataProp].filter(
        (channel, index) => !channels.includes(index + 1)
      );

      return {
        ...sample,
        [dataProp]: channelData
      };
    })
  );
