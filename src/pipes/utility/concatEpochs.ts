import { pipe } from "rxjs";
import { scan } from "rxjs/operators";

/**
 * Concatenates epochs and markers. The markers list is expected to be located at `epoch.info.markers`.
 * @method concatEpochs
 * @example epochs$.pipe(concatEpochs())
 * @returns {Observable} IEpoch
 */
export const concatEpochs = () =>
  pipe(
    scan((acc: any, epoch: any) => {
      for (
        let channelIndex = 0;
        channelIndex < acc.data.length;
        channelIndex++
      ) {
        acc.data[channelIndex].push(...epoch.data[channelIndex]);
      }

      acc.info.markers = Array.isArray(acc.info.markers)
        ? acc.info.markers.concat(...(epoch.info.markers || []))
        : [];

      return acc;
    })
  );
