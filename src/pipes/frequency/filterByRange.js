
import { map } from 'rxjs/operators';

import { createPipe } from '../../utils/createPipe';

import {
    SAMPLE_RATE as sampleRate
} from '../../constants';

/**
 * @method filterByRange
 * Filters channel group by frequency range. 
 *
 * @param {any} range 
 * @returns {Observable} fftChannelGroupBuffer
 */
export const filterByRange = ([ min = 0.1, max = 100 ]) =>
    source => createPipe(
        source,
        map(fftChannelGroupBuffer => {

            if (!fftChannelGroupBuffer.length || !fftChannelGroupBuffer[0].length) {
                return fftChannelGroupBuffer;
            } 

            const bins = fftChannelGroupBuffer[0].length * 2;

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

        })
    );
