import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const configSlice = createSlice({
    name: "config",
    initialState: {
        developerOptions: false,
    },
    
    reducers: {

        setDeveloperOptions: (state, action) => {
            state.developerOptions = action.payload;
        },

    },
});

export const selectIsDeveloperOptions = (state: RootState) => state.config.developerOptions;

export const { 
    setDeveloperOptions
    
} = configSlice.actions;

export default configSlice.reducer;