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
            console.log("Changed the current slide index to ", action.payload)
            state.currentSlideIndex = action.payload;
        },
        incrementCurrentSlideIndex: (state) => {
            console.log("Incremented slide index")
            state.currentSlideIndex = state.currentSlideIndex+1;
        },
        decrementCurrentSlideIndex: (state) => {
            console.log("Back one slide")
            state.currentSlideIndex = state.currentSlideIndex-1;
        },
    },
});

export const selectCurrentSlideIndex = (state: RootState) => state.slide.currentSlideIndex;

export const { 
    setSlideWidth, 
    setCurrentSlideIndex,
    incrementCurrentSlideIndex,
    decrementCurrentSlideIndex

} = slideSlice.actions;

export default slideSlice.reducer;