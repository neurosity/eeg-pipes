import { map } from "rxjs/operators";

import { createPipe } from "../../utils/createPipe";

import { standardDeviation } from "../../utils/stats";

import { DATA_PROP as defaultDataProp } from "../../constants";

/**
 * @method addSignalQuality
 * Adds a signal quality property to an epoch that contains standard deviations for all channels
 *
 * @param {Object} options
 * @returns {Observable} epoch
 */
export const addSignalQuality = ({
  dataProp = defaultDataProp
} = {}) => source =>
  createPipe(
    source,
    map(epoch => ({
      ...epoch,
      signalQuality: epoch[dataProp].map(standardDeviation)
    }))
  );
