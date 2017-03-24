
/**
 * @method filterByBand
 * Filters channel group by frequency band. 
 * 
 * @param {any} fftChannelGroupBuffer array of group channels
 * @param {any} bandName 
 * @returns {any} fftChannelGroupBuffer
 */
module.exports = (fftChannelGroupBuffer, bandName) => {

    const frequencyBands = {
        delta: [1, 3],
        theta: [4, 8],
        alpha: [8, 12],
        beta: [13, 30],
        gamma: [30, 100]
    };

    const [ min, max ] = frequencyBands[bandName];

    filteredBuffer = fftChannelGroupBuffer.map(channelGroup => {
        return channelGroup.filter(channelValue => {
            return channelValue >= min
                && channelValue <= max;
        });
    });

    return filteredBuffer;
};
