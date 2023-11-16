import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import jsonData from '../assets/categories/image_data.json';

// Updated initial state
const initialState: ShopState = {
    budget: 1000, // Initial budget
    items: [], // Initial cart items
    products: jsonData,
    shuffledItems: [],
    shuffledCategories: [],
};
interface Product {
  // Define your Product structure here
  image_name: string;
  // Add other fields as necessary
}

interface ShopState {
  budget: number;
  items: Product[];
  products: Record<string, Product[]>; // Assuming jsonData has this structure
  shuffledItems: Product[];
  shuffledCategories: string[];
  clickedCategories: string[];
  clickedItems: Record<string, string[]>; // Key: category, Value: array of clicked item names
}

  
// Updated initial state
const initialState: ShopState = {
  budget: 1000,
  items: [],
  products: jsonData,
  shuffledItems: [],
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
        setShuffledItems: (state, action: PayloadAction<Product[]>) => {
            state.shuffledItems = action.payload;
        },
        setShuffledCategories: (state, action: PayloadAction<string[]>) => {
            state.shuffledCategories = action.payload;
        },
        categoryClicked: (state, action: PayloadAction<string>) => {
        if (!state.clickedCategories.includes(action.payload)) {
            state.clickedCategories.push(action.payload);
        }
        },
        itemClicked: (state, action: PayloadAction<{ category: string; itemName: string }>) => {
        const { category, itemName } = action.payload;
        if (!state.clickedItems[category]) {
            state.clickedItems[category] = [];
        }
        if (!state.clickedItems[category].includes(itemName)) {
            state.clickedItems[category].push(itemName);
        }
        }
    },
});

export const selectAllCategories = (state: RootState): string[] => {
    return Object.keys(state.shop.products);
  };
  
  export const selectItemsByCategory = (state: RootState, category: string): Product[] => {
    return state.shop.products[category] || [];
  };
  
  export const selectShuffledItemsByCategory = (state: RootState, category: string): Product[] => {
    return state.shop.shuffledItems[category] || [];
  };
  
  export const selectProduct = (state: RootState, category: string, item: number): Product | undefined => {
    return state.shop.products[category]?.[item];
  };


// Export actions
export const { setBudget, purchaseItem, returnItem, addItem, removeItem, setShuffledItems, setShuffledCategories } = shopSlice.actions;
export default shopSlice.reducer;
