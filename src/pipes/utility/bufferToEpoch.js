import { map } from "rxjs/operators";

import { createPipe } from "../../utils/createPipe";
import { groupByChannel } from "../../utils/groupByChannel";

import {
    DATA_PROP as defaultDataProp,
    SAMPLING_RATE as defaultSamplingRate
} from "../../constants";

/**
 * Takes an array or RxJS buffer of EEG Samples and returns an Epoch.
 * @method bufferToEpoch
 * @example eeg$.pipe(bufferTime(1000), bufferToEpoch({ samplingRate: 256 }))
 *
 * @param {Object} options - Data structure options
 * @param {number} [options.samplingRate] Sampling rate
 * @param {string} [options.dataProp='data'] Name of the key associated with eeg data
 *
 * @returns {Observable<Epoch>}
 */
export const bufferToEpoch = ({
    samplingRate = defaultSamplingRate,
    dataProp = defaultDataProp
} = {}) => source$ =>
    createPipe(
        source$,
        map(samplesArray => ({
            [dataProp]: groupByChannel(samplesArray, dataProp),
            info: {
                ...(samplesArray[0] && samplesArray[0].info
                    ? samplesArray[0].info
                    : {}),
                startTime: samplesArray[0].timestamp,
                samplingRate:
                    samplesArray[0].info && samplesArray[0].info.samplingRate
                        ? samplesArray[0].info.samplingRate
                        : samplingRate
            }
        }))
    );
