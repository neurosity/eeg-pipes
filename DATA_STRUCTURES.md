# Proposed Data Structures

As we develop the library and try to make it easier for others to use, we should formalize the data structures that are used in order to make it easier to understand and interopable with other EEG software (i.e LSL, MNE).

Here, I've presented some examples of EEG data structures in JS that could work for eeg pipes internally. Mostly, these are adapted from LSL and MNE Python.

_Overarching questions_
1. What are we going to do with metadata about the data stream (e.g. sampleRate, channelNames, etc.)? It's not necessary at the basic level for most operators, but for some it is. If we ignore it entirely then the developer is stuck manually entering things like sampleRate, channelCount, into each operator as parameters. Is there some smart way to pass metadata through the pipes or should that be taken care of outside the pipes library in some other part of the developer's application?

2. Epoching EEG data is very important for advanced EEG analysis. Usually for real-time data epoching would be implemented by a Circular Buffer or some other form of dynamic data storage that is continually being drawn from to produce epochs with various degrees of overlap for processing. Should we leave creating a persistent data buffer up to the developer or create a circular buffer operator of our own? Importantly, in contrast with the current bufferCount and bufferTime operators, it would have to maintain some internal state so that it can hold on to some of the data within it every time it fires. 

### Sample: unit of continuous data

This will be our core data structure for continuous EEG data (both filtered and unfiltered). The design for this comes directly from the discussion on the [EEG stream data models repo](https://github.com/NeuroJS/eeg-stream-data-model/issues/1) and the LSL sample.

```js
{
    "data": [Number, ..., Number], // length == numChannels
    "timestamp": <number>
}
```

### Buffer or Chunk or Raw: chunk of continuous data

In many cases, it will be useful to pool a bunch of data together without processing it. Filtering, for example, works best when it's run on a whole chunk of data at once. Based on MNE's example, it might be best to shape this data structure by channel so that time series operations can be performed easily on on arrays that have already been put in the correct order. This structure could also become more lean by exchanging individual timestamps for startTime and sampleRate data

```js
{
    "data": [
        [Number, ... , Number], // length == numSamples
        [Number, ... , Number]
    ], // length == numChannels
    "info": {
        "sampleRate": Number,
        "startTime": Number,
        "chNames": [String, ..., String ] // length == numChannels
    }
}
```

### Power Spectral Density or FFT Buffer: FFT'd data
Probably important to keep all FFT info for the developer downstream. However, I'm not sure exactly how the `fili` FFT works

```js
{
    "psds": [
        [Number, ... , Number] // spectral power; length = freqs.length
    ], // length = numChannels
    "freqs": [Number, ... , Number], // length = fftLength / 2
    "info": {
        "sampleRate", Number,
        "binSize", Number,
        "windowLength", Number,
        "epochLength", Number,
        "startTime", Number
    }
}
```