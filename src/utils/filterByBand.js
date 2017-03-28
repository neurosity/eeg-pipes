
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
        delta: [0.1, 4],
        theta: [4, 7],
        alpha: [7, 14],
        beta: [15, 30],
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
