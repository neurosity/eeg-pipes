import { CalcCascades, IirFilter } from "fili";
import { map } from "rxjs/operators";

import { createPipe } from "../../utils/createPipe";

import { SAMPLE_RATE as defaultSampleRate } from "../../constants";

/**
 * @method notchFilter
 * Applies notch filter to FFT buffer
 *
 * @param {Object} options
 * @returns {Observable}
 */
export const notchFilter = ({
  order = 2,
  characteristic = "butterworth",
  cutoffFrequency = 50,
  sampleRate = defaultSampleRate,
  nbChannels = 4,
  gain = 0,
  preGain = false,
  BW = 0.1
} = {}) => source$ => {
  const options = {
    order,
    characteristic,
    sampleRate,
    cutoffFrequency,
    gain,
    preGain,
    BW
  };
  const notchFilterGroup = new Array(nbChannels).fill(notchIIR(options));
  console.log(
    "created options object: ",
    options,
    " and filterGroup: ",
    notchFilterGroup
  );

  createPipe(
    source$,
    map(channelGroupBuffer => {
      console.log("mapping through channelGroupBuffer: ", channelGroupBuffer);
      return channelGroupBuffer.map((channelGroup, index) => {
        console.log("mapping through channelGroups: ", channelGroup);
        notchFilterGroup[index];
      });
    })
  );
};

// -----------------------------------------------------------------------------
// Helper Functions

// Constructs an IIR bandstop filter from given options and returns a multistep filter function
const notchIIR = options => {
  const calc = new CalcCascades();
  const coeffs = calc.bandstop(options);
  const filter = new IirFilter(coeffs);

  return filter.multiStep(channelGroup);
};
