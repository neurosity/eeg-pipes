import { DATA_PROP as defaultDataProp } from "../constants";

/**
 * @method groupByChannel
 * Get a 2D data array organized by channel from an array of Samples
 *
 * @example from [{ ...s0 }, { ...s1 }, ...]
 * to [[c0 ...], [c1 ...], ...]
 *
 * @param {any} samplesBuffer array of samples
 * @param {any} channelDataByChannel
 * 
 * Credit to Ken from Seattle's elegant transposition
 * http://www.codesuck.com/2012/02/transpose-javascript-array-in-one-line.html
 */


export const groupByChannel = (samplesBuffer, dataProp = defaultDataProp) =>
  samplesBuffer[0][dataProp].map((_, channelIndex) =>
    samplesBuffer.map(sample => sample[dataProp][channelIndex])
  );
