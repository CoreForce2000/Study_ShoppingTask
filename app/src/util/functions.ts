import { TaskStore } from "../store/store";

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

export function pseudorandomize(
  nonDrugCategories: string[],
  drugCategories: string[],
  alcoholCategories: string[],
  initialScreenCategories: string[]
): string[] {
  let mixedList: string[] = [];
  let totalLength: number = 300; // or any other number depending on how long you want the mixedList to be

  let drugCounter: number = 0;
  let alcoholCounter: number = 0;
  let nonDrugCounter: number = 0;

  let drugAndInitialScreenCategoriesRand: string[] = shuffleArray(
    initialScreenCategories
  ).concat(shuffleArray(drugCategories));
  let alcoholCategoriesRand: string[] = shuffleArray(alcoholCategories);
  let nonDrugCategoriesRand: string[] = shuffleArray(nonDrugCategories);

  for (let i: number = 0; i < totalLength; i++) {
    if (i % 6 === 0) {
      if (drugCounter < drugAndInitialScreenCategoriesRand.length) {
        mixedList.push(drugAndInitialScreenCategoriesRand[drugCounter++]);
      }
    }

    if (i % 6 === 2) {
      if (alcoholCounter < alcoholCategoriesRand.length) {
        mixedList.push(alcoholCategoriesRand[alcoholCounter++]);
      }
    }

    if (nonDrugCounter < nonDrugCategoriesRand.length) {
      mixedList.push(nonDrugCategoriesRand[nonDrugCounter++]);
    }

    // Reset counters when we've gone through all items in each category
    if (drugCounter === drugAndInitialScreenCategoriesRand.length) {
      drugAndInitialScreenCategoriesRand = shuffleArray(
        initialScreenCategories
      ).concat(shuffleArray(drugCategories));
      drugCounter = 0;
    }
    if (alcoholCounter === alcoholCategoriesRand.length) {
      alcoholCategoriesRand = shuffleArray(alcoholCategories);
      alcoholCounter = 0;
    }
    if (nonDrugCounter === nonDrugCategoriesRand.length) {
      nonDrugCategoriesRand = shuffleArray(nonDrugCategories);
      nonDrugCounter = 0;
    }
  }

  return mixedList;
}

export function shuffleExtendArray(
  originalArray: any[],
  targetLength: number
): any[] {
  return Array(Math.ceil(targetLength / originalArray.length))
    .fill(originalArray)
    .map((array) => shuffleArray(array))
    .slice(0, targetLength)
    .flat();
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

export function exportCsv(store: TaskStore) {
  const csvString = store.getCsvString();

  const encodedUri = encodeURI(csvString);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "shop_actions.csv");
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
