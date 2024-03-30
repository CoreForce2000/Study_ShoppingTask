import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const experimentSlice = createSlice({
    name: "experiment",
    initialState: {
        slideWidth: "100px",
        currentSlideIndex: 0,
        block: 1,  // Add block field with initial value
        trial: 1,  // Add trial field with initial value
    },
    
    reducers: {
        setSlideWidth: (state, action) => {
            state.slideWidth = action.payload;
        },
        
        setCurrentSlideIndex: (state, action) => {
            state.currentSlideIndex = action.payload;
        },
        
        setBlock: (state, action) => {  // Add a new reducer action for setting the block
            state.block = action.payload;
        },
        
        setTrial: (state, action) => {  // Add a new reducer action for setting the trial
            state.trial = action.payload;
        },
    },
});

export const selectCurrentSlideIndex = (state: RootState) => state.slide.currentSlideIndex;
export const selectBlock = (state: RootState) => state.experiment.block;  // Add selector for block
export const selectTrial = (state: RootState) => state.experiment.trial;  // Add selector for trial

export const { 
    setSlideWidth, 
    setCurrentSlideIndex,
    setBlock,  // Export the new reducer action for setting the block
    setTrial,  // Export the new reducer action for setting the trial
} = experimentSlice.actions;

export default experimentSlice.reducer;
