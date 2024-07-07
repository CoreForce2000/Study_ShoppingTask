import { create } from "zustand";
import { getCurrentTime } from "../util/functions";
import createContingencySlice, { ContingencySlice } from "./contingency-slice";
import createDataSlice, { DataSlice } from "./data-slice";
import createShopSlice, { ShopSlice } from "./shop-slice";

export interface TaskStore extends ShopSlice, DataSlice, ContingencySlice {
  devMode: boolean;
  activateDevMode: () => void;
  slide: number;
  setSlide: (slide: number) => void;
  initialTime: number;
}

const useTaskStore = create<TaskStore>()((...a) => ({
  devMode: false,
  activateDevMode: () => a[0](() => ({ devMode: true })),
  slide: 0,
  setSlide: (slide) => {
    a[0](() => ({ slide: slide }));
  },
  initialTime: getCurrentTime(),
  ...createDataSlice(...a),
  ...createShopSlice(...a),
  ...createContingencySlice(...a),
}));

export default useTaskStore;
