export interface ProductCategory {
  id: number;
  name: string;
  productsCount: number;
}

export interface DetailedProductCategory extends ProductCategory {
  products: {
    id: number;
    name: string;
  }[];
}

export interface ProductCategoryPayload {
  name: string;
  productIds: number[];
}
