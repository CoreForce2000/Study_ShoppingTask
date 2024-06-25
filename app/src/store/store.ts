import { create } from "zustand";
import createDataSlice, { DataSlice } from "./data-slice";
import createShopSlice, { ShopSlice } from "./shop-slice";

const useTaskStore = create<
  { slide: number; setSlide: (slide: number) => void } & ShopSlice & DataSlice
>()((...a) => ({
  slide: 0,
  setSlide: (slide) => {
    a[0](() => ({ slide: slide }));
  },
  ...createDataSlice(...a),
  ...createShopSlice(...a),
}));

export default useTaskStore;
