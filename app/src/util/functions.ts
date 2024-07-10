import config from "../assets/configs/config.json";
import { TaskStore } from "../store/store";

export function getCurrentTime() {
  const currentTime = new Date().getTime() / 1000;
  return currentTime;
}

export function isScrollAreaAtBottom(
  element: HTMLElement,
  bottomBuffer: number = 0
) {
  return (
    element.scrollTop + element.clientHeight + bottomBuffer >=
    element.scrollHeight
  );
}

export function shuffleArray(array: any): any[] {
  for (let i = array.length - 1; i > 0; i--) {
    // Generate a random index
    const j = Math.floor(Math.random() * (i + 1));

    // Swap elements at i and j
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function shuffledBinaryArray<T>(
  val1: T,
  val2: T,
  freqVal1: number,
  n: number
): T[] {
  const numVal1 = Math.floor(n * freqVal1);
  const numVal2 = n - numVal1;

  const array = [...Array(numVal1).fill(val1), ...Array(numVal2).fill(val2)];

  return shuffleArray(array);
}

export function extendArray(
  originalArray: any[],
  targetLength: number,
  shuffle: boolean = false
): any[] {
  return Array(Math.ceil(targetLength / originalArray.length))
    .fill(originalArray)
    .map((array) => (shuffle ? shuffleArray(array) : array))
    .slice(0, targetLength)
    .flat();
}

function leftExclusive(left: any[], right: any[]): any[] {
  return left.filter((l) => !right.includes(l));
}

function sumArray(numbers: number[]) {
  return numbers.reduce(
    (accumulator: number, currentValue: number) => accumulator + currentValue,
    0
  );
}

function transpose(matrix: any[][]) {
  // Determine the maximum row length
  const maxRowLength = Math.max(...matrix.map((row) => row.length));

  // Initialize the transposed matrix with empty arrays
  const transposedMatrix: any[][] = Array.from(
    { length: maxRowLength },
    () => []
  );

  // Iterate over the original matrix and fill the transposed matrix
  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      transposedMatrix[col][row] = matrix[row][col];
    }
  }

  // Remove any undefined values from the transposed matrix
  for (let col = 0; col < transposedMatrix.length; col++) {
    transposedMatrix[col] = transposedMatrix[col].filter(
      (value) => value !== undefined
    );
  }

  return transposedMatrix;
}

export function pseudorandomize(
  categories: string[],
  leftShift: number = 4
): string[] {
  function shiftArray(arr: any[], shift: number) {
    const len = arr.length;
    const effectiveShift = shift % len;
    if (effectiveShift === 0) return arr.slice(); // No shift needed

    const shiftedPart = arr.slice(effectiveShift);
    const remainderPart = arr.slice(0, effectiveShift);
    return shiftedPart.concat(remainderPart);
  }

  function shiftedRepeats(arr: any[], repeats: number) {
    return Array(repeats)
      .fill(0)
      .map((_, repeat) => shiftArray(arr, repeat * leftShift));
  }

  const pathCat = config.shop.pathologicalCategories;
  const otherCategories = leftExclusive(
    categories,
    pathCat.categories.map((x) => x.items).flat()
  );

  const partsOther =
    10 - sumArray(pathCat.categories.map((x) => x.partsPerTen));

  const tenRows = [
    ...Object.keys(pathCat.categories)
      .map((_, index) =>
        shiftedRepeats(
          pathCat.categories[index].items,
          pathCat.categories[index].partsPerTen
        )
      )
      .flat(),

    ...shiftedRepeats(otherCategories, partsOther),
  ];

  // longestrow
  const longestRowLength = Math.max(...tenRows.map((row) => row.length));

  const normalizedTenRows = tenRows.map((row) =>
    extendArray(row, longestRowLength).slice(0)
  );

  const transposedTenRows = transpose(normalizedTenRows);

  const randomizedTenRows = transposedTenRows.map((row) => shuffleArray(row));

  const finalShuffledList = randomizedTenRows.flat();

  const finalShuffledListInitialScreen =
    config.shop.pathologicalCategories.initialScreenCategories.concat(
      finalShuffledList
    );

  const mixedList = shuffleArray(
    finalShuffledListInitialScreen.slice(0, 35)
  ).concat(finalShuffledListInitialScreen.slice(35));

  return mixedList;
}

type TimingRange = {
  minValue: number;
  maxValue: number;
};

export default class RandomValueRange {
  range: TimingRange;

  constructor(range: TimingRange) {
    this.range = range;
  }

  getRandomValue(): number {
    const { minValue, maxValue } = this.range;

    if (minValue === maxValue) {
      return minValue; // If min and max are equal, return the value
    }

    // Ensure minValue is less than maxValue
    const min = Math.min(minValue, maxValue);
    const max = Math.max(minValue, maxValue);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

export function generateUniqueID(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let uniqueID = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    uniqueID += characters.charAt(randomIndex);
  }
  return uniqueID;
}

export function addUnique(array: any[], item: any) {
  if (!array.includes(item)) {
    return [...array, item];
  }
  return array;
}

export function unique(array: any[]) {
  return array.filter((item, index) => array.indexOf(item) === index);
}

export function exportCsv(store: TaskStore, suffix: string = "") {
  const csvString = store.getCsvString();

  //nameing: participantId_SHOP_date
  const fileName = `${
    store.data.survey.participantId
  }_SHOP_${new Date().toLocaleDateString()}`;

  const encodedUri = encodeURI(csvString);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", fileName + suffix + ".csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function sortObjectByKeys(
  row: any,
  columns: string[]
): { [s: string]: unknown } | ArrayLike<unknown> {
  const sortedRow: { [s: string]: unknown } = {};
  columns.forEach((column) => {
    sortedRow[column] = row[column];
  });
  return sortedRow;
}
//
//
// Data Collection
//
//
