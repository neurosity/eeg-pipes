
const { createMockStream, addInfo } = require('../dist/eeg-pipes.umd');

const eeg1$ = createMockStream()
    .pipe(
        addInfo({ samplingRate: 250 })
    );

const eeg2$ = createMockStream()
    .pipe(
        addInfo(sample => ({
            channels: sample.info.channels.map((channel, index) => ({
                [index]: channel
            })) 
        }))
    );

eeg2$.subscribe(console.log);
