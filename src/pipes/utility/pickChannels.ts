import { pipe } from "rxjs";
import { map } from "rxjs/operators";

import { DATA_PROP as defaultDataProp } from "../../constants";

/**
 * @method pickChannels
 * Selects channel based on channel number
 *
 * @param {Object} options
 * @returns {Observable} sample
 */
export const pickChannels = ({
  channels = [],
  dataProp = defaultDataProp
} = {}) =>
  pipe(
    map(sample => {
      const channelData = sample[dataProp].filter((channel, index) =>
        channels.includes(index + 1)
      );

      return {
        ...(sample as {}),
        [dataProp]: channelData
      };
    })
  );
