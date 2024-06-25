import { StateCreator } from "zustand";
import imageData from "../assets/categories/image_data.json";
import config from "../assets/configs/config.json";
import {
  LUCKY_CUSTOMER_SOUND,
  TIME_IS_RUNNING_OUT_SOUND,
} from "../util/constants";
import { addUnique, shuffleArray } from "../util/functions";
import { TaskStore } from "./store";

export type Category = keyof typeof imageData;

export interface Item {
  item_id: number;
  category: string;
  image_name: string;
  minimum: number;
  maximum: number;
}

export interface TrolleyItem {
  index: number;
  item: Item;
  price: number;
}

export interface TileItem {
  tile_id: number;
  item: Item;
}

export interface ShopSlice {
  items: Item[];
  categories: string[];
  page: "categories" | "items" | "trolley" | "item" | "trolleyItem";
  navigateTo: (page: ShopSlice["page"]) => void;
  currentCategory: string;
  currentItem: TileItem | TrolleyItem | undefined;
  budget: number;
  trolley: TrolleyItem[];
  trolleyCounter: number;
  addItemToCart: (item: Item) => void;
  removeItemFromCart: (trolleyItem: TrolleyItem) => void;
  backPressed: () => void;
  clickedCategories: string[];
  clickCategory: (category: string) => void;
  clickedItemTiles: Record<string, TileItem[]>;
  clickItemTile: (tile_id: number) => void;
  tickTimer: () => void;
  interSlide: string;
  isPhase3: boolean;
  time: number;
  setTime: (time: number) => void;
}

const createShopSlice: StateCreator<TaskStore, [], [], ShopSlice> = (set) => ({
  items: shuffleArray(imageData),
  categories: shuffleArray([
    ...new Set(imageData.map((item) => item.category)),
  ]),
  page: "categories",
  navigateTo: (page: ShopSlice["page"]) =>
    set(() => ({
      page: page,
    })),
  time: config.shop.general.time.phase1,
  setTime: (time: number) =>
    set(() => ({
      time: time,
    })),

  currentCategory: "",
  currentItem: undefined,

  budget: config.shop.general.initialBudget,
  trolley: [],
  trolleyCounter: 0,

  addItemToCart: (item: Item) =>
    set((state) => {
      state.backPressed();
      const price =
        state.budget < config.shop.general.minimumPriceThreshold
          ? item.minimum
          : item.maximum;

      const newState = {
        trolleyCounter: state.trolleyCounter + 1,
        trolley: [
          ...state.trolley,
          { index: state.trolleyCounter, item: item, price: price },
        ],
      };

      if (state.budget < price) {
        LUCKY_CUSTOMER_SOUND.play();
        return {
          ...newState,
          budget: config.shop.general.initialBudget - price,
          interSlide: "extraBudget",
        };
      } else {
        return {
          ...newState,
          budget: state.budget - price,
        };
      }
    }),
  removeItemFromCart: (trolleyItem: TrolleyItem) =>
    set((state) => {
      state.backPressed();
      const newBudget = state.budget + trolleyItem.price;

      return {
        budget: newBudget,
        trolley: state.trolley.filter(
          (item) => item.index !== trolleyItem.index
        ),
      };
    }),

  backPressed: () =>
    set((state) => {
      if (state.page === "items") {
        return { page: "categories" };
      } else if (state.page === "trolley") {
        return { page: "categories" };
      } else if (state.page === "item") {
        return { page: "items" };
      } else if (state.page === "trolleyItem") {
        return { page: "trolley" };
      } else {
        return {};
      }
    }),
  clickedCategories: [],
  clickCategory: (category) =>
    set((state) => ({
      clickedItemTiles: {
        ...state.clickedItemTiles,
        [category]: [...(state.clickedItemTiles[category] || [])],
      },
      clickedCategories: addUnique(state.clickedCategories, category),
      currentCategory: category,
    })),

  clickedItemTiles: {},

  clickItemTile: (tile_id: number) =>
    set((state) => {
      const item = state.items.filter(
        (item) => item.category === state.currentCategory
      )[tile_id];

      return {
        clickedItemTiles: {
          ...state.clickedItemTiles,
          [state.currentCategory]: addUnique(
            state.clickedItemTiles[state.currentCategory] || [],
            {
              tile_id: tile_id,
              item: item,
            }
          ),
        },
        currentItem: { tile_id: tile_id, item: item },
      };
    }),

  tickTimer: () =>
    set((state) => {
      if (state.time <= 1) {
        return { time: config.shop.general.time.phase3 };
      } else {
        if (state.page === "trolley" || state.interSlide !== "") {
          return {};
        } else {
          const newInterSlide = !state.isPhase3
            ? (state.time === 5 * 60 && state.trolley.length === 0) ||
              (state.time === 2 * 60 && state.trolley.length < 10)
              ? "timeIsRunningOut"
              : ""
            : state.isPhase3
            ? state.time === 2.5 * 60 && state.trolley.length === 0
              ? "timeIsRunningOut"
              : ""
            : "";

          if (newInterSlide === "timeIsRunningOut") {
            TIME_IS_RUNNING_OUT_SOUND.play();
            setTimeout(() => {
              set(() => ({ interSlide: "" }));
            }, config.shop.general.alarmBellDuration);
          }

          return {
            time: state.time - 1,
            interSlide: newInterSlide,
          };
        }
      }
    }),

  interSlide: "",
  isPhase3: false,
});

