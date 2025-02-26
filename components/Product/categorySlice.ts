import {
  ProductCategory,
  DetailedProductCategory,
  ProductCategoryPayload,
} from "@/types/product-category";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import Toast from "react-native-toast-message";
import {
  AppStartListening,
  startAppListening,
} from "../reduxListenerMiddleware";
import { createAppAsyncThunk } from "../reduxHooks";
import api from "@/utils/api";
import * as SecureStore from "expo-secure-store";

const initialState: CategoryState = {
  categories: [],
  selectedCategoryId: null,
  data: {
    name: "",
    productIds: [],
  },
  assignedProducts: [],
};

export const categorySlice = createSlice({
  name: "productCategory",
  initialState,
  reducers: {
    setData: (
      state,
      actions: PayloadAction<{
        name?: string;
        products?: { id: number; name: string }[];
      }>
    ) => {
      const { name, products } = actions.payload;
      if (name !== undefined && name !== null) {
        state.data.name = name;
      }
      if (products) {
        state.data.productIds = products.map((product) => product.id);
        state.assignedProducts = products;
      }
    },
    resetData: (state) => {
      state.data = {
        name: "",
        productIds: [],
      };
      state.assignedProducts = [];
    },
    setSelectedCategoryId: (state, actions: PayloadAction<number | null>) => {
      state.selectedCategoryId = actions.payload;
    },
  },
  extraReducers: (builder) => {},
});

export const { setData, resetData, setSelectedCategoryId } =
  categorySlice.actions;

export default categorySlice.reducer;

interface CategoryState {
  categories: ProductCategory[];
  selectedCategoryId: number | null;
  data: ProductCategoryPayload;
  assignedProducts: {
    id: number;
    name: string;
  }[];
}
