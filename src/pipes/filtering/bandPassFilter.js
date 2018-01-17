import { CalcCascades, IirFilter } from "fili";
import { map } from "rxjs/operators";
import { createPipe } from "../../utils/createPipe";
import { SAMPLE_RATE as defaultSampleRate } from "../../constants";

/**
 * @method bandPassFilter
 * Applies a bandPass filter to a buffer of EEG data
 *
 * @param {Object} options
 * @returns {Observable}
 */
export const bandPassFilter = (
  {
    order = 2,
    characteristic = "butterworth",
    cutoffFrequency = [2, 50],
    sampleRate = defaultSampleRate,
    Fs = sampleRate,
    gain = 0,
    preGain = false
  } = {}
) => source =>
  createPipe(
    source,
    map(channelGroupBuffer => {
      const bandPass = channelGroup => {
        const options = { order, characteristic, Fc, gain, preGain };
        const calc = new CalcCascades();
        const lowCoeffs = calc.lowPass({ ...options, Fc: cutoffFrequency[0] });
        const highCoeffs = calc.highPass({ ...options, Fc: cutoffFrequency[1] });
        const lowPass = new IirFilter(lowCoeffs);
        const highPass = new IirFilter(highCoeffs);

        return lowPass.multiStep(highPass.multiStep(channelGroup));
      };

      return channelGroupBuffer.map(bandPass);
    })
  );
