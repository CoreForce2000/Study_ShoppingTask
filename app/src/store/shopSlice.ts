import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "./store";
import jsonData from '../assets/categories/image_data.json';
import { config } from '../configs/config'; // Adjust the path as needed


const IMAGE_BASE_PATH = 'src/assets/categories/';


interface ProductCategories {
  [category: string]: { [id: string]: Product };
}

interface ShopState {
  budget: number;
  items: Product[];
  products: ProductCategories;
  shuffledItems: Product[];
  shuffledCategories: string[];
  clickedCategories: string[];
  clickedItems: Record<string, string[]>;
}

const initialState: ShopState = {
  budget: 1000,
  items: [],
  products: jsonData as ProductCategories,
  shuffledItems: [],
  shuffledCategories: [],
  clickedCategories: [],
  clickedItems: {}
};


export const shopSlice = createSlice({
    name: "shop",
    initialState,
    reducers: {

        setBudget: (state, action: PayloadAction<number>) => {
            state.budget = action.payload;
        },
        purchaseItem: (state, action: PayloadAction<number>) => {
            state.budget -= action.payload;
        },
        returnItem: (state, action: PayloadAction<number>) => {
            state.budget += action.payload;
        },
        addItem: (state, action: PayloadAction<Product>) => {
            state.items.push(action.payload);
        },
        removeItem: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.image_name !== action.payload);
        },
        setShuffledItems: (state, action: PayloadAction<Product[]>) => {
            state.shuffledItems = action.payload;
        },
        setShuffledCategories: (state, action: PayloadAction<string[]>) => {
            state.shuffledCategories = action.payload;
        },
        categoryClicked: (state, action: PayloadAction<string>) => {
        if (!state.clickedCategories.includes(action.payload)) {
            state.clickedCategories.push(action.payload);
        }
        },
        itemClicked: (state, action: PayloadAction<{ category: string; itemName: string }>) => {
        const { category, itemName } = action.payload;
        if (!state.clickedItems[category]) {
            state.clickedItems[category] = [];
        }
        if (!state.clickedItems[category].includes(itemName)) {
            state.clickedItems[category].push(itemName);
        }
        }
    },
});


export const selectAllCategories = (state: RootState): string[] => {
  return Object.keys(state.shop.products);
};

export const selectItemsByCategory = (state: RootState, category: string): Product[] => {
  const categoryProducts = state.shop.products[category];
  return categoryProducts ? Object.values(categoryProducts) : [];
};

export const selectShuffledItemsByCategory = (state: RootState, category: string): Product[] => {
  return state.shop.shuffledItems.filter(item => item.category === category);
};

export const selectShuffledCategories = (state: RootState): string[] => {
  return state.shop.shuffledCategories
}

export const selectProduct = (state: RootState, category: string, itemId: number): Product | undefined => {
  return state.shop.products[category]?.[itemId.toString()];
};

export const selectImagePath = (state: RootState, category: string, itemId: number): string => {
  const product = state.shop.products[category]?.[itemId.toString()];
  return product ? `${config.IMAGE_BASE_PATH}${category}/${product.image_name}` : '';
};


export const { setBudget, purchaseItem, returnItem, addItem, removeItem, setShuffledItems, setShuffledCategories } = shopSlice.actions;
export default shopSlice.reducer;
