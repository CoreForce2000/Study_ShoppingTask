import { StateCreator } from "zustand";
import config from "../assets/configs/config.json";
import { unique } from "../util/functions";
import { TaskStore } from "./store";

export type SurveyData = {
  gender: string;
  age: string;
  participantId: string;
  handedness: string;
  group: string;
  time: string;
  onlineShoppingFrequency: string;
  drugs: string[];
};

export interface DataSlice {
  data: {
    survey: SurveyData;
    actionLog: Record<string, any>[];
    drugCraving: {
      [key: string]: number[];
    };
  };
  getDrugsNow: () => string[];
  setSurveyResponse: (name: string, value: any) => void;
  logShopAction: (action: any) => void;
  logSurveyResponse: (response: Record<string, any>) => void;
  setDrugCraving: (drug: string, value?: number) => void;
  getCsvString: () => string;
}

const createDataSlice: StateCreator<TaskStore, [], [], DataSlice> = (
  set,
  get
) => ({
  data: {
    survey: {
      gender: "male",
      age: "23",
      group: "Cocaine",
      time: "10",
      participantId: "1425",
      handedness: "left",
      onlineShoppingFrequency: "",
      drugs: [],
    },
    actionLog: [],
    drugCraving: {},
  },

  getDrugsNow: () =>
    get().data.survey.drugs.filter(
      (drug: string) =>
        drug !== config.options.drugScreening.other &&
        drug !== config.options.drugScreening.none
    ) ?? [],

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

  logSurveyResponse: (response: any) =>
    set((state) => ({
      data: {
        ...state.data,
        actionLog: [
          ...state.data.actionLog,
          {
            Phase: 1,
            Phase_name: "Shopping",
            Block: 1,
            Block_name: "shopping",
            ...response,
          },
        ],
      },
    })),

  logShopAction: (action: any) =>
    set((state) => ({
      data: {
        ...state.data,
        actionLog: [
          ...state.data.actionLog,
          {
            Phase: 1,
            Phase_name: "Shopping",
            Block: 1,
            Block_name: "shopping",
            Trial: state.data.actionLog.length + 1,
            Shopping_budget: state.budget,
            Shopping_event: action,
            Shopping_item: state.currentItem
              ? state.currentItem.item.image_name
              : "",
            Shopping_category: state.currentCategory
              ? state.currentCategory
              : "",
            Shopping_price: state.currentItem ? 0 : "",
            Shopping_time_stamp: new Date().toTimeString(),
            Shopping_time_action: state.time,
          },
        ],
      },
    })),

  getCsvString: () => {
    const state = get();

    // Create a row for demographics
    const demographicsRow = [
      "participantId",
      state.data.survey.participantId,
      "age",
      state.data.survey.age,
      "group",
      state.data.survey.group,
      "gender",
      state.data.survey.gender,
      "handedness",
      state.data.survey.handedness,
      "onlineShoppingFrequency",
      state.data.survey.onlineShoppingFrequency,
      "test_shopTime",
      state.data.survey.time,
    ];

    const columnNames = unique(
      state.data.actionLog.map((row) => Object.keys(row)).flat()
    );

    console.log("Action Log:", state.data.actionLog);

    // Create the header row for shop actions
    const shopHeaderRow = columnNames.join(",");

    // Create the CSV content by combining the demographics row, shop actions header, and data rows
    const csvString =
      "data:text/csv;charset=utf-8," +
      demographicsRow.join(",") +
      "\n" +
      "\n" +
      shopHeaderRow +
      "\n" +
      state.data.actionLog
        .map((row) => columnNames.map((key) => row[key] ?? "").join(","))
        .join("\n");

    return csvString;
  },
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
