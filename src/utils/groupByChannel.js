import { DATA_PROP as defaultDataProp } from "../constants";

/**
 * Get a 2D data array organized by channel from an array of Samples. Credit to Ken from Seattle's elegant transposition
 * http://www.codesuck.com/2012/02/transpose-javascript-array-in-one-line.html
 * @method groupByChannel
 * @param {Array<Sample>} samplesBuffer Array of Samples to be grouped
 * @param {string} [dataProp] Name of the key associated with EEG data
 * @returns {Array<Array<number>>}
 */

export const groupByChannel = (samplesBuffer, dataProp = defaultDataProp) =>
  samplesBuffer[0][dataProp].map((_, channelIndex) =>
    samplesBuffer.map(sample => sample[dataProp][channelIndex])
  );
