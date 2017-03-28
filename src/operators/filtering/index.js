
const filterChannels = require('./filterChannels');
const notchFilter = require('./notchFilter');
const pickChannels = require('./pickChannels');

module.exports = [
    filterChannels,
    notchFilter,
    pickChannels
];