import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export interface InitialState {
    participantId: string;
    age: string;
    group: string;
    gender: string;
    handedness: string;

    onlineShoppingFrequency: string[];
    selectedDrugs: string[];
    othersLightbulbColor: string,
    ownLightbulbColor: string,
    drugDosages: Record<string, number>;
    drugDosages2: Record<string, number>;
    purchaseSatisfaction: number;
    claimSatisfaction: number;
    desireContinueShopping: number;
}

export const initialState = ()=> ({
    participantId: '',
    age: '',
    group: 'Select group',
    gender: '',
    handedness: '',

    onlineShoppingFrequency: [],
    selectedDrugs: [],
    drugDosages: {},
    drugDosages2: {},
    othersLightbulbColor: '',
    ownLightbulbColor: '',
    purchaseSatisfaction: 0,
    claimSatisfaction: 0,
    desireContinueShopping: 0
});

export function areObjectsEqual(obj1: any, obj2: any): boolean {
    if (typeof obj1 === 'number' && typeof obj2 === 'number') {
        return obj1 === obj2;
    } else {
        for (const key in obj1) {
            if (obj1.hasOwnProperty(key)) {
                if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
                    if (obj1[key].length !== obj2[key].length) return false;
                } else if (typeof obj1[key] === 'object' && typeof obj2[key] === 'object') {
                    if (!areObjectsEqual(obj1[key], obj2[key])) return false;
                } else {
                    if (obj1[key] !== obj2[key]) return false;
                }
            }
        }
    }
    return true;
}

export const surveySlice = createSlice({
    name: "survey",
    initialState: initialState(),
    
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
        setDrugDosages2: (state, action) => {
            state.drugDosages2 = action.payload;
        },
        setPurchaseSatisfaction: (state, action) => {
            state.purchaseSatisfaction = action.payload;
        },
        setClaimSatisfaction: (state, action) => {
            state.claimSatisfaction = action.payload;
        },
        setDesireContinueShopping: (state, action) => {
            state.desireContinueShopping = action.payload;
        },
        setOthersLightbulbColor: (state, action) => {
            state.othersLightbulbColor = action.payload;
        },
        setOwnLightbulbColor: (state, action) => {
            state.ownLightbulbColor = action.payload;
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
    setDrugDosages2,
    setPurchaseSatisfaction,
    setClaimSatisfaction,
    setDesireContinueShopping,
    setOthersLightbulbColor,
    setOwnLightbulbColor
    
} = surveySlice.actions;

export const selectParticipantId = (state: RootState) => state.survey.participantId;
export const selectAge = (state: RootState) => state.survey.age;
export const selectGroup = (state: RootState) => state.survey.group;
export const selectGender = (state: RootState) => state.survey.gender;
export const selectHandedness = (state: RootState) => state.survey.handedness;
export const selectOnlineShoppingFrequency = (state: RootState) => state.survey.onlineShoppingFrequency;
export const selectSelectedDrugs = (state: RootState) => state.survey.selectedDrugs;
export const selectDrugDosages = (state: RootState) => state.survey.drugDosages;
export const selectDrugDosages2 = (state: RootState) => state.survey.drugDosages2;
export const selectPurchaseSatisfaction = (state: RootState) => state.survey.purchaseSatisfaction;
export const selectClaimSatisfaction = (state: RootState) => state.survey.claimSatisfaction;
export const selectDesireContinueShopping = (state: RootState) => state.survey.desireContinueShopping;
export const selectOthersLightbulbColor = (state: RootState) => state.survey.othersLightbulbColor;
export const selectOwnLightbulbColor = (state: RootState) => state.survey.ownLightbulbColor;


export default surveySlice.reducer;
