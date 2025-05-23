import imageData from "../assets/categories/image_data.json";
import genericCategoryMapping from "../assets/configs/category_mapping.json";
import config from "../assets/configs/config.json";
import { TaskStore } from "../store/store";
import { IMAGE_BASE_PATH } from "./constants";

export const preloadImage = (path: string) => {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve(img);
    };
    img.onerror = (error) => {
      console.error(`Failed to load image at ${path}:`, error);
      reject(error);
    };
    img.src = path;
  });
};

export const getGenericCategory = (category: string) => {
  const genericCategory = genericCategoryMapping.find(
    (mappedCategory) =>
      mappedCategory.name.toLowerCase() === category.toLowerCase()
  )?.genericCategory;
  if (!genericCategory) {
    throw new Error(`No generic category found for ${category}`);
  }
  return genericCategory!;
};

export const getImagePath = (category: string, imageName: string) => {
  return IMAGE_BASE_PATH + category + "/" + imageName;
};

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

export function printObjectMatrix(
  matrix: {
    color: any;
    spacePressedCorrect: any;
    noSpacePressedCorrect: any;
  }[][]
): void {
  if (matrix.length === 0) {
    console.log("Empty matrix");
    return;
  }

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      const cell = matrix[i][j];
      const cellStr =
        `i=${i}, j=${j} => ` +
        `color: ${cell.color}, ` +
        `space: ${cell.spacePressedCorrect}, ` +
        `noSpace: ${cell.noSpacePressedCorrect}`;
      console.log(cellStr);
    }
  }
}

export interface Trial {
  color: string;
  spacePressedCorrect: boolean;
  noSpacePressedCorrect: boolean;
}
export function generateTrialsArray(
  numTrials: number,
  probabilityGetItemPress: number,
  probabilityGetItemNoPress: number
): Trial[] {
  const lightColor = shuffledBinaryArray("orange", "blue", 0.5, numTrials);
  const spacePressedCorrect = shuffledBinaryArray(
    true,
    false,
    probabilityGetItemPress,
    numTrials
  );
  const noSpacePressedCorrect = shuffledBinaryArray(
    true,
    false,
    probabilityGetItemNoPress,
    numTrials
  );

  const shuffledArray = lightColor.map((value, index) => ({
    color: value,
    spacePressedCorrect: spacePressedCorrect[index],
    noSpacePressedCorrect: noSpacePressedCorrect[index],
  }));

  return shuffledArray;
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

export function sumArray(array: number[]): number {
  return array.reduce((a, b) => a + b, 0);
}

interface InputArray {
  cols: number;
  list: (string | number)[];
}

function listToMatrix<T>(
  list: T[],
  elementsPerSubArray: number,
  numberOfRows: number
): T[][] {
  const matrix: T[][] = [];
  let i: number, k: number;

  for (i = 0, k = -1; i < numberOfRows * elementsPerSubArray; i++) {
    if (i % elementsPerSubArray === 0) {
      k++;
      matrix[k] = [];
    }

    matrix[k].push(list[i % list.length]);
  }

  return matrix;
}

function matrixRandomize(
  arrays: InputArray[],
  rows: number
): (string | number)[][] {
  const matrices = arrays.map((arr) => listToMatrix(arr.list, arr.cols, rows));

  const result = [];
  for (let i = 0; i < rows; i++) {
    result.push(shuffleArray(matrices.map((mat) => mat[i]).flat()));
  }
  return result;
}

export function pseudorandomize(): string[] {
  const specialCategories = config.shop.pathologicalCategories.categories
    .map((cat) => cat.items)
    .flat();
  const specialCategoriesCols = sumArray(
    config.shop.pathologicalCategories.categories.map((cat) => cat.partsPerTen)
  );

  const nonSpecialCategories = [
    ...new Set(imageData.map((item) => item.category)),
  ].filter((x) => !specialCategories.includes(x));

  return matrixRandomize(
    [
      ...config.shop.pathologicalCategories.categories.map((cat) => ({
        cols: cat.partsPerTen,
        list: cat.items,
      })),

      { cols: 10 - specialCategoriesCols, list: nonSpecialCategories },
    ],
    300
  ).flat() as string[];
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

  exportCsvFromString(csvString, fileName + suffix);
}

//export csv from list of Objects (keys as columns, values as rows)
export function exportCsvFromListOfObjects(
  list: Record<string, any>[],
  fileName: string
) {
  const csvString =
    Object.keys(list[0]).join(",") +
    list.map((row) => Object.values(row).join(",")).join("\n");

  exportCsvFromString(csvString, fileName);
}

export function exportCsvFromString(csvString: string, fileName: string) {
  const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvString);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", fileName + ".csv");
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
