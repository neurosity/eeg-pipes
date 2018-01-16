import { CalcCascades, IirFilter } from "fili";
import { map } from "rxjs/operators";
import { createPipe } from "../../utils/createPipe";
import { SAMPLE_RATE as defaultSampleRate } from "../../constants";

/**
 * @method notchFilter
 * Applies notch filter to a buffer of EEG data
 *
 * @param {Object} options
 * @returns {Observable}
 */
export const notchFilter = (
  {
    order = 2,
    characteristic = "butterworth",
    cutoffFrequency = 50,
    sampleRate = defaultSampleRate,
    nbChannels = 4,
    Fs = sampleRate,
    Fc = cutoffFrequency,
    gain = 0,
    preGain = false,
    BW = 0.1
  } = {}
) => source$ => {
  var options = {
    order,
    characteristic,
    Fs,
    Fc,
    BW
  };
  var notchFilterGroup = new Array(nbChannels).fill(notchIIR(options));
  return createPipe(
    source$,
    map(channelGroupBuffer =>
      channelGroupBuffer.map((channel, index) =>
        notchFilterGroup[index](channel)
      )
    )
  );
};

// -----------------------------------------------------------------------------
// Helper Functions

// Constructs an IIR bandstop filter from given options and returns a multistep filter function
const notchIIR = options => {
  const calc = new CalcCascades();
  const coeffs = calc.bandstop(options);
  const filter = new IirFilter(coeffs);

  return channel => filter.multiStep(channel);
};
