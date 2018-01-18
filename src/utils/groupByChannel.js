
import {
    DATA_PROP as defaultDataProp
} from '../constants';

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
    const channels = samplesBuffer[0][dataProp].length;
    const groups = new Array(channels).fill([]);

    return samplesBuffer.reduce((buffer, sample) => {
        sample[dataProp].forEach((channelValue, index) => {
            buffer[index] = [ ...buffer[index], channelValue ];
        });
        return buffer;
    }, groups);
};
