import { create } from "zustand";
import createContingencySlice, { ContingencySlice } from "./contingency-slice";
import createDataSlice, { DataSlice } from "./data-slice";
import createGeneralSlice, { GeneralSlice } from "./general-slice";
import createShopSlice, { ShopSlice } from "./shop-slice";

export interface TaskStore
  extends GeneralSlice,
    ShopSlice,
    DataSlice,
    ContingencySlice {}

const useTaskStore = create<TaskStore>()((...a) => ({
  ...createGeneralSlice(...a),
  ...createDataSlice(...a),
  ...createShopSlice(...a),
  ...createContingencySlice(...a),
}));

export default useTaskStore;
export const taskStore = useTaskStore;
