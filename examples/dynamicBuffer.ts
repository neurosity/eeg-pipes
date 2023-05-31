import { createEEG, dynamicBuffer } from "../src";

const MAX_BUFFER_SIZE = 20;

const samples$ = createEEG().pipe(
  dynamicBuffer({
    minSamples: 5,
    maxSamples: MAX_BUFFER_SIZE,
    incrementCountBy: 1
  })
);

const subscription = samples$.subscribe((buffer) => {
  console.log(`Buffer length is ${buffer.length}`);

  if (buffer.length === MAX_BUFFER_SIZE) {
    subscription.unsubscribe();
  }
});
