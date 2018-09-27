## EEG Pipes

#### By Neurosity

Blazing fast EEG transformers implemented as "Pipeable" RxJS operators for Node and the Browser.

Features include:

- FFT
- PSD and Power Bands
- Buffering and Epoching
- IIR Filters
- Signal Quality (new)
- and more.

[Read full documentation](https://neurosity.github.io/eeg-pipes)

Get started by installing the library:

```
npm install @neurosity/pipes
```

## Usage

An Observable of EEG data is required to work with pipes. This can be done by using `fromEvent` from RxJS in order to push callback events into an Observable stream.

Given a callback-driven API such as:

```js
bci.on("data", () => { ... });
```

Then...

```js
import { fromEvent } from "rxjs";

const eeg$ = fromEvent(bci, "data");
```

Now we have an Observable of EEG data that support Pipeable operators.

```js
eeg$
  .pipe
  // ...
  ()
  .subscribe();
```

The following are some libraries that provide EEG as RxJS observables out of the box:

- [OpenBCI Ganglion Web Bluetooth](https://github.com/neurosity/ganglion-ble)
- [OpenBCI Cyton/Ganglion](https://github.com/neurosity/openbci-observable)
- [Muse Web Bluetooth](https://github.com/urish/muse-js)

Pipes can be added to an EEG observable of EEG data samples with the
following data structure:

```js
{
  data: [Number, Number, Number, Number], // channels
  timestamp: Date,
  info?: {
  	samplingRate?: Number,
  	channelNames?: [String, String, String, String],
  	..
  }
};
```

Individual samples of EEG data contain an array of values for each EEG channel as well as a timestamp. An additional info object containing metadata about the EEG stream such as sampling rate and channel names can also be included or added with the addInfo operator.

Import the pipes from the module:

```js
import { epoch, fft, alphaPower } from "@neurosity/pipes";
```

Add to RxJS observable pipe:

```js
eeg$
  .pipe(
    epoch({ duration: 256, interval: 100 }),
    fft({ bins: 256 }),
    alphaPower()
  )
  .subscribe(alphaPower => console.log(alphaPower));
```

## Pipes

### Filtering (IIR)

Filter pipes can be applied to both samples or buffers of samples. Filters are linear IIR filters using a digital biquad implementation.

- lowpassFilter({ nbChannels, cutoffFrequency })
- highpassFilter({ nbChannels, cutoffFrequency })
- bandpassFilter({ nbChannels, cutoffFrequencies: [lowBound, highBound] })
- notchFilter({ nbChannels, cutoffFrequency })

Optional Parameters:  
`characteristic`: 'butterworth' or 'bessel'. Default is butterworth characteristic because of its steeper cutoff  
`order`: the number of 2nd order biquad filters applied to the signal. Default is 2.  
`samplingRate`: should match the samplingRate of your EEG device. Default is 250

### Frequency

- bufferFFT({ bins, window, samplingRate })
- alphaPower()
- betaPower()
- deltaPower()
- gammaPower()
- thetaPower()
- averagePower()
- sliceFFT([ min, max ])
- powerByBand()

#### Unit conversion

- voltToMicrovolts({ useLog })

#### Utility

- epoch({ duration, interval, samplingRate })
- bufferCount()
- bufferTime()
- bufferToEpoch({ samplingRate })
- pickChannels({ channels: [c1, c2, c3] })
- removeChannels({ channels: [c1, c2, c3] })
- addInfo()
- addSignalQuality()
  - signal quality is represented as standard deviation value for each channel

### Coming soon

#### Filtering

- vertScaleFilter()
- vertAgoFilter()
- smoothFilter()
- polarityFilter()
- maxFrequencyFilter()

## Data Structures

### Sample

This is the simplest, core data structure for individual samples of EEG data. Samples have a data array containing a single reading from a number of different EEG electrodes along with a single timestamp. Samples can also contain optional other parameters added by the `addInfo` operator. The design for this comes directly from the discussion on the [EEG stream data models repo](https://github.com/NeuroJS/eeg-stream-data-model/issues/1).

```js
{
    data: [Number, ..., Number], // length == nbChannels
    timestamp: <Number>,
    info?: {
  	  samplingRate?: Number,
  	  channelNames?: [String, String, String, String],
  	...
  }
}
```

### Epoch

An Epoch represents the EEG data that has been collected over a specific period of time. They can be produced by using either the `epoch` operator or by using a standard RxJS buffering operator such as `bufferTime` followed by the `bufferToEpoch` operator. Collecting data in this way is necessary for performing frequency-based analyses and, in many cases, will improve performance of filtering and other downstream operations. Epochs contain a 2D data array (channels x samples) and an info object that always includes samplingRate and startTime data so that the timestamps of individual samples can be derived.

```js
{
    data: [
        [Number, ... , Number], // length == duration
        [Number, ... , Number]
    ], // length == nbChannels
    info: {
        samplingRate: Number,
        startTime: Number,
        channelNames?: [String, ..., String ]
    }
}
```

### Power Spectral Density or PSD: Proposed Work in Progress

A PSD represents the absolute power of different frequency bins in an Epoch of EEG data. PSDs are produced by applying the `fft` operator to Epochs or using the `bufferFFT` operator directly on a stream of EEG Samples. PSDs contain an array of frequencies and a corresponding array of spectral power at each of those frequencies, as well as an info object that contains samplingRate and startTime info similarly to Epochs.

```js
{
    psd: [
        [Number, ... , Number] // spectral power; length = freqs.length
    ], // length = numChannels
    freqs: [Number, ... , Number], // length = fftLength / 2
    info: {
        samplingRate: Number,
        startTime: Number,
        channelNames?: [String, ..., String ]
    }
}
```

## Generating documentation

To generate the docs, run `yarn esdoc`
