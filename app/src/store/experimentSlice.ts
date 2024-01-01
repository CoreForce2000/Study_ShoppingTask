import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const experimentSlice = createSlice({
    name: "slide",
    initialState: {
        slideWidth: "100px",
        currentSlideIndex: 0,
    },
    
    reducers: {

        setSlideWidth: (state, action) => {
            state.slideWidth = action.payload;
        },

        setCurrentSlideIndex: (state, action) => {
            state.currentSlideIndex = action.payload;
        },
    },
});

export const selectCurrentSlideIndex = (state: RootState) => state.slide.currentSlideIndex;

export const { 
    setSlideWidth, 
    setCurrentSlideIndex

} = experimentSlice.actions;

export default experimentSlice.reducer;