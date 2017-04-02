
const filterChannels = require('./filterChannels');
const lowPassFilter = require('./lowPassFilter');
const notchFilter = require('./notchFilter');
const pickChannels = require('./pickChannels');

module.exports = [
    filterChannels,
    lowPassFilter,
    notchFilter,
    pickChannels
];