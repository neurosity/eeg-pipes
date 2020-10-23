import { IFrequencyBands } from "../types/frequencyBands";

export const CHANNELS: number = 4;
export const SAMPLING_RATE: number = 256;
export const EPOCH_DURATION: number = 256;
export const EPOCH_INTERVAL: number = 100;
export const ORDER: number = 2;
export const NOTCH_BW: number = 0.5;
export const CHARACTERISTIC: string = "butterworth";
export const GAIN: number = 0;
export const PREGAIN: boolean = false;
export const FFT_BINS: number = 256;
export const DATA_PROP: string = "data";
export const USE_LOG: boolean = false;
export const FREQUENCY_BANDS: IFrequencyBands = {
  delta: [0.1, 4],
  theta: [4, 7.5],
  alpha: [7.5, 12.5],
  beta: [12.5, 30],
  gamma: [30, 100]
};
