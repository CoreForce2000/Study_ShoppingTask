import { StateCreator } from "zustand";
import imageData from "../assets/categories/image_data.json";
import config from "../assets/configs/config.json";
import { addUnique, shuffleArray } from "../util/functions";
import { DataSlice } from "./dataSlice";

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
  currentCategory: string | null;
  setCurrentCategory: (category: string) => void;
  currentItem: Item | null;
  setCurrentItem: (item: Item) => void;
  budget: number;
  trolley: TrolleyItem[];
  trolleyCounter: number;
  addItemToCart: (item: Item) => void;
  removeItemFromCart: (trolleyItem: TrolleyItem) => void;
  clickedCategories: string[];
  clickCategory: (category: string) => void;
  clickedItemTiles: TileItem[];
  clickItemTile: (tile_id: number, item: Item) => void;
}

const createShopSlice: StateCreator<
  ShopSlice & DataSlice,
  [],
  [],
  ShopSlice
> = (set) => ({
  items: shuffleArray(imageData),
  categories: shuffleArray([
    ...new Set(imageData.map((item) => item.category)),
  ]),

  currentCategory: null,
  setCurrentCategory: (category: string) => set({ currentCategory: category }),
  currentItem: null,
  setCurrentItem: (item: Item) => set({ currentItem: item }),

  budget: 0,
  trolley: [],
  trolleyCounter: 0,

  addItemToCart: (item: Item) =>
    set((state) => {
      const price =
        state.budget < config.shop.general.minimumPriceThreshold
          ? item.minimum
          : item.maximum;

      const newBudget =
        price < state.budget
          ? state.budget - price
          : config.shop.general.initialBudget - price;

      return {
        trolleyCounter: state.trolleyCounter + 1,
        budget: newBudget,
        trolley: [
          ...state.trolley,
          { index: state.trolleyCounter, item: item, price: price },
        ],
      };
    }),
  removeItemFromCart: (trolleyItem: TrolleyItem) =>
    set((state) => {
      const newBudget = state.budget + trolleyItem.price;

      return {
        budget: newBudget,
        trolley: state.trolley.filter(
          (item) => item.index !== trolleyItem.index
        ),
      };
    }),

  clickedCategories: [],
  clickCategory: (category) =>
    set((state) => ({
      clickedCategories: addUnique(state.clickedCategories, category),
    })),

  clickedItemTiles: [],
  clickItemTile: (tile_id: number, item: Item) => {
    set((state) => ({
      clickedItemTiles: addUnique(state.clickedItemTiles, {
        tile_id: tile_id,
        item: item,
      }),
    }));
  },
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
