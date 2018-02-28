const { Observable } = require("rxjs/Observable");
require("rxjs/add/observable/interval");
require("rxjs/add/operator/map");
const parse = require("csv-parse");
const fs = require("fs");

const NUM_CHANNELS = 4;
const SAMPLE_RATE = 256;

// Read example EEG data into Array
const csvData = [];
fs
  .createReadStream("./examples/datasets/muse-lsl.csv")
  .pipe(parse({ auto_parse: true }))
  .on("data", sample => {
    csvData.push(sample.slice(1, 5));
  })
  .on("error", console.log);

/*
 *
 * Creates a stream of pre-recorded EEG data that can be used for testing
 * Note: I wrote this in examples and in CommonJS because to avoid
 * having to bundle fs with Webpack for browser compatibility
 *
 * Data was collected on Muse 2016 with muse-lsl: staring at software 
 */

const createEEGStream = ({ sampleRate = SAMPLE_RATE } = {}) =>
  Observable.interval(1000 / sampleRate).map(interval => ({
    timestamp: Date.now(),
    data: csvData[interval % csvData.length]
  }));

module.exports = createEEGStream;
