import { StateCreator } from "zustand";
import config from "../assets/configs/config.json";
import { shuffledBinaryArray } from "../util/functions";
import { TaskStore } from "./store";

export interface Trial {
  color?: string;
  spacePressedCorrect?: boolean;
  noSpacePressedCorrect?: boolean;
  questions: boolean;
}

function generateTrialsArray(
  numBlocks: number,
  numTrialsPerBlock: number
): Trial[] {
  const trialArray: Trial[] = [];

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
      ...lightColor.map((value, index) => ({
        color: value,
        spacePressedCorrect: spacePressedCorrect[index],
        noSpacePressedCorrect: noSpacePressedCorrect[index],
        questions: false,
      }))
    );
    trialArray.push({ questions: true });
  }
  console.log("trialArray", trialArray);
  return trialArray;
}

export interface ContingencySlice {
  block: number;
  trial: number;
  setBlock: (block: number) => void;
  setTrial: (trial: number) => void;
  colorMapping: { self: string; other: string };
  contingencyOrder: Trial[];
}

const createContingencySlice: StateCreator<
  TaskStore,
  [],
  [],
  ContingencySlice
> = (set) => ({
  block: 1,
  trial: 1,
  setBlock: (block: number) => set(() => ({ block: block })),
  setTrial: (trial: number) => set(() => ({ trial: trial })),

  colorMapping:
    Math.random() < 0.5
      ? { self: "orange", other: "blue" }
      : { self: "blue", other: "orange" },

  contingencyOrder: generateTrialsArray(
    config.experimentConfig.trialSequence.length,
    config.experimentConfig.numberOfTrials
  ),
});

export default createContingencySlice;
