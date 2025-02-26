import { createSlice } from "@reduxjs/toolkit";
import { Product } from "@/types/product";

const initialState: ProductState = {
  products: [],
  selectedProductId: null,
  loading: {
    getProducts: false,
    getProduct: false,
    storeProduct: false,
    updateProduct: false,
    destroyProduct: false,
  },
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {},
});

export default productSlice.reducer;

interface ProductState {
  products: Product[];
  selectedProductId: number | null;
  loading: {
    getProducts: false;
    getProduct: false;
    storeProduct: false;
    updateProduct: false;
    destroyProduct: false;
  };
}
