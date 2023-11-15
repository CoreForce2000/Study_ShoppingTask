interface Product {
  item_id: number;
  category: string;
  image_name: string;
  minimum: number;
  maximum: number;
}
  
interface ProductCategories {
  [category: string]: { [id: string]: Product };
}

// Define a type for the slice state
interface ShopState {
  budget: number;
  items: Product[];
  products: ProductCategories;
  shuffledItems: Product[];
  shuffledCategories: string[];
}
