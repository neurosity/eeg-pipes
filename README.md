# OpenBCI Rx

Reactive Extensions for OpenBCI

#### Dependencies Prerequisites
> Make sure you have **Node version >= 7.8** installed for development purpose.

#### Getting started

This library works with the following OpenBCI hardware:

* [Cyton](https://github.com/OpenBCI/OpenBCI_NodeJS)
* [Ganglion](https://github.com/OpenBCI/OpenBCI_NodeJS_Ganglion)

Get started by importing the module:

``` bash
npm install --save openbci-rx
```

``` js
const { Cyton, Ganglion } = require('openbci-rx');

// Or with an alias...

const BrainObservable  = require('openbci-rx').Ganglion;
```

#### Examples

Basic usage

``` js
const BrainObservable = require('openbci-rx').Cyton;

// Same options accepted by 'openbci'
const options = {
    verbose: true,
    simulate: true
};

const brainwaves$ = BrainObservable(options)
    .subscribe(sample =>
        console.log(sample)
    );
```

Adding operators

``` js 
const brainwaves$ = BrainObservable(options)
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

#### Detection operators
* detectPeak(voltage)

#### Filtering operators
* pickChannels(i1, i2, i3)
* filterChannels(i1, i2, i3)
* lowPassFilter({ cutoffFrequency })
* notchFilter({ cutoffFrequency })

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
