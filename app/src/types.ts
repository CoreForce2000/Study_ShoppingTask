// Define TypeScript interfaces for the configuration object
interface TimingValue {
  phase1: number;
  phase3: number;
}

interface AlarmBell {
  time: number;
  itemsLessOrEqualTo: number;
}

interface ShopGeneral {
  time: TimingValue;
  initialBudget: number;
  alarmBell: {
    phase1: AlarmBell[];
    phase3: AlarmBell[];
  };
  alarmBellDuration: number;
  repeatCategories: number;
  useMinimumPriceBelow: number;
}

interface ShopRandomization {
  initialScreenCategories: string[];
  numberOfItemTiles: number;
}

interface ShopColors {
  backgroundColor: string;
  lineColor: string;
  categoryTileColor: string;
  clickedCategoryTileColor: string;
  itemTileColor: string;
  checkboxColorInCart: string;
  backButtonColor: string;
  addToCartButtonColor: string;
}

interface PathologicalCategories {
  addiction: string[];
  sex: string[];
  gaming: string[];
}

interface ShopConfig {
  general: ShopGeneral;
  randomization: ShopRandomization;
  pathologicalCategories: PathologicalCategories;
  colors: ShopColors;
}

interface MemoryQuestionConfig {
  phase3Person: string[];
  phase3ShoppingListOptions: string[][];
  phase3ShoppingList: string[];
}

interface RandomValueRange {
  minValue: number;
  maxValue: number;
}

interface Trial {
  trialType: string;
  numberOfTrials: {
    self: number;
    other: number;
  };
}

interface Probabilities {
  pressButton: number;
  noPressButton: number;
}

interface ExperimentConfig {
  backgroundColor: string;
  trialSequence: Trial[];
  slideTimings: {
    offLightbulb: RandomValueRange;
    offLightbulb2: RandomValueRange;
    coloredLightbulb: RandomValueRange;
    receiveItem: RandomValueRange;
    offLightbulbNoItem: RandomValueRange;
  };
  inputKey: string;
  probabilities: {
    nonDegraded: Probabilities;
    partiallyDegraded: Probabilities;
    fullyDegraded: Probabilities;
  };
}

export interface FullConfig {
  shop: ShopConfig;
  memoryQuestion: MemoryQuestionConfig;
  experimentConfig: ExperimentConfig;
}
