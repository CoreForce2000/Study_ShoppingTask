import { StateCreator } from "zustand";
import { ShopSlice } from "./shop-slice";

export interface DataSlice {
  taskOptions: {
    group: string;
    time: string;
  };
  data: {
    survey: any;
    shopAction: any[];
    drugCraving: {
      [key: string]: number[];
    };
  };
  setTaskOption: (name: string, value: any) => void;
  setSurveyResponse: (name: string, value: any) => void;
  logShopAction: (action: any) => void;
  setDrugCraving: (drug: string, value?: number) => void;
}

const createDataSlice: StateCreator<
  ShopSlice & DataSlice,
  [],
  [],
  DataSlice
> = (set) => ({
  taskOptions: {
    group: "",
    time: "",
  },
  data: {
    survey: { gender: "", age: "", participantId: "" },
    shopAction: [],
    drugCraving: {},
  },

  setTaskOption: (name: string, value: any) =>
    set((state) => ({
      taskOptions: {
        ...state.taskOptions,
        [name]: value,
      },
    })),
  setSurveyResponse: (name: string, value: any) =>
    set((state) => ({
      data: {
        ...state.data,
        survey: {
          ...state.data.survey,
          [name]: value,
        },
      },
    })),
  setDrugCraving: (drug: string, value?: number) =>
    set((state) => ({
      data: {
        ...state.data,
        drugCraving: {
          ...state.data.drugCraving,
          [drug]: value ? [...(state.data.drugCraving[drug] || []), value] : [],
        },
      },
    })),

  logShopAction: (action: any) =>
    set((state) => ({
      data: {
        ...state.data,
        shopAction: [...state.data.shopAction, action],
      },
    })),
});

export default createDataSlice;
