import { Range } from "./range";

export interface ICreateEEG {
  channels?: number;
  samplingRate?: number;
  mock?: boolean;
  NaNRange?: Range;
  sine?: boolean | number;
  csv?: any;
}
