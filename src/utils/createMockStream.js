
import { interval } from 'rxjs/observable/interval';
import { map } from 'rxjs/operators';

import {
    SAMPLE_RATE as defaultSampleRate,
    CHANNELS as defaultChannels
} from '../constants';

export const createMockStream = ({ channels = defaultChannels, sampleRate = defaultSampleRate } = {}) =>
    interval(1000 / sampleRate).pipe(
        map(() => ({
            timestamp: Date.now(),
            data: Array.from({ length: channels }, Math.random)
        }))
    );
    