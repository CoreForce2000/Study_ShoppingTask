import { StateCreator } from "zustand";
import { TaskStore } from "./store";

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

const createDataSlice: StateCreator<TaskStore, [], [], DataSlice> = (set) => ({
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
        shopAction: [
          ...state.data.shopAction,
          {
            Phase: 1,
            Phase_name: "Shopping",
            Block: 1,
            Block_name: "shopping",
            Trial: state.data.shopAction.length + 1,
            Shopping_budget: state.budget,
            Shopping_event: action,
            Shopping_item: state.currentItem
              ? state.currentItem.item.image_name
              : "",
            Shopping_category: state.currentCategory
              ? state.currentCategory
              : "",
            Shopping_price: state.currentItem ? 0 : "",
            Shopping_time_stamp: new Date().getSeconds() - state.initialTime,
            Shopping_time_action: state.time,
          },
        ],
      },
    })),
});

export default createDataSlice;

//         logExperimentAction({
//           CoDe_cue: currentSlide.id == "orange" ? "orange" : "blue",
//           CoDe_stimuli_type:
//             experimentSequence[index].slide.id == "blue"
//               ? blueIsSelf
//                 ? "own"
//                 : "others"
//               : blueIsSelf
//               ? "others"
//               : "own",
//           CoDe_outcome: receivedItem ? "TRUE" : "FALSE",
//           CoDe_response: pressedButton ? "TRUE" : "FALSE",
//           CoDe_item: experimentSequence[index].product.image_name,
//           CoDe_RT: Date.now() - reactionStartTime,
//         })
