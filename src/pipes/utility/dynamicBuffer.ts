import { pipe } from "rxjs";
import { scan, filter, map } from "rxjs/operators";

type Options = {
  minSamples?: number;
  maxSamples: number;
  incrementCountBy?: number;
};

/**
 * Similar to the bufferCount pipe, but the buffer accepts a minimum, maximum number of samples.
 * @method dynamicBuffer
 * @example samples$.pipe(dynamicBuffer({ minSamples: 5, maxSamples: 20, incrementCountBy: 1 }))
 *
 * @param {Object} options - Data structure options
 * @param {number} [options.minSamples] Optional. Minimum number of samples to emit. Defaults to 1.
 * @param {number} [options.maxSamples] Maximum number of samples to emit.
 * @param {number} [options.incrementCountBy] Count of samples to increment by.
 *
 * @returns {Observable<any[]>}
 */
export function dynamicBuffer({
  minSamples,
  maxSamples,
  incrementCountBy
}: Options) {
  const safeIncrementCountBy = incrementCountBy || 1;

  return pipe(
    scan(
      (acc, sample) => {
        const nextBuffer = [...acc.buffer, sample].slice(-maxSamples);

        const nextCountdown =
          acc.emitCountdown === 0
            ? safeIncrementCountBy - 1
            : acc.emitCountdown - 1;

        return {
          emitCountdown: nextCountdown,
          buffer: nextBuffer
        };
      },
      {
        buffer: [],
        emitCountdown: minSamples || safeIncrementCountBy
      }
    ),
    filter(({ emitCountdown }) => emitCountdown === 0),
    map(({ buffer }) => buffer)
  );
}