export default createShopSlice;

//
//
// Data Collection
//
//

/*

      store.logShopAction({
        Shopping_budget: shop.budget,
        Shopping_event: "click_item",
        Shopping_item: currentItem.image_name,
        Shopping_category: currentItem.category,
        Shopping_price:
          shop.budget < config.data.shop.general.useMinimumPriceBelow
            ? currentItem.minimum
            : currentItem.maximum,
      });

              logShopAction({
          Shopping_budget: budget,
          Shopping_event: "remove_from_Trolley",
          Shopping_item: TrolleyItem.product.image_name,
          Shopping_category: TrolleyItem.product.category,
          Shopping_price: TrolleyItem.price,
        })

        dispatch(logShopAction({
      Shopping_budget: budget,
      Shopping_event: "click_item",
      Shopping_item: undefined,
      Shopping_category: category,
      Shopping_price: undefined,
    }));
*/

/* 


  const handleExportCsv = () => {
    // Define column names for the shop actions
    const columns: (keyof Row)[] = [
      "Phase",
      "Phase_name",
      "Block_num",
      "Block_name",
      "Shopping_event",
      "Shopping_category",
      "Shopping_item",
      "Shopping_time_stamp",
      "Shopping_time_action",
      "Shopping_price",
      "Shopping_budget",
      "CoDe_cue",
      "CoDe_stimuli_type",
      "CoDe_response",
      "CoDe_outcome",
      "CoDe_item",
      "CoDe_RT",
      "CoDe_VAS",
      "Control_qs_person",
      "Control_qs_item",
      "Control_qs_correct",
      "Control_qs_attempts",
      "Control_qs_RT",
      "Control_event",
      "Control_category",
      "Control_item",
      "Control_time_stamp",
      "Control_time_action",
      "Control_price",
      "Control_budget",
    ];

    // Create a row for demographics
    const demographicsRow = [
      "participantId",
      participantId,
      "age",
      age,
      "group",
      group,
      "gender",
      gender,
      "handedness",
      handedness,
      "onlineShoppingFrequency",
      onlineShoppingFrequency,
      "test_shopTime",
      shopTime
    ];

    // Create the header row for shop actions
    const shopHeaderRow = columns.join(",");

    // Create the CSV content by combining the demographics row, shop actions header, and data rows
    const csvContent =
      "data:text/csv;charset=utf-8," +
      demographicsRow.join(",") +
      "\n" +
      "\n" +
      shopHeaderRow +
      "\n" +
      rows.map((row) => Object.values(sortObjectByKeys(row, columns)).join(",")).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "shop_actions.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

*/
