// src/atoms.js
import { atom, useAtom } from "jotai";
import jsonConfig from "./assets/configs/config.json";

type StoreGeneral = {
  phase: number;
  slide: number;
};

export const storeGeneralAtom = atom<StoreGeneral>({
  phase: 1,
  slide: 1,
});

type StoreData = {
  survey: any;
  shop: any;
  contingency: any;
};

export const storeDataAtom = atom<StoreData>({
  survey: {},
  shop: {},
  contingency: {},
});

export const useAtomStore = () => {
  const [storeData, setStoreData] = useAtom(storeDataAtom);

  const updateStoreData = (name: any, value: any) => {
    setStoreData((prevStoreData: any) => ({
      ...prevStoreData,
      [name]: value,
    }));
  };

  const logShopAction = (action: any) => {
    setStoreData((prevStoreData: any) => {
      const newStoreData = { ...prevStoreData };
      if ("shop" in newStoreData) {
        newStoreData.shop = [...newStoreData.shop, action];
      } else {
        newStoreData.shop = [action];
      }
      return newStoreData;
    });
  };

  const updateDrugCravingData = (drug: string, value: number) => {
    setStoreData((currentStoreData: any) => {
      const newStoreData = { ...currentStoreData };
      if (drug in newStoreData.drugCraving) {
        newStoreData.drugCraving[drug] = [
          ...newStoreData.drugCraving[drug],
          value,
        ];
      } else {
        newStoreData.drugCraving[drug] = [value];
      }
      return newStoreData;
    });
  };

  return {
    storeData,
    setStoreData,
    logShopAction,
    updateStoreData,
    updateDrugCravingData,
  } as const;
};

// types.ts

// types.ts

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

interface FullConfig {
  shop: ShopConfig;
  memoryQuestion: MemoryQuestionConfig;
  experimentConfig: ExperimentConfig;
}

const configAtom = atom<FullConfig>(jsonConfig);

export const useAtomConfig = () => {
  const [data, setConfig] = useAtom(configAtom);

  const getPhaseValue = (
    value: TimingValue,
    phase: "phase1" | "phase3"
  ): number => {
    return value[phase];
  };

  const updateConfig = (name: keyof FullConfig, value: any) => {
    setConfig((prevConfig: FullConfig) => ({
      ...prevConfig,
      [name]: value,
    }));
  };

  return {
    data,
    setConfig,
    updateConfig,
    getPhaseValue,
  } as const;
};
