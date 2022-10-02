import { interval } from "rxjs";
import { map } from "rxjs/operators";

import { ICreateEEG } from "../types/createEEG";

const NUM_CHANNELS = 4;
const SAMPLING_RATE = 256;

let sinCounter = 0;

const createMockRow = (length) =>
  Array.from({ length }, () => Math.random());

const createSineRow = (length, freq, samplingRate) => {
  sinCounter++;
  return Array.from(
    { length },
    () =>
      Math.sin(sinCounter / (samplingRate / freq / (Math.PI * 2))) * 100
  );
};

const injectNaNs = (data, [min, max]) =>
  data.map((value) => (value > min && value < max ? NaN : value));

/*
 * Creates a stream of randomized EEG data that can be used for testing
 */
export const createEEG = ({
  channels = NUM_CHANNELS,
  samplingRate = SAMPLING_RATE,
  NaNRange = [0, 0],
  dataType = "mock",
  sine = 1
}: ICreateEEG = {}) =>
  interval(1000 / samplingRate).pipe(
    map(() => {
      const timestamp = Date.now();
      let row = [];
      if (dataType === "sine") {
        row = createSineRow(channels, sine, samplingRate);
      } else {
        row = createMockRow(channels);
      }
      const data = injectNaNs(row, NaNRange);
      return { timestamp, data };
    })
  );
