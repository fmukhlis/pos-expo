export interface ProductCategory {
  id: number;
  name: string;
  productsCount: string;
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
