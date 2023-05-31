import { pipe } from "rxjs";
import { scan, filter, map } from "rxjs/operators";

type Options = {
  maxSamples: number;
  minSamples?: number;
  incrementCountBy: number;
};

/**
 * Similar to rxjs' bufferCount pipe, but the buffer accepts a minimum, maximum number of samples.
 * @method dynamicBuffer
 * @example samples$.pipe(dynamicBuffer({ minSamples: 5, maxSamples: 20, incrementCountBy: 1 }))
 *
 * @param {Object} options - Data structure options
 * @param {number} [options.minSamples] Minimum number of samples to emit
 * @param {string} [options.maxSamples] Maximum number of samples to emit
 * @param {string} [options.incrementCountBy] Count of samples to increment by
 *
 * @returns {Observable<T>}
 */
export function dynamicBuffer({
  minSamples,
  maxSamples,
  incrementCountBy
}: Options) {
  return pipe(
    scan(
      (acc, sample) => {
        const nextBuffer = [...acc.buffer, sample].slice(-maxSamples);

        const nextCountdown =
          acc.emitCountdown === 0
            ? incrementCountBy - 1
            : acc.emitCountdown - 1;

        return {
          emitCountdown: nextCountdown,
          buffer: nextBuffer
        };
      },
      {
        buffer: [],
        emitCountdown: minSamples ?? incrementCountBy
      }
    ),
    filter(({ emitCountdown }) => emitCountdown === 0),
    map(({ buffer }) => buffer)
  );
}
