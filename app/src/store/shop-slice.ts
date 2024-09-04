import { StateCreator } from "zustand";
import imageData from "../assets/categories/image_data.json";
import config from "../assets/configs/config.json";
import {
  LUCKY_CUSTOMER_SOUND,
  TIME_IS_RUNNING_OUT_SOUND,
} from "../util/constants";
import {
  addUnique,
  pseudorandomize,
  shuffleArray,
  sumArray,
} from "../util/functions";
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
  numVisibleRows: number;
  addVisibleRows: () => void;
  selectedTrolleyItems: TrolleyItem[];
  selectTrolleyItem: (trolleyItem: TrolleyItem) => void;
  categories: string[];
  page: "categories" | "items" | "trolley" | "item" | "shoppingList";
  navigateTo: (page: ShopSlice["page"]) => void;
  currentCategory: string;
  currentItem: TileItem | TrolleyItem | undefined;
  scrollPositions: Record<string, number>;
  setScrollPosition: (key: string, position: number) => void;
  budget: number;
  trolley: TrolleyItem[];
  trolleyCounter: number;
  addItemToCart: (item: Item) => void;
  removeTrolleyItems: () => void;
  getItemPrice: (item: Item) => number;
  backPressed: () => void;
  clickedCategories: string[];
  clickCategory: (category: string) => void;
  clickedItemTiles: Record<string, TileItem[]>;
  clickItemTile: (tile_id: number, beforeTimeout: boolean) => void;
  tickTimer: () => void;
  isPhase3: boolean;
  resetTrolley: () => void;
  switchToPhase3: () => void;
  time: number;
  setTime: (time: number) => void;
  quizCorrectPersons: string[];
  quizAddCorrectPersonUnique: (
    person: string,
    sideEffect: (array: string[]) => void
  ) => void;
}

