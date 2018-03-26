# EEG Pipes

Pipeable RxJS operators for working with EEG data in Node and the Browser

#### Usage

Before getting started, you'll need an observable of EEG data.

The following are some libraries that provide exactly that:

* [OpenBCI Ganglion BLE (Browser)](https://github.com/alexcastillo/ganglion-ble)
* [OpenBCI Cyton/Ganglion (Node)](https://github.com/alexcastillo/openbci-rx)
* [Muse (Browser)](https://github.com/urish/muse-js)

Pipes can be added to an EEG observable of EEG data samples with the
following data structure:

```js
{
  data: [Number, Number, Number, Number], // channels
  timestamp: Date
};
```

We can start by installing the library:

```bash
npm install --save eeg-pipes
```

Then, importing the pipes from the library:

```js
import { bufferFFT, alphaPower } from "eeg-pipes";
```

And adding them to the RxJS observable pipe operator:

```js
eeg$
  .pipe(bufferFFT({ bins: 256 }), alphaPower())
  .subscribe(buffer => console.log(buffer));
```

### Pipes

#### Filtering (IIR)

Filter pipes can be applied to both samples or buffers of samples. Filters are linear IIR filters using a digital biquad implementation.

* lowpassFilter({ nbChannels, cutoffFrequency })
* highpassFilter({ nbChannels, cutoffFrequency })
* bandpassFilter({ nbChannels, cutoffFrequencies: [lowBound, highBound] })
* notchFilter({ nbChannels, cutoffFrequency })

Optional Parameters:  
`characteristic`: 'butterworth' or 'bessel'. Default is butterworth characteristic for its steeper cutoff  
`order`: the number of 2nd order biquad filters applied to the signal. Default is 2.  
`samplingRate`: should match the samplingRate of your EEG device. Default is 250

#### Frequency

* bufferFFT({ bins, window, sampleRate })
* alphaPower()
* betaPower()
* deltaPower()
* gammaPower()
* thetaPower()
* averagePower()
* sliceFFT([ min, max ])
* powerByBand()

#### Unit conversion

* toMicrovolts({ log })

#### Utility

* bufferCount()
* bufferTime()
* chunk()
* pickChannels({ channels: [c1, c2, c3] })
* removeChannels({ channels: [c1, c2, c3] })
* addInfo()

### Coming soon

#### Filtering

* vertScaleFilter()
* vertAgoFilter()
* smoothFilter()
* polarityFilter()
* maxFrequencyFilter()

# Documentation

## Data Structures

#### Sample

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

Individual samples of EEG data contain an array of values for each EEG channel as well as a timestamp. An info object containing important metadata about the EEG stream such as sampling rate and channel names can be added to a pipe of samples with the addInfo operator.

#### Chunk

```js
{
  data: [
    [Number, Number, ...],
    [Number, Number, ...],
    [Number, Number, ...],
    [Number, Number, ...],
  ], // nbChannels x nbSamples 
  info: {
    samplingRate: Number,
    startTime: Number,
    ...
  }
}
```

Samples that have been pooled together by a buffering operator such as bufferTime or bufferCount contain a 2D data array with shape nbChannels x nbSamples. Instead of individual timestamps for each sample, Chunk objects contain samplingRate and startTime information in the info object in order to allow time at any point within the Chunk to be inferred. Info properties present in Sample objects before being pooled into Chunks will be maintained.
