import { interval } from "rxjs/observable/interval";
import { fromPromise } from "rxjs/observable/fromPromise";
import { map } from "rxjs/operators";

// Code splitting: dynaically importing the csv so it is not included in the main bundle
// @TODO: not working due to https://github.com/webpack/webpack/issues/2471
// export const getMuseCsv = async () =>
//   await importModules("../../dataset", "dataset")
//     .then(module => module.default)
//     .then(csv => 
//       csv.map(row => row.slice(1, 5)) // filter channel data
//     );

const NUM_CHANNELS = 4;
const SAMPLE_RATE = 256;

const createMockRow = length =>
  Array.from({ length }, () => Math.random());

const getCsvRow = (csv, interval) => csv[interval % csv.length];

const injectNaNs = (data, [ min, max ]) =>
  data.map(value => value > min && value < max
    ? NaN
    : value
  );

/*
 * Creates a stream of pre-recorded EEG data that can be used for testing
 * Default data was collected from Muse 2016 with muse-lsl: staring at software 
 */
export const createEEG = ({
  channels = NUM_CHANNELS,
  sampleRate = SAMPLE_RATE,
  mock = false,
  NaNRange = [0, 0]
} = {}) => {
  const startStream = csv => interval(1000 / sampleRate).pipe(
    map(interval => {
      const timestamp = Date.now();
      const row = csv
        ? getCsvRow(csv, interval)
        : createMockRow(channels)
      const data = injectNaNs(row, NaNRange);
      return { timestamp, data };
    })
  );
    
  if (mock) {
    return startStream();
  }
    
  return fromPromise(
    importModules("../../dataset", "dataset")
  );
};
