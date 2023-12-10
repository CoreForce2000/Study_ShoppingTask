import { createSlice } from "@reduxjs/toolkit";

export const surveySlice = createSlice({
    name: "survey",
    initialState: {
        participantId: '',
        age: '',
        group: 'Select group',
        gender: '',
        handedness: '',

        onlineShoppingFrequency: [],
        selectedDrugs: [],
        drugDosages: {},
        shoppingSatisfaction: 0
    },
    
    reducers: {

        setParticipantId: (state, action) => {
            state.participantId = action.payload;
        },
        setAge: (state, action) => {
            state.age = action.payload;
        },
        setGroup: (state, action) => {
            state.group = action.payload;
        },
        setGender: (state, action) => {
            state.gender = action.payload;
        },
        setHandedness: (state, action) => {
            state.handedness = action.payload;
        },

        setOnlineShoppingFrequency: (state, action) => {
            state.onlineShoppingFrequency = action.payload;
        },
        setSelectedDrugs: (state, action) => {
            state.selectedDrugs = action.payload;
        },
        setDrugDosages: (state, action) => {
            state.drugDosages = action.payload;
        },
        setShoppingSatisfaction: (state, action) => {
            state.shoppingSatisfaction = action.payload;
        }
    },
});

export const { 
    setParticipantId,
    setAge,
    setGroup,
    setGender,
    setHandedness,

    setOnlineShoppingFrequency, 
    setSelectedDrugs,
    setDrugDosages,
    setShoppingSatisfaction
    
} = surveySlice.actions;

export default surveySlice.reducer;