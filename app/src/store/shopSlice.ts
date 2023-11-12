import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define a type for the slice state
interface ShopState {
    budget: number;
}

// Initial state
const initialState: ShopState = {
    budget: 1000, // Set initial budget to 1000
};

export const shopSlice = createSlice({
    name: "shop",
    initialState,
    reducers: {
        // Action to set the budget
        setBudget: (state, action: PayloadAction<number>) => {
            state.budget = action.payload;
        },
        // Action to decrease the budget (purchase item)
        purchaseItem: (state, action: PayloadAction<number>) => {
            state.budget -= action.payload;
        },
        // Action to increase the budget (return item)
        returnItem: (state, action: PayloadAction<number>) => {
            state.budget += action.payload;
        },
    },
});

export const { setBudget, purchaseItem, returnItem } = shopSlice.actions;

export default shopSlice.reducer;
