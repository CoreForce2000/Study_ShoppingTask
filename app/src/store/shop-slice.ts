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
  scrollPositions: Record<string, number>;
  setScrollPosition: (key: string, position: number) => void;
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
  clickTrolleyItem: (index: number) => void;
  tickTimer: () => void;
  interSlide: "" | "timeIsRunningOut" | "extraBudget";
  setInterSlide: (interSlide: ShopSlice["interSlide"]) => void;
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

  scrollPositions: {},
  setScrollPosition: (key, position) =>
    set((state) => ({
      scrollPositions: { ...state.scrollPositions, [key]: position },
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
      // Get the number of clicked items in the current category
      const clickedItems = state.clickedItemTiles[state.currentCategory] || [];

      // Get the items in the current category
      const items = state.items.filter(
        (item) => item.category === state.currentCategory
      );

      //If the index is already in clicked items, use that index, if not, If the number of clicked items is the number of items in that category in total, reset to 0
      const clickedItemIndex = clickedItems.findIndex(
        (item) => item.tile_id === tile_id
      );

      const itemIndex =
        clickedItemIndex !== -1
          ? clickedItemIndex
          : clickedItems.length === items.length
          ? 0
          : clickedItems.length;

      const item = items[itemIndex];

      console.log(item);

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

  clickTrolleyItem: (index: number) =>
    set((state) => {
      const item = state.trolley[index];
      return {
        currentItem: item,
      };
    }),

  tickTimer: () =>
    set((state) => {
      if (state.time <= 1) {
        return { time: config.shop.general.time.phase3 };
      } else {
        if (
          state.page === "trolley" ||
          state.page === "trolleyItem" ||
          state.interSlide !== ""
        ) {
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
  setInterSlide: (interSlide) =>
    set(() => ({
      interSlide: interSlide,
    })),
  isPhase3: false,
});

export default createShopSlice;
