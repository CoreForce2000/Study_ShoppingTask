import { createSlice } from "@reduxjs/toolkit";

export const slideSlice = createSlice({
    name: "slide",
    initialState: {
        slideWidth: "100px",
    },
    
    reducers: {

        setSlideWidth: (state, action) => {
            state.slideWidth = action.payload;
        },
    },
});

export const { 
    setSlideWidth

} = slideSlice.actions;

export default slideSlice.reducer;