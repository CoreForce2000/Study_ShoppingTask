import { create } from "zustand";
import createDataSlice, { DataSlice } from "./data-slice";
import createShopSlice, { ShopSlice } from "./shop-slice";

export interface TaskStore extends ShopSlice, DataSlice {
  slide: number;
  setSlide: (slide: number) => void;
}

const useTaskStore = create<TaskStore>()((...a) => ({
  slide: 0,
  setSlide: (slide) => {
    a[0](() => ({ slide: slide }));
  },
  ...createDataSlice(...a),
  ...createShopSlice(...a),
}));

export default useTaskStore;
