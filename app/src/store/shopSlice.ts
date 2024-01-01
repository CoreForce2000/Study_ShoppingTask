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

interface ShopState {
  budget: number;
  items: Product[];
  products: ProductCategories;
  shuffledItems: Record<string, Product[]>;
  shuffledCategories: string[];
  clickedCategories: string[];
  clickedItemTiles: Record<string, number[]>;
  itemsInCart: CartItem[];
  itemsClicked: Product[];
}

const initialState: ShopState = {
  budget: shopConfig.initialBudget,
  items: [],
  products: jsonData as ProductCategories,
  shuffledItems: {},
  shuffledCategories: [],
  clickedCategories: [],
  clickedItemTiles: {},
  itemsInCart: [],
  itemsClicked: [],
};


export const shopSlice = createSlice({
    name: "shop",
    initialState,
    reducers: {

        setBudget: (state, action: PayloadAction<number>) => {
            state.budget = action.payload;
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

          if (state.budget < price) {
            return;
          }else {
            state.budget -= price;
            state.itemsInCart.push({unique_id: generateUniqueID(10), product: product, price: price, selected: false});
          }
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
    },
});


export const selectShopProducts = (state: RootState) => state.shop.products;
export const selectShuffledItems = (state: RootState) => state.shop.shuffledItems;
export const selectShuffledCategories = (state: RootState) => state.shop.shuffledCategories;
export const selectClickedCategories = (state: RootState) => state.shop.clickedCategories;
export const selectItemsInCart = (state: RootState) => state.shop.itemsInCart;
export const selectClickedItems = (state: RootState) => state.shop.itemsClicked;


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
export const selectClickedItemTiles = createSelector(
  (state: RootState, category: string) => state.shop.clickedItemTiles[category] ?? [],
  (clickedItemTiles) => clickedItemTiles
);


export const selectCategoryClickCount = createSelector(
  [selectAllCategories, selectClickedCategories, (state) => state],
  (allCategories, clickedCategories, state) => {
    return allCategories.reduce((acc: { [key: string]: number }, category) => {
      // Check if the category has been clicked
      if (clickedCategories.includes(category)) {
        // If clicked, use selectClickedItemTiles to get tiles
        const tiles = selectClickedItemTiles(state, category);
        acc[category] = Array.isArray(tiles) ? tiles.length : 0;
      } else {
        // If not clicked, set count to -1
        acc[category] = -1;
      }
      return acc;
    }, {});
  }
);



export const { setBudget,addItemToCart,removeItemFromCart, setShuffledItems, setShuffledCategories, 
  setItemTileClicked, setCategoryClicked, addItemToClickedItems
 } = shopSlice.actions;
export default shopSlice.reducer;
