import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export const slideSlice = createSlice({
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
            console.log("Setting current slide index to " + action.payload)
            state.currentSlideIndex = action.payload;
        },
    },
});

export const selectCurrentSlideIndex = (state: RootState) => state.slide.currentSlideIndex;

export const { 
    setSlideWidth, 
    setCurrentSlideIndex

} = slideSlice.actions;

export default slideSlice.reducer;