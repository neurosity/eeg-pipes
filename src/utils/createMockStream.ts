import { createEEG } from "./createEEG";

// Exists for backwards compatibility. Displays deprecation warning.
export const createMockStream = (options = {}) => {
  console.warn(
    "createMockStream will be deprecated in the next major release. Use the createEEG instead."
  );
  return createEEG({
    ...options,
    mock: true
  });
};
