# OpenBCI Rx

Reactive Extensions for OpenBCI

#### Getting started
#### Dependencies Prerequisites
> Make sure you have **Node version >= 7.8** installed for development purpose

``` bash
npm install --save openbci-rx
```

#### Examples

Basic usage

``` js
const OpenBCIObservable = require('openbci-rx');

// Same options accepted by 'openbci'
const options = {
    verbose: true,
    simulate: true
};

const brainwaves$ = OpenBCIObservable(options)
    .subscribe(sample =>
        console.log(sample)
    );
```

Adding operators

``` js 
const brainwaves$ = OpenBCIObservable(options)
    .pickChannels(7, 8)
    .toMicrovolts()
    .bufferCount(256) // bins
    .bufferToFFT()
    .alphaRange()
    .subscribe(buffer =>
        console.log(buffer)
    );
```

And now we have a buffer of Alpha waves from channels 7 and 8!

### Operators

All RxJS operators are available. Additionally, the following custom 
operators have been added to make working with EEG data easier.

#### Filtering operators
* pickChannels
* filterChannels
* lowPassFilter
* notchFilter

#### Frequency range operators

Using frequency operators requires a buffer of samples. 
This can be accomplished by using bufferCount or bufferTime operators.

* bufferToFFT
* alphaRange
* betaRange
* deltaRange
* gammaRange
* thetaRange

#### Unit conversion operators
* toMicrovolts

#### Utility operators
* groupByChannel

### Roadmap 

More operators!

#### Detection operators
* detectPeak(voltage)

#### Filtering operators
* bandPassFilter
* vertScaleFilter
* vertAgoFilter
* smoothFilter
* polarityFilter
* maxFrequencyFilter

#### Transformation operators
* toTopo

### License
MIT © [NeuroJS](https://github.com/NeuroJS)
