import { StateCreator } from "zustand";
import config from "../assets/configs/config.json";
import { getGenericCategory, sumArray, unique } from "../util/functions";
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
  craving: string;
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
  logAction: (response: Record<string, any>) => void;
  logShopAction: (action: any) => void;
  logExperimentAction: (action: {
    cue: string;
    stimuli_type: string;
    outcome: string;
    response: string;
    item: string;
    category: string;
    RT: number;
  }) => void;
  setDrugCraving: (drug: string, value?: number) => void;
  getCsvString: () => string;
}

const createDataSlice: StateCreator<TaskStore, [], [], DataSlice> = (
  set,
  get
) => ({
  data: {
    survey: {
      gender: "",
      age: "",
      group: "Select group",
      time: "15",
      participantId: "",
      handedness: "",
      onlineShoppingFrequency: "",
      drugs: [],
      craving: "False",
    },
    actionLog: [],
    drugCraving: {},
  },

  getDrugsNow: () =>
    [
      ...new Set(
        [...get().data.survey.drugs, get().data.survey.group].filter(
          (drug: string) =>
            drug !== config.options.drugScreening.other &&
            drug !== config.options.drugScreening.none &&
            drug !== "Control"
        )
      ),
    ] ?? [],

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

  logAction(response: Record<string, any>) {
    return set((state) => {
      const row = {
        data: {
          ...state.data,
          actionLog: [
            ...state.data.actionLog,
            {
              Phase: state.phase,
              Phase_name: state.phaseName,
              Block: state.block,
              Block_name: state.blockName,
              ...response,
            },
          ],
        },
      };
      return row;
    });
  },

  logShopAction: (action: any) => {
    const state = get();
    state.logAction(
      state.isPhase3
        ? {
            Trial: state.data.actionLog.length + 1,
            Control_budget: state.budget,
            Control_event: action,
            Control_item: state.currentItem
              ? state.currentItem.item.image_name
              : "",
            Control_category: state.currentCategory
              ? state.currentCategory
              : "",
            Control_generic_category: true
              ? ""
              : state.currentCategory
              ? getGenericCategory(state.currentCategory)
              : "",
            Control_price: state.getItemPrice(state.currentItem?.item!) ?? 0,
            Control_trolley: sumArray(state.trolley.map((item) => item.price)),
            Control_time_stamp: new Date().toTimeString(),
            Control_time_action: state.time,
          }
        : {
            Trial: state.data.actionLog.length + 1,
            Shopping_budget: state.budget,
            Shopping_event: action,
            Shopping_item: state.currentItem
              ? state.currentItem.item.image_name
              : "",
            Shopping_category: state.currentCategory
              ? state.currentCategory
              : "",

            Shopping_generic_category: true
              ? ""
              : state.currentCategory
              ? getGenericCategory(state.currentCategory)
              : "",
            Shopping_price: state.getItemPrice(state.currentItem?.item!) ?? 0,
            Shopping_trolley: sumArray(state.trolley.map((item) => item.price)),
            Shopping_time_stamp: new Date().toTimeString(),
            Shopping_time_action: state.time,
          }
    );
  },

  logExperimentAction: ({
    cue,
    stimuli_type,
    outcome,
    response,
    item,
    category,
    RT,
  }) => {
    const state = get();
    state.logAction({
      Trial: state.data.actionLog.length + 1,
      CoDe_cue: cue,
      CoDe_stimuli_type: stimuli_type,
      CoDe_outcome: outcome,
      CoDe_response: response,
      CoDe_item: outcome ? item : undefined,
      CoDe_category: outcome ? category : undefined,
      CoDe_RT: RT,
    });
  },

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

    // Create the header row for shop actions
    const shopHeaderRow = columnNames.join(",");

    // Create the CSV content by combining the demographics row, shop actions header, and data rows
    const csvString =
      "data:text/csv;charset=utf-8," +
      demographicsRow.join(",") +
      "\n" +
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
