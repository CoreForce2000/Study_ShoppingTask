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
    },
});


export const selectAllCategories = (state: RootState) => {
    return Object.keys(state.shop.products);
  };
  
export const selectItemsByCategory = (state: RootState, category: string) => {
return state.shop.products[category];
};

export const selectProduct = (state: RootState, category: string, item: number) => {
return state.shop.products[category]?.[item];
};


// Export actions
export const { setBudget, purchaseItem, returnItem, addItem, removeItem, setShuffledItems, setShuffledCategories } = shopSlice.actions;
export default shopSlice.reducer;
