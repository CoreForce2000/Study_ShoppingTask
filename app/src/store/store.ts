import { create } from "zustand";
import { getCurrentTime } from "../util/functions";
import createContingencySlice, { ContingencySlice } from "./contingency-slice";
import createDataSlice, { DataSlice } from "./data-slice";
import createShopSlice, { ShopSlice } from "./shop-slice";

export interface TaskStore extends ShopSlice, DataSlice, ContingencySlice {
  initializeSetTrialIndex: (initFunc: (trialIndex: number) => void) => void;
  setTrialIndex: (trialIndex: number) => void;
  devMode: boolean;
  activateDevMode: () => void;
  slideNumber: number;
  trialNumber: number;
  setSlideNumber: (slide: number) => void;
  setTrialNumber: (trial: number) => void;
  initialTime: number;
}

const useTaskStore = create<TaskStore>()((...a) => ({
  setTrialIndex: () => {},
  initializeSetTrialIndex: (initFunc) =>
    a[0](() => ({ setTrialIndex: initFunc })),
  devMode: false,
  activateDevMode: () => a[0](() => ({ devMode: true })),
  slideNumber: 0,
  trialNumber: 0,
  setSlideNumber: (slide) => a[0](() => ({ slideNumber: slide })),
  setTrialNumber: (trial) => a[0](() => ({ trialNumber: trial })),
  initialTime: getCurrentTime(),
  ...createDataSlice(...a),
  ...createShopSlice(...a),
  ...createContingencySlice(...a),
}));

export default useTaskStore;
