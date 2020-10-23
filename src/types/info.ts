import { ChannelNames } from "./channelNames";
import { ISample } from "./sample";
import { IEpoch } from "./epoch";

export interface IInfo {
  samplingRate?: number;
  startTime?: number;
  channelNames?: ChannelNames;
}

export type Info = any;

//export type InfoValue = (info: ISample | IEpoch) => {} | Info;
