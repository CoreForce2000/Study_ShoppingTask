import { StateCreator } from "zustand";
import { getCurrentTime } from "../util/functions";
import { TaskStore } from "./store";

export interface GeneralSlice {
  initializeStoreNavigate: (initFunc: (route: string) => void) => void;
  storeNavigate: (route: string) => void;
  devMode: boolean;
  activateDevMode: () => void;
  slideNumber: number;
  trialNumber: number;
  setSlideNumber: (slide: number) => void;
  setTrialNumber: (trial: number) => void;
  setTrialIndex: (index: number) => void;
  block: number;
  blockName: string;
  phase: number;
  phaseName: string;
  setPhase: (phaseName: string, phaseNumber: number) => void;
  setBlock: (blockName: string, blockNumber: number) => void;
  initialTime: number;
  rtStart: number;
  resetRtStart: () => void;
}

const createGeneralSlice: StateCreator<TaskStore, [], [], GeneralSlice> = (
  set,
  get
) => ({
  storeNavigate: () => {},
  initializeStoreNavigate: (initFunc) =>
    set(() => ({ storeNavigate: initFunc })),
  devMode: false,
  activateDevMode: () => set(() => ({ devMode: true })),
  slideNumber: 0,
  trialNumber: 0,
  setSlideNumber: (slide) =>
    set(() => {
      return { slideNumber: slide };
    }),
  setTrialNumber: (trial) =>
    set(() => {
      return { trialNumber: trial };
    }),
  setTrialIndex: (index) => {
    const state = get();

    state.storeNavigate(`/slide/${state.slideNumber}/${index}`);
  },
  block: 0,
  blockName: "",
  phase: 0,
  phaseName: "",
  setPhase: (phaseName, phaseNumber) =>
    set(() => ({
      phase: phaseNumber,
      phaseName: phaseName,
    })),
  setBlock: (blockName, blockNumber) =>
    set(() => ({ block: blockNumber, blockName: blockName })),

  initialTime: getCurrentTime(),
  rtStart: 0,
  resetRtStart: () => set(() => ({ rtStart: Date.now() })),
});

export default createGeneralSlice;
