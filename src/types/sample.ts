import { Channels } from "./channel";
import { Info } from "./info";

export interface ISample {
  data: Channels;
  timestamp: number;
  info?: Info;
}
