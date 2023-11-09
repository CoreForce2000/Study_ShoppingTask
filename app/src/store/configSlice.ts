import { createSlice } from "@reduxjs/toolkit";

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

export const { 
    setDeveloperOptions
    
} = configSlice.actions;

export default configSlice.reducer;