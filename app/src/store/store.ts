import { create } from "zustand";
import createContingencySlice, { ContingencySlice } from "./contingency-slice";
import createDataSlice, { DataSlice } from "./data-slice";
import createShopSlice, { ShopSlice } from "./shop-slice";

export interface TaskStore extends ShopSlice, DataSlice, ContingencySlice {
  slide: number;
  setSlide: (slide: number) => void;
  initialTime: number;
}

const useTaskStore = create<TaskStore>()((...a) => ({
  slide: 0,
  setSlide: (slide) => {
    a[0](() => ({ slide: slide }));
  },
  initialTime: new Date().getSeconds(),
  ...createDataSlice(...a),
  ...createShopSlice(...a),
  ...createContingencySlice(...a),
}));

export default useTaskStore;
