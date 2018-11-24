import { PSD, Freqs } from "./psd";
import { Channel } from "./channel";
import { Info } from "./info";

export interface IEpoch {
  data: Array<Channel>;
  timestamp: number;
  psd?: PSD;
  freqs?: Freqs;
  info?: Info;
}
