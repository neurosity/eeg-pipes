import { DATA_PROP as defaultDataProp } from "../constants";

/**
 * @method groupByChannel
 * Group sample buffer by Channels.
 *
 * @example from [{ ...s0 }, { ...s1 }, ...]
 * to [[c0 ...], [c1 ...], ...]
 *
 * @param {any} samplesBuffer array of samples
 * @param {any} channelDataByChannel
 */
export const groupByChannel = (samplesBuffer, dataProp = defaultDataProp) => {
  const nbChannels = samplesBuffer[0][dataProp].length;
  const nbSamples = samplesBuffer.length;
  const groups = new Array(nbChannels).fill(new Array(nbSamples));

  return samplesBuffer.reduce((buffer, sample, sampleIndex) => {
    sample[dataProp].forEach((channelValue, channelIndex) => {
      buffer[channelIndex][sampleIndex] = channelValue;
    });
    return buffer;
  }, groups);
};
