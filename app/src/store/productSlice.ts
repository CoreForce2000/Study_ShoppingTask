import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import jsonData from '../assets/categories/image_data.json';
import { RootState } from './store';


const productSlice = createSlice({
  name: 'products',
  initialState: jsonData as ProductCategories,
  reducers: {
    // Example reducer: update a product
    updateProduct: (state, action: PayloadAction<{ categoryId: string; productId: string; product: Item }>) => {
      const { categoryId, productId, product } = action.payload;
      state[categoryId][productId] = product;
    },
    // Add more reducers as needed
  }
});

export const selectAllCategories = (state: RootState) => {
  return Object.keys(state.product);
};

export const selectItemsByCategory = (state: RootState, category: string) => {
  return state.product[category];
};

export const selectProduct = (state: RootState, category: string, item: number) => {
  return state.product[category]?.[item];
};



export const { updateProduct } = productSlice.actions;
export default productSlice.reducer;
