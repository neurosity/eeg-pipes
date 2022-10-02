import { Range } from "./range";

export interface ICreateEEG {
  channels?: number;
  samplingRate?: number;
  NaNRange?: Range;
  dataType?: "mock" | "sine";
  sine?: number | null;
}