const createShopSlice: StateCreator<TaskStore, [], [], ShopSlice> = (
  set,
  get
) => ({
  items: shuffleArray(imageData),
  selectedTrolleyItems: [],
  selectTrolleyItem: (trolleyItem: TrolleyItem) =>
    set((state) => ({
      selectedTrolleyItems: state.selectedTrolleyItems.includes(trolleyItem)
        ? state.selectedTrolleyItems.filter((item) => item !== trolleyItem)
        : [...state.selectedTrolleyItems, trolleyItem],
      currentItem: trolleyItem,
      currentCategory: trolleyItem ? trolleyItem.item.category : "",
    })),
  categories: pseudorandomize(),
  page: "categories",
  navigateTo: (page: ShopSlice["page"]) =>
    set((state) => {
      if (page === "trolley" || page === "shoppingList") {
        state.logShopAction(`navigate_to_${page}`);
      }
      if (
        page === "categories" ||
        page === "shoppingList" ||
        page === "trolley"
      ) {
        return {
          page: page,
          currentCategory: "",
          currentItem: undefined,
        };
      } else if (page === "items") {
        return {
          page: page,
          currentItem: undefined,
        };
      }
      return {
        page: page,
      };
    }),
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
  numVisibleRows: config.shop.general.initialVisilbeRows,
  addVisibleRows: () =>
    set((state) => ({
      numVisibleRows:
        state.numVisibleRows + config.shop.general.newVisibleRowsOnScroll,
    })),

  currentCategory: "",
  currentItem: undefined,

  budget: config.shop.general.initialBudget,
  trolley: [],
  trolleyCounter: 0,

  resetTrolley: () =>
    set(() => ({
      trolley: [],
      trolleyCounter: 0,
    })),

  getItemPrice: (item) => {
    const state = get();
    if (!item) {
      return 0;
    }
    return state.budget < config.shop.general.minimumPriceThreshold
      ? item.minimum
      : item.maximum;
  },

  addItemToCart: (item: Item) =>
    set((state) => {
      state.backPressed();
      const price = state.getItemPrice(item);
      const newState = {
        trolleyCounter: state.trolleyCounter + 1,
        trolley: [
          ...state.trolley,
          { index: state.trolleyCounter, item: item, price: price },
        ],
      };

      if (state.isPhase3) {
        const itemsPurchased = config.memoryQuestionConfig
          .map((x) => x.correct)
          .every((requiredCategory) =>
            newState.trolley
              .map((x) => x.item.category)
              .some((trolleyCategory) =>
                trolleyCategory.includes(requiredCategory)
              )
          );
        if (itemsPurchased) {
          state.setTime(1);
        }
      }

      let newBudget = state.budget - price;
      if (state.budget < price) {
        // sum of trolley items plus budget is above initial budget value
        if (
          sumArray(state.trolley.map((item) => item.price)) + state.budget ===
          config.shop.general.initialBudget
        ) {
          LUCKY_CUSTOMER_SOUND.play();
          state.setTrialIndex(3);
        }
        newBudget = config.shop.general.initialBudget + state.budget - price;
      }

      return {
        ...newState,
        budget: newBudget,
      };
    }),

  removeTrolleyItems: () =>
    set((state) => {
      const newBudget = state.selectedTrolleyItems.reduce(
        (acc, item) => acc + item.price,
        state.budget
      );

      const newTrolley = state.trolley.filter(
        (item) => !state.selectedTrolleyItems.includes(item)
      );

      return {
        budget: newBudget,
        trolley: newTrolley,
        selectedTrolleyItems: [],
        currentItem: undefined,
        currentCategory: "",
      };
    }),

  backPressed: () => {
    const state = get();
    if (
      state.page === "items" ||
      state.page === "trolley" ||
      state.page === "shoppingList"
    ) {
      state.navigateTo("categories");
    } else if (state.page === "item") {
      state.navigateTo("items");
    }
  },

  switchToPhase3: () => {
    set(() => ({
      items: shuffleArray(imageData),
      selectedTrolleyItems: [],
      categories: pseudorandomize(),
      page: "categories",
      time: config.shop.general.time.phase3,
      scrollPositions: {},
      numVisibleRows: config.shop.general.initialVisilbeRows,
      currentCategory: "",
      currentItem: undefined,
      budget: config.shop.general.initialBudget,
      trolley: [],
      trolleyCounter: 0,
      clickedCategories: [],
      clickedItemTiles: {},
      quizCorrectPersons: [],
      isPhase3: true,
    }));
  },

  clickedCategories: [],
  clickCategory: (category) =>
    set((state) => {
      return {
        clickedItemTiles: {
          ...state.clickedItemTiles,
          [category]: [...(state.clickedItemTiles[category] || [])],
        },
        clickedCategories: addUnique(state.clickedCategories, category),
        currentCategory: category,
      };
    }),

  clickedItemTiles: {},

  setCurrentItem: (item: TileItem) =>
    set(() => ({
      currentItem: item,
    })),

  clickItemTile: (tile_id: number, beforeTimeout: boolean) =>
    set((state) => {
      const clickedItems = state.clickedItemTiles[state.currentCategory] || [];

      const clickedItemIndex = clickedItems.findIndex(
        (item) => item.tile_id === tile_id
      );

      const newItem = clickedItemIndex === -1;

      const items = state.items.filter(
        (item) => item.category === state.currentCategory
      );

      const item = newItem
        ? items[clickedItems.length % items.length]
        : clickedItems[clickedItemIndex].item;

      const tileItem: TileItem = { tile_id: tile_id, item: item };

      return beforeTimeout
        ? {
            currentItem: { tile_id: tile_id, item: item },
          }
        : {
            clickedItemTiles: {
              ...state.clickedItemTiles,
              [state.currentCategory]: newItem
                ? [...clickedItems, tileItem]
                : clickedItems,
            },
          };
    }),

  tickTimer: () =>
    set((state) => {
      if (state.time <= 1) {
        return { time: config.shop.general.time.phase3 };
      } else {
        if (state.page === "trolley" || state.page === "shoppingList") {
          return {};
        } else {
          if (
            state.isPhase3
              ? state.time === 2.5 * 60 && state.trolley.length === 0
              : (state.time === 5 * 60 && state.trolley.length === 0) ||
                (state.time === 2 * 60 && state.trolley.length < 10)
          ) {
            TIME_IS_RUNNING_OUT_SOUND.play();
            state.setTrialIndex(2);
          }

          return {
            time: state.time - 1,
          };
        }
      }
    }),

  isPhase3: false,
  quizCorrectPersons: [],
  quizAddCorrectPersonUnique: (person, sideEffect) =>
    set((state) => {
      const newArray = addUnique(state.quizCorrectPersons, person);
      sideEffect(newArray);

      return {
        quizCorrectPersons: newArray,
      };
    }),
});

export default createShopSlice;
