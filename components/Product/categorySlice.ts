import {
  ProductCategory,
  ProductCategoryDetails,
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
  loading: {
    destroyCategory: false,
    getCategories: false,
    getCategory: false,
    storeCategory: false,
    updateCategory: false,
  },
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
  extraReducers: (builder) => {
    builder
      .addCase(storeCategory.pending, (state) => {
        state.loading.storeCategory = true;
      })
      .addCase(storeCategory.fulfilled, (state) => {
        state.loading.storeCategory = false;
      })
      .addCase(storeCategory.rejected, (state, actions) => {
        state.loading.storeCategory = false;
        Toast.show({
          type: "error",
          text1: "Error",
          text2: actions.error.message,
          autoHide: true,
          swipeable: false,
        });
      });

    builder
      .addCase(getCategories.pending, (state) => {
        state.loading.getCategories = true;
      })
      .addCase(getCategories.fulfilled, (state, actions) => {
        state.categories = actions.payload;
        state.loading.getCategories = false;
      })
      .addCase(getCategories.rejected, (state, actions) => {
        state.loading.getCategories = false;
        Toast.show({
          type: "error",
          text1: "Error",
          text2: actions.error.message,
          autoHide: true,
          swipeable: false,
        });
      });

    builder
      .addCase(getCategory.pending, (state) => {
        state.loading.getCategory = true;
      })
      .addCase(getCategory.fulfilled, (state, actions) => {
        const { name, products } = actions.payload;
        state.data = {
          name,
          productIds: products.map((product) => product.id),
        };
        state.assignedProducts = products;
        state.loading.getCategory = false;
      })
      .addCase(getCategory.rejected, (state, actions) => {
        state.loading.getCategory = false;
        Toast.show({
          type: "error",
          text1: "Error",
          text2: actions.error.message,
          autoHide: true,
          swipeable: false,
        });
      });

    builder
      .addCase(destroyCategory.pending, (state) => {
        state.loading.destroyCategory = true;
      })
      .addCase(destroyCategory.fulfilled, (state) => {
        state.loading.destroyCategory = false;
      })
      .addCase(destroyCategory.rejected, (state, actions) => {
        state.loading.destroyCategory = false;
        Toast.show({
          type: "error",
          text1: "Error",
          text2: actions.error.message,
          autoHide: true,
          swipeable: false,
        });
      });

    builder
      .addCase(updateCategory.pending, (state) => {
        state.loading.updateCategory = true;
      })
      .addCase(updateCategory.fulfilled, (state) => {
        state.loading.updateCategory = false;
      })
      .addCase(updateCategory.rejected, (state, actions) => {
        state.loading.updateCategory = false;
        Toast.show({
          type: "error",
          text1: "Error",
          text2: actions.error.message,
          autoHide: true,
          swipeable: false,
        });
      });
  },
});

export const { setData, resetData, setSelectedCategoryId } =
  categorySlice.actions;

export default categorySlice.reducer;

export const storeCategory = createAppAsyncThunk(
  "productCategory/createCategory",
  async (
    data: ProductCategoryPayload & {
      storeId: number;
    },
    getThunkAPI
  ) => {
    const { storeId, ...rest } = data;
    const bearerToken = await SecureStore.getItemAsync("session");
    const response = await api.post(
      `/stores/${storeId}/product-categories`,
      rest,
      {
        headers: { Authorization: "Bearer " + bearerToken },
      }
    );
    getThunkAPI.dispatch(getCategories({ storeId }));
  }
);

export const getCategories = createAppAsyncThunk(
  "productCategory/getCategories",
  async (data: { storeId: number }) => {
    const { storeId } = data;
    const bearerToken = await SecureStore.getItemAsync("session");
    const response = await api.get(`/stores/${storeId}/product-categories`, {
      headers: { Authorization: "Bearer " + bearerToken },
    });
    return response.data.data as ProductCategory[];
  }
);

export const getCategory = createAppAsyncThunk(
  "productCategory/getCategory",
  async (data: { storeId: number; productCategoryId: number }) => {
    const { storeId, productCategoryId } = data;
    const bearerToken = await SecureStore.getItemAsync("session");
    const response = await api.get(
      `/stores/${storeId}/product-categories/${productCategoryId}`,
      {
        headers: { Authorization: "Bearer " + bearerToken },
      }
    );
    return response.data.data as ProductCategoryDetails;
  }
);

export const destroyCategory = createAppAsyncThunk(
  "productCategory/destroyCategory",
  async (data: { storeId: number; productCategoryId: number }, getThunkAPI) => {
    const { productCategoryId, storeId } = data;
    const bearerToken = await SecureStore.getItemAsync("session");
    await api.delete(
      `/stores/${storeId}/product-categories/${productCategoryId}`,
      { headers: { Authorization: "Bearer " + bearerToken } }
    );
    getThunkAPI.dispatch(getCategories({ storeId }));
  }
);

export const updateCategory = createAppAsyncThunk(
  "productCategory/updateCategory",
  async (
    data: ProductCategoryPayload & {
      storeId: number;
      productCategoryId: number;
    },
    getThunkAPI
  ) => {
    const { storeId, productCategoryId, ...rest } = data;
    const bearerToken = await SecureStore.getItemAsync("session");
    const response = await api.put(
      `/stores/${storeId}/product-categories/${productCategoryId}`,
      rest,
      { headers: { Authorization: "Bearer " + bearerToken } }
    );
    getThunkAPI.dispatch(getCategories({ storeId }));
  }
);

interface CategoryState {
  categories: ProductCategory[];
  selectedCategoryId: number | null;
  data: ProductCategoryPayload;
  assignedProducts: {
    id: number;
    name: string;
  }[];
  loading: {
    getCategories: boolean;
    getCategory: boolean;
    storeCategory: boolean;
    updateCategory: boolean;
    destroyCategory: boolean;
  };
}
