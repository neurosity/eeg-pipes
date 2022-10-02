import { createEEG } from "../src";

// defaults to mock data (randomly generated)
const mock$ = createEEG();

// with NaN range injection
const mockNaN$ = createEEG({
  NaNRange: [0.29, 0.31]
});

const sine$ = createEEG({
  dataType: "sine",
  sine: 1
});

sine$.subscribe(console.log);
