export const average = list =>
  list.reduce(
    (acc, value) => acc + (Array.isArray(value) ? average(value) : value)
    , 0
  ) / list.length;
