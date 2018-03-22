import { map } from "rxjs/operators";

import { average } from "../../utils";

/**
 * @method averageDeep
 * Averages list of values including deep lists, to a single value
 *
 * @returns {Observable} average
 */
export const averageDeep = () =>
  map(channels => average(channels));