import { StateCreator } from "zustand";
import { ShopSlice } from "./shopSlice";

export interface DataSlice {
  data: any;
  updateData: (name: string, value: any) => void;
  logShopAction: (action: any) => void;
  updateDrugCravingData: (drug: string, value: number) => void;
}

const createDataSlice: StateCreator<
  ShopSlice & DataSlice,
  [],
  [],
  DataSlice
> = (set: any) => ({
  data: {},

  updateData: (name: string, value: any) =>
    set((state: any) => ({
      storeData: {
        ...state.storeData,
        [name]: value,
      },
    })),

  logShopAction: (action: any) =>
    set((state: any) => ({
      storeData: {
        ...state.storeData,
        shop: [...state.storeData.shop, action],
      },
    })),

  updateDrugCravingData: (drug: string, value: number) =>
    set((state: any) => {
      const currentDrugCraving = state.storeData.drugCraving || {};
      return {
        storeData: {
          ...state.storeData,
          drugCraving: {
            ...currentDrugCraving,
            [drug]: currentDrugCraving[drug]
              ? [...currentDrugCraving[drug], value]
              : [value],
          },
        },
      };
    }),
});

export default createDataSlice;
