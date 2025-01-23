import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ProductData, ProductProps } from "@/types/product";
import { createAppAsyncThunk } from "../reduxHooks";
import api from "@/utils/api";

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

export const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      });

    builder
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? null;
      });
  },
});

export const { clearError } = productSlice.actions;

export default productSlice.reducer;

export const createProduct = createAppAsyncThunk(
  "product/createProduct",
  async (data: ProductData & { storeId: number; bearerToken: string }) => {
    const { storeId, bearerToken, ...rest } = data;
    const response = await api.post(`/stores/${storeId}/products`, rest, {
      headers: { Authorization: "Bearer " + bearerToken },
    });
    return response.data.data as ProductProps;
  }
);

export const getProducts = createAppAsyncThunk(
  "product/getProducts",
  async (data: { storeId: number; bearerToken: string }) => {
    const { storeId, bearerToken } = data;
    const response = await api.get(`/stores/${storeId}/products`, {
      headers: { Authorization: "Bearer " + bearerToken },
    });
    return response.data.data as ProductProps[];
  }
);

interface ProductState {
  products: ProductProps[];
  loading: boolean;
  error: string | null;
}
