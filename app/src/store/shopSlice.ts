import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import jsonData from '../assets/categories/image_data.json';
import { createSelector } from '@reduxjs/toolkit';
import { shopConfig } from "../configs/config";

interface ProductCategories {
  [category: string]: { [id: string]: Product };
}

interface ShopState {
  budget: number;
  items: Product[];
  products: ProductCategories;
  shuffledItems: Record<string, Product[]>;
  shuffledCategories: string[];
  clickedCategories: string[];
  clickedItems: Record<string, [Product, number][]>;
}

const initialState: ShopState = {
  budget: shopConfig.initialBudget,
  items: [],
  products: jsonData as ProductCategories,
  shuffledItems: {},
  shuffledCategories: [],
  clickedCategories: [],
  clickedItems: {}
};


export const shopSlice = createSlice({
    name: "shop",
    initialState,
    reducers: {

        setBudget: (state, action: PayloadAction<number>) => {
            state.budget = action.payload;
        },
        purchaseItem: (state, action: PayloadAction<number>) => {
            state.budget -= action.payload;
        },
        returnItem: (state, action: PayloadAction<number>) => {
            state.budget += action.payload;
        },
        addItem: (state, action: PayloadAction<Product>) => {
            state.items.push(action.payload);
        },
        removeItem: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.image_name !== action.payload);
        },
        setShuffledItems: (state, action: PayloadAction<{ category: string, item_id_list: Product[]}>) => {
          const { category, item_id_list } = action.payload;
          if (!state.shuffledItems[category]) {
            state.shuffledItems[category] = [];
          }
          state.shuffledItems[category] = item_id_list;
        },

        setShuffledCategories: (state, action: PayloadAction<string[]>) => {
            state.shuffledCategories = action.payload;
        },
        setCategoryClicked: (state, action: PayloadAction<string>) => {
        if (!state.clickedCategories.includes(action.payload)) {
            state.clickedCategories.push(action.payload);
        }
        },
        setItemClicked: (state, action: PayloadAction<{ category: string; item: [Product, number] }>) => {
        const { category, item } = action.payload;

        if (!state.clickedItems[category]) {
            state.clickedItems[category] = [];
        }
        if (!state.clickedItems[category].includes(item)) {
            state.clickedItems[category].push(item);
        }
        }
    },
});


export const selectShopProducts = (state: RootState) => state.shop.products;
export const selectShuffledItems = (state: RootState) => state.shop.shuffledItems;
export const selectShuffledCategories = (state: RootState) => state.shop.shuffledCategories;
export const selectClickedCategories = (state: RootState) => state.shop.clickedCategories;



export const selectProduct = (state: RootState, category: string, itemId: number): Product => {
  return state.shop.products[category]?.[itemId.toString()];
};

export const selectAllCategories = createSelector(
  [selectShopProducts],
  (products) => Object.keys(products)
);

export const selectItemsByCategory = createSelector(
  [selectShopProducts, (_, category) => category],
  (products, category) => {
    const categoryProducts = products[category];
    return categoryProducts ? Object.values(categoryProducts) : [];
  }
);

export const selectShuffledItemsByCategory = createSelector(
  [selectShuffledItems, (_, category) => category],
  (shuffledItems, category) => shuffledItems[category] ?? []
);

// Selector to get clicked items for a specific category
export const selectClickedItems = createSelector(
  (state: RootState, category: string) => state.shop.clickedItems[category] ?? [],
  (clickedItems) => clickedItems
);


export const { setBudget, purchaseItem, returnItem, addItem, removeItem, setShuffledItems, setShuffledCategories, setItemClicked, setCategoryClicked } = shopSlice.actions;
export default shopSlice.reducer;
