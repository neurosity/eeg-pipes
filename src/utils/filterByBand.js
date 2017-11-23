
import {
    SAMPLE_RATE as sampleRate,
    FREQUENCY_BANDS as frequencyBands
} from '../constants';

/**
 * @method filterByBand
 * Filters channel group by frequency band. 
 * 
 * @param {any} fftChannelGroupBuffer array of group channels
 * @param {any} bandName 
 * @returns {any} fftChannelGroupBuffer
 */
export const filterByBand = (fftChannelGroupBuffer, bandName) => {

    if (!fftChannelGroupBuffer[0].length) {
        return fftChannelGroupBuffer;
    } 

    const bins = fftChannelGroupBuffer[0].length * 2;
    const [ min, max ] = frequencyBands[bandName];

    const ranges = Array.from({ length: bins / 2 },
        (range, index) => Math.ceil(index * (sampleRate / bins))
    );

    const filteredBuffer = fftChannelGroupBuffer
        .map(channel =>
            channel.filter((spectrum, index) =>
                ranges[index] >= min && ranges[index] <= max
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
