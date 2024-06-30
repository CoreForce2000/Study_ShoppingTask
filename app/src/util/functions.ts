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

export function shuffleExtendArray(originalArray: any[], targetLength: number) {
  let resultArray = shuffleArray([...originalArray]);

  if (targetLength <= resultArray.length) {
    return resultArray.slice(0, targetLength);
  }

  while (resultArray.length < targetLength) {
    let remainingNeeded = targetLength - resultArray.length;
    let itemsToAdd = shuffleArray([...originalArray]);

    if (itemsToAdd.length > remainingNeeded) {
      itemsToAdd = itemsToAdd.slice(0, remainingNeeded);
    }

    resultArray = resultArray.concat(itemsToAdd);
  }

  return resultArray;
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

export function exportCsv(store: TaskStore) {
  const columns = [
    "Phase",
    "Phase_name",
    "Block_num",
    "Block_name",
    "Shopping_event",
    "Shopping_category",
    "Shopping_item",
    "Shopping_time_stamp",
    "Shopping_time_action",
    "Shopping_price",
    "Shopping_budget",
    "CoDe_cue",
    "CoDe_stimuli_type",
    "CoDe_response",
    "CoDe_outcome",
    "CoDe_item",
    "CoDe_RT",
    "CoDe_VAS",
    "Control_qs_person",
    "Control_qs_item",
    "Control_qs_correct",
    "Control_qs_attempts",
    "Control_qs_RT",
    "Control_event",
    "Control_category",
    "Control_item",
    "Control_time_stamp",
    "Control_time_action",
    "Control_price",
    "Control_budget",
  ];

  // Create a row for demographics
  const demographicsRow = [
    "participantId",
    store.data.survey.participantId,
    "age",
    store.data.survey.age,
    "group",
    store.taskOptions.group,
    "gender",
    store.data.survey.gender,
    "handedness",
    store.data.survey.handedness,
    "onlineShoppingFrequency",
    store.data.survey.onlineShoppingFrequency,
    "test_shopTime",
    store.taskOptions.time,
  ];

  // Create the header row for shop actions
  const shopHeaderRow = columns.join(",");

  // Create the CSV content by combining the demographics row, shop actions header, and data rows
  const csvContent =
    "data:text/csv;charset=utf-8," +
    demographicsRow.join(",") +
    "\n" +
    "\n" +
    shopHeaderRow +
    "\n" +
    store.data.shopAction
      .map((row) => Object.values(sortObjectByKeys(row, columns)).join(","))
      .join("\n");

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "shop_actions.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function sortObjectByKeys(
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
