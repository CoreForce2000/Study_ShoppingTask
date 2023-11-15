// Assuming this file is named store.ts and is located in a directory that could be imported as `@/store`

import { configureStore } from '@reduxjs/toolkit';
import surveyReducer from './surveySlice';
import configReducer from './configSlice';
import shopReducer from './shopSlice';

const store = configureStore({
  reducer: {
    survey: surveyReducer,
    config: configReducer,
    shop: shopReducer,
    // shopState: shopStateReducer,
  },
});

// Export the store's dispatch function type
export type AppDispatch = typeof store.dispatch;

// Infer the RootState from the store itself
export type RootState = ReturnType<typeof store.getState>;

export default store;
