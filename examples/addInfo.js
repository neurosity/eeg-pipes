
const { createMockStream, addInfo } = require("../");

const eeg1$ = createMockStream()
    .pipe(
        addInfo({ samplingRate: 250 })
    );

const eeg2$ = createMockStream()
    .pipe(
        addInfo({
            channels: ["FP1", "FP2", "OZ"]
        }),
        addInfo(sample => ({
            channels: sample.info.channels.map((channel, index) => ({
                [index]: channel
            })) 
        }))
    );

eeg2$.subscribe(console.log);
