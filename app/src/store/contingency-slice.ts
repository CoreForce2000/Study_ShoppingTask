import { StateCreator } from "zustand";
import config from "../assets/configs/config.json";
import { extendArray, generateTrialsArray, Trial } from "../util/functions";
import { Item } from "./shop-slice";
import { TaskStore } from "./store";

export type TrialPhase = "prepare" | "react" | "outcome";

export interface ContingencySlice {
  reactionTime: number;
  setReactionTime: (newReactionTime: number) => void;
  generateSelfOtherSequence: () => void;
  popSelfItem: () => Item | undefined;
  popOtherItem: () => Item | undefined;
  selfItems: Item[];
  otherItems: Item[];
  trialPhase: TrialPhase;
  nextTrialPhase: () => void;
  colorMapping: { self: string; other: string };
  contingencyOrder: Trial[][];
  outcomeImage: string;
  setOutcomeImage: (image: string) => void;
  showImage: boolean;
  setShowImage: (showImage: boolean) => void;
}

const createContingencySlice: StateCreator<
  TaskStore,
  [],
  [],
  ContingencySlice
> = (set, get) => ({
  reactionTime: -1,
  selfItems: [],
  otherItems: [],
  trialPhase: "prepare",
  showImage: false,
  setShowImage: (showImage: boolean) => set(() => ({ showImage: showImage })),
  outcomeImage: "",
  setOutcomeImage: (image: string) => set(() => ({ outcomeImage: image })),
  colorMapping:
    Math.random() < 0.5
      ? { self: "orange", other: "blue" }
      : { self: "blue", other: "orange" },

  contingencyOrder: [0, 0, 0, 0.3, 0.6, 0, 0.3, 0.6].map((prob) =>
    generateTrialsArray(100, 0.6, prob)
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

  setReactionTime: (newReactionTime: number) =>
    set(() => ({ reactionTime: newReactionTime })),
  generateSelfOtherSequence: () =>
    set((state) => {
      const selfItems = Object.values(state.clickedItemTiles)
        .flat()
        .map((tileItem) => tileItem.item);

      const otherItems = state.items.filter(
        (item) =>
          !config.experimentConfig.excludeFromOtherTrolley.includes(
            item.category
          )
      );
      console.log("othersCategories", otherItems);

      return {
        selfItems: extendArray(
          selfItems.length === 0 ? ["Art/Art_1.jpeg"] : selfItems,
          100 * 8,
          true
        ),
        otherItems: extendArray(otherItems, 100 * 8, true),
      };
    }),
  nextTrialPhase: () =>
    set((state) => {
      const nextTrialPhase =
        state.trialPhase === "prepare"
          ? "react"
          : state.trialPhase === "react"
          ? "outcome"
          : "prepare";

      return { trialPhase: nextTrialPhase };
    }),
});

export default createContingencySlice;
