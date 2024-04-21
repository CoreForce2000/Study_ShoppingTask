import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import jsonData from '../assets/categories/image_data.json';
import { createSelector } from '@reduxjs/toolkit';
import { shopConfig } from "../configs/config";
import generateUniqueID from "../util/UniqueId";

interface ProductCategories {
  [category: string]: { [id: string]: Product };
}

export interface Product {
  item_id: number;
  category: string;
  image_name: string;
  minimum: number;
  maximum: number;
}

export interface CartItem {
  unique_id: string;
  product: Product;
  price: number;
  selected: boolean;
}

type Action = "click_category" | "click_item" | "add_to_cart" | "not_add_to_cart" | "back_to_category_page" | "to_trolley" | "select_trolley_item" | "deselect_trolley_item" | "remove_from_cart";

export interface ShopAction {
  type: Action;
  timestamp: number;
  category: string;
  item: number;
  budget: number;
}

interface ShopState {
  budget: number;
  timer: number;
  items: Product[];
  products: ProductCategories;
  shuffledItems: Record<string, Product[]>;
  shuffledCategories: string[];
  clickedCategories: string[];
  clickedItemTiles: Record<string, number[]>;
  itemsInCart: CartItem[];
  itemsClicked: Product[];
  actions: ShopAction[];
  scrollPositions: Record<string, number>;
  isPhase3: boolean;
}

const initialState: ShopState = {
  budget: shopConfig.initialBudget,
  timer: shopConfig.initialTime,
  items: [],
  products: jsonData as ProductCategories,
  shuffledItems: {},
  shuffledCategories: [],
  clickedCategories: [],
  clickedItemTiles: {},
  itemsInCart: [],
  itemsClicked: [],
  actions:[],
  scrollPositions: {},
  isPhase3: false,
};


export const shopSlice = createSlice({
    name: "shop",
    initialState,
    reducers: {

        resetState: (state) => {
          Object.assign(state, initialState);
        },

        setBudget: (state, action: PayloadAction<number>) => {
            state.budget = action.payload;
        },
        decrementTimer: (state) => {
          if (state.timer > 0) {
            state.timer -= 1;
          }
        },

        setTimer: (state, action: PayloadAction<number>) => {
          state.timer = action.payload;
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
        setItemTileClicked: (state, action: PayloadAction<{ category: string; tile: number }>) => {
        const { category, tile } = action.payload;

          if (!state.clickedItemTiles[category]) {
              state.clickedItemTiles[category] = [];
          }
          if (!state.clickedItemTiles[category].includes(tile)) {
              state.clickedItemTiles[category].push(tile);
          }
        },

        // Add item to the cart if possible
        addItemToCart: (state, action: PayloadAction<Product>) => {
          const product = action.payload

          const price = state.budget < shopConfig.useMinimumPriceBelow ? product.minimum : product.maximum;

          state.budget -= price;
          state.itemsInCart.push({unique_id: generateUniqueID(10), product: product, price: price, selected: false});
          
        },

        // Remove item from the cart
        removeItemFromCart: (state, action: PayloadAction<CartItem>) => {
          console.log("Removing", action.payload.unique_id)
          state.itemsInCart.forEach((cartItem) => {
            if (cartItem.unique_id === action.payload.unique_id) {
              state.budget += cartItem.price;
            }
          });
          
          state.itemsInCart = state.itemsInCart.filter((item) => item.unique_id !== action.payload.unique_id);
        },

        addItemToClickedItems: (state, action: PayloadAction<Product>) => {
          const product = action.payload;
          
          // Check if the product is already in the list
          const isProductAlreadyClicked = state.itemsClicked.some((item) => item.item_id === product.item_id);
        
          if (!isProductAlreadyClicked) {
            state.itemsClicked.push(product);
          }
        },

        logAction: (state, action: PayloadAction<{ type: Action; category: string; item: number }>) => {
          const { type, category, item } = action.payload;
    
          // Automatically include budget and timer from the current state
          const { budget, timer } = state;

          const timestamp = shopConfig.initialTime - timer;
    
          // Create the ShopAction object with budget, timer, and other parameters
          const shopAction: ShopAction = {
            type,
            timestamp,
            category,
            item,
            budget,
          };
    
          state.actions.push(shopAction);

          console.log("Action logged", shopAction);
        },

        setScrollPosition: (state, action: PayloadAction<{ key: string; position: number }>) => {
          const { key, position } = action.payload;
          state.scrollPositions[key] = position;
        },

        setIsPhase3: (state, action: PayloadAction<boolean>) => {
          state.isPhase3 = action.payload;
        }
    },
});


export const selectShopProducts = (state: RootState) => state.shop.products;
export const selectShuffledItems = (state: RootState) => state.shop.shuffledItems;
export const selectShuffledCategories = (state: RootState) => state.shop.shuffledCategories;
export const selectClickedCategories = (state: RootState) => state.shop.clickedCategories;
export const selectItemsInCart = (state: RootState) => state.shop.itemsInCart;
export const selectClickedItems = (state: RootState) => state.shop.itemsClicked;
export const selectTimer = (state: RootState) => state.shop.timer;
export const selectShopActions = (state: RootState) => state.shop.actions;
export const selectBudget = (state: RootState) => state.shop.budget;
export const selectScrollPosition = (state: RootState, key: string) => state.shop.scrollPositions[key];
export const selectIsPhase3 = (state: RootState) => state.shop.isPhase3;

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

export const selectClickedItemTiles = createSelector(
  (state: RootState, category: string) => state.shop.clickedItemTiles[category] ?? [],
  (clickedItemTiles) => clickedItemTiles
);


export const selectCategoryClickCount = createSelector(
  [selectAllCategories, selectClickedCategories, (state) => state],
  (allCategories, clickedCategories, state) => {
    return allCategories.reduce((acc: { [key: string]: number }, category) => {

      if (clickedCategories.includes(category)) {

        const tiles = selectClickedItemTiles(state, category);
        acc[category] = Array.isArray(tiles) ? tiles.length : 0;
      } else {
        acc[category] = -1;
      }
      return acc;
    }, {});
  }
);

export const selectPhase3Complete = createSelector(
  [selectAllCategories, selectClickedCategories],
  (allCategories, clickedCategories) => {
    return shopConfig.phase3ShoppingList.every((category) => clickedCategories.includes(category));
  }
);


export const { setBudget,addItemToCart,removeItemFromCart, setShuffledItems, setShuffledCategories, 
  setItemTileClicked, setCategoryClicked, addItemToClickedItems, decrementTimer, logAction, resetState, setTimer, setScrollPosition, setIsPhase3
 } = shopSlice.actions;
export default shopSlice.reducer;
