var Fili = require('fili');
const { addInfo, bufferCount, chunk, notchFilter, safeNotchFilter } = require("../");


//  Instance of a filter coefficient calculator
const iirCalculator = new Fili.CalcCascades();

// calculate filter coefficients
const iirFilterCoeffs = iirCalculator.lowpass({
  order: 3, // cascade 3 biquad filters (max: 12)
  characteristic: "butterworth",
  Fs: 1000, // sampling frequency
  Fc: 100, // cutoff frequency / center frequency for bandpass, bandstop, peak
  BW: 1, // bandwidth only for bandstop and bandpass filters - optional
  gain: 0, // gain for peak, lowshelf and highshelf
  preGain: false // adds one constant multiplication for highpass and lowpass
  // k = (1 + cos(omega)) * 0.5 / k = 1 with preGain == false
});

// create a filter instance from the calculated coeffs
let iirFilter = new Fili.IirFilter(iirFilterCoeffs);

let fakeData = [
  0.7514627308103375,
  0.3772951853462986,
  0.9202528716598576,
  0,
  0.16324260867774387,
  0.5513579529974775
];

let fakeDataWithNaN = [
  0.7514627308103375,
  0.3772951853462986,
  0.9202528716598576,
  null,
  0.16324260867774387,
  0.5513579529974775
];

console.log(iirFilter.multiStep(fakeData));
// create a filter instance from the calculated coeffs
iirFilter = new Fili.IirFilter(iirFilterCoeffs);
console.log(iirFilter.multiStep(fakeDataWithNaN));
console.log(5 + null);
