
interface Item {
    image_name: string;
    item: number;
    minimum: number;
    maximum: number;
  }

  interface Product {
    image_name: string;
    minimum: number;
    maximum: number;
  }
  
  interface ProductCategories {
    [category: string]: { [id: string]: Product };
  }