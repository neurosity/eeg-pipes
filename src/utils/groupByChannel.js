
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
module.exports = samplesBuffer => {

    const channelAmount = samplesBuffer[0].channelData.length;
    const buffer = new Array(channelAmount).fill([]);

    samplesBuffer.forEach(sample => {
        sample.channelData.forEach((channelValue, index) => {
            buffer[index] = [ ...buffer[index], channelValue ];
        });
    });

    return [ ...buffer ];
};