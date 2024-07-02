import { StateCreator } from "zustand";
import config from "../assets/configs/config.json";
import { shuffleExtendArray, shuffledBinaryArray } from "../util/functions";
import { Item } from "./shop-slice";
import { TaskStore } from "./store";

export interface Trial {
  color: string;
  spacePressedCorrect: boolean;
  noSpacePressedCorrect: boolean;
}

export type TrialPhase = "prepare" | "react" | "outcome";

function generateTrialsArray(
  numBlocks: number,
  numTrialsPerBlock: number
): Trial[][] {
  const trialArray: Trial[][] = [];

  for (let block = 0; block < numBlocks; block++) {
    const lightColor = shuffledBinaryArray(
      "orange",
      "blue",
      0.5,
      numTrialsPerBlock * 2
    );
    const spacePressedCorrect = shuffledBinaryArray(
      true,
      false,
      config.experimentConfig.trialSequence[block].pressButton,
      numTrialsPerBlock * 2
    );
    const noSpacePressedCorrect = shuffledBinaryArray(
      true,
      false,
      config.experimentConfig.trialSequence[block].noPressButton,
      numTrialsPerBlock * 2
    );

    trialArray.push(
      lightColor.map((value, index) => ({
        color: value,
        spacePressedCorrect: spacePressedCorrect[index],
        noSpacePressedCorrect: noSpacePressedCorrect[index],
      }))
    );
  }
  return trialArray;
}

export interface ContingencySlice {
  reacted: boolean;
  setReacted: (newReacted: boolean) => void;
  generateSelfOtherSequence: () => void;
  popSelfItem: () => Item | undefined;
  popOtherItem: () => Item | undefined;
  selfItems: Item[];
  otherItems: Item[];
  trial: number;
  trialPhase: TrialPhase;
  incrementTrial: (incrementSlide: () => void) => void;
  resetTrial: () => void;
  nextTrialPhase: () => void;
  colorMapping: { self: string; other: string };
  contingencyOrder: Trial[][];
}

const createContingencySlice: StateCreator<
  TaskStore,
  [],
  [],
  ContingencySlice
> = (set, get) => ({
  reacted: false,
  selfItems: [],
  otherItems: [],
  trial: 1,
  trialPhase: "prepare",

  colorMapping:
    Math.random() < 0.5
      ? { self: "orange", other: "blue" }
      : { self: "blue", other: "orange" },

  contingencyOrder: generateTrialsArray(
    config.experimentConfig.trialSequence.length,
    config.experimentConfig.numberOfTrials
  ),

  popSelfItem: () => {
    set((state) => ({
      selfItems: state.selfItems.slice(0, -1),
    }));
    return get().selfItems.pop();
  },

  popOtherItem: () => {
    set((state) => ({
      otherItems: state.otherItems.slice(0, -1),
    }));
    return get().otherItems.pop();
  },

  setReacted: (newReacted: boolean) => set(() => ({ reacted: newReacted })),
  generateSelfOtherSequence: () =>
    set((state) => {
      const selfItems = Object.values(state.clickedItemTiles)
        .flat()
        .map((tileItem) => tileItem.item);

      const otherItems = state.items.filter(
        (item) =>
          ![
            ...Object.values(config.shop.pathologicalCategories).flat(),
            ...state.clickedCategories,
          ].includes(item.category)
      );

      return {
        selfItems: shuffleExtendArray(
          selfItems,
          config.experimentConfig.trialSequence.length * 5
        ),
        otherItems: shuffleExtendArray(
          otherItems,
          config.experimentConfig.trialSequence.length * 5
        ),
      };
    }),
  incrementTrial: (incrementSlide) =>
    set((state) => {
      console.log(state.trial);
      if (state.trial < config.experimentConfig.trialSequence.length) {
        return {
          trial: state.trial + 1,
          trialPhase: "prepare",
        };
      } else {
        incrementSlide();
        return {
          trial: 0,
          trialPhase: "prepare",
        };
      }
    }),
  resetTrial: () => set(() => ({ trial: 0 })),
  nextTrialPhase: () =>
    set((state) => ({
      trialPhase:
        state.trialPhase === "prepare"
          ? "react"
          : state.trialPhase === "react"
          ? "outcome"
          : "prepare",
    })),
});

export default createContingencySlice;
