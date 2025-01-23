import { ProductData, ProductProps } from "@/types/product";
import api from "@/utils/api";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (data: ProductData & { storeId: number; bearerToken: string }) => {
    const { storeId, bearerToken, ...rest } = data;
    const response = await api.post(`/stores/${storeId}/products`, rest, {
      headers: { Authorization: "Bearer " + bearerToken },
    });
    return response.data.data as ProductProps;
  }
);

export const getProducts = createAsyncThunk(
  "product/getProducts",
  async (data: { storeId: number; bearerToken: string }) => {
    const { storeId, bearerToken } = data;
    const response = await api.get(`/stores/${storeId}/products`, {
      headers: { Authorization: "Bearer " + bearerToken },
    });
    return response.data.data as ProductProps[];
  }
);
