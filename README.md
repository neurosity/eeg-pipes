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

``` js
{
  data: [Number, Number, Number, Number], // channels
  timestamp: Date
};
```

We can start by installing the library:

``` bash
npm install --save eeg-pipes
```

Then, importing the pipes from the library:

``` js
import { bufferFFT, alphaRange } from 'eeg-pipes';
```

And adding them to the RxJS observable pipe operator:

``` js
eeg$.pipe(
    bufferFFT({ bins: 256 }),
    alphaRange()
).subscribe(buffer =>
    console.log(buffer)
);
```

### Pipes

#### Filtering
* pickChannels({ channels: [c1, c2, c3] })
* filterChannels({ channels: [c1, c2, c3] })
* lowPassFilter({ cutoffFrequency })
* notchFilter({ cutoffFrequency })

#### Frequency

* bufferFFT({ bins, window, sampleRate })

Using frequency pipes requires a buffer of samples. 
This can be accomplished by using bufferFFT first OR bufferCount/bufferTime.

* alphaRange()
* betaRange()
* deltaRange()
* gammaRange()
* thetaRange()

#### Unit conversion
* toMicrovolts({ log })

#### Utility
* bufferCount()
* bufferTime()
* groupByChannel()

### Coming soon

#### Filtering 
* bandPassFilter()
* vertScaleFilter()
* vertAgoFilter()
* smoothFilter()
* polarityFilter()
* maxFrequencyFilter()
