/**
 * Transpose matrix
 * @method transpose
 * @param {Array[][]} matrix Matrix of values
 * @returns {Array[][]}
 */
export function transpose(matrix: any[][]): any[][] {
  return matrix[0].map((_, rowIndex) =>
    matrix.map((column) => column[rowIndex])
  );
}
