import { create } from "zustand";
import { getCurrentTime } from "../util/functions";
import createContingencySlice, { ContingencySlice } from "./contingency-slice";
import createDataSlice, { DataSlice } from "./data-slice";
import createShopSlice, { ShopSlice } from "./shop-slice";

export interface TaskStore extends ShopSlice, DataSlice, ContingencySlice {
  initializeStoreNavigate: (initFunc: (route: string) => void) => void;
  storeNavigate: (route: string) => void;
  devMode: boolean;
  activateDevMode: () => void;
  slideNumber: number;
  trialNumber: number;
  setSlideNumber: (slide: number) => void;
  setTrialNumber: (trial: number) => void;
  setTrialIndex: (index: number) => void;
  initialTime: number;
}

const useTaskStore = create<TaskStore>()((...a) => ({
  storeNavigate: () => {},
  initializeStoreNavigate: (initFunc) =>
    a[0](() => ({ storeNavigate: initFunc })),
  devMode: false,
  activateDevMode: () => a[0](() => ({ devMode: true })),
  slideNumber: 0,
  trialNumber: 0,
  setSlideNumber: (slide) =>
    a[0](() => {
      console.log("Slide", slide);
      return { slideNumber: slide };
    }),
  setTrialNumber: (trial) =>
    a[0](() => {
      console.log("Trial", trial);
      return { trialNumber: trial };
    }),
  setTrialIndex: (index) => {
    const state = a[1]();

    state.storeNavigate(`/slide/${state.slideNumber}/${index}`);
  },
  initialTime: getCurrentTime(),
  ...createDataSlice(...a),
  ...createShopSlice(...a),
  ...createContingencySlice(...a),
}));

export default useTaskStore;
