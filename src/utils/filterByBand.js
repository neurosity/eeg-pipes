
/**
 * @method filterByBand
 * Filters channel group by frequency band. 
 * 
 * @param {any} fftChannelGroupBuffer array of group channels
 * @param {any} bandName 
 * @returns {any} fftChannelGroupBuffer
 */
module.exports = (fftChannelGroupBuffer, bandName) => {

    if (!fftChannelGroupBuffer[0].length) {
        return fftChannelGroupBuffer;
    } 

    const sampleRate = 250;
    const bins = fftChannelGroupBuffer[0].length * 2;

    const frequencyBands = {
        delta: [0.1, 4],
        theta: [4, 7],
        alpha: [7, 14],
        beta: [15, 30],
        gamma: [30, 100]
    };

    const [ min, max ] = frequencyBands[bandName];

    const ranges = new Array(bins / 2)
        .fill()    
        .map((range, index) =>
            Math.ceil(index * (sampleRate / bins))
        );

    const filteredBuffer = fftChannelGroupBuffer
        .map(channel =>
            channel.filter((spectrum, index) =>
                ranges[index] >= min
                && ranges[index] <= max
            )
        );

    const averagedBuffer = [filteredBuffer
        .map(channel =>
            !channel.length
                ? channel
                : channel.reduce((a, b) => a + b) / channel.length
        )];

    return filteredBuffer;
};
