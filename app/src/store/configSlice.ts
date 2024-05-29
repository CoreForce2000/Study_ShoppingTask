import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";



export const configSlice = createSlice({
    name: "config",
    initialState: {
        developerOptions: false,
        shopTime: 0
    },
    
    reducers: {

        setDeveloperOptions: (state, action) => {
            state.developerOptions = action.payload;
        },

        
        setShopTime: (state, action) => {
            state.shopTime = action.payload;
        },
    },
});

export const selectIsDeveloperOptions = (state: RootState) => state.config.developerOptions;
export const selectShopTime = (state: RootState) => state.config.shopTime;

export const { 
    setDeveloperOptions,
    setShopTime
    
} = configSlice.actions;

export default configSlice.reducer;