import { create } from "zustand";
import createDataSlice, { DataSlice } from "./dataSlice";
import createShopSlice, { ShopSlice } from "./shopSlice";

const useTaskStore = create<ShopSlice & DataSlice>()((...a) => ({
  ...createDataSlice(...a),
  ...createShopSlice(...a),
}));

export default useTaskStore;
