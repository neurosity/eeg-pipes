
const _ = require('lodash');

/**
 * @method isBuffer
 * Returns a boolean based on whether or not the 
 * sampleBuffer provider is a valid buffer.
 * 
 * @param {any} samplesBuffer array of samples
 * @param {any} channelDataByChannel
 */
module.exports = buffer => {

    if (Array.isArray(buffer) && !buffer.length) {
        return true;
    }

    const sampleKeys = [
        'accelData',
        'channelData',
        'auxData',
        'sampleNumber',
        'startByte',
        'stopByte',
        'rawPacket',
        '_count'
    ];

    const sample = buffer[0];
    const bufferKeys = Object.keys(sample);

    return Array.isArray(buffer)
        && _.isEqual(bufferKeys.sort(), sampleKeys.sort());
};
