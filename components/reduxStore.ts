import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import productReducer from "./Product/productSlice";
import productCategoryReducer from "./Product/categorySlice";
import storeSliceReducer from "./Store/storeSlice";
import paymentMethodReducer from "./PaymentMethod/paymentMethodSlice";
import orderReducer from "./Order/orderSlice";
import { listenerMiddleware } from "./reduxListenerMiddleware";
import { apiSlice } from "./apiSlice";

export const reduxStore = configureStore({
  reducer: {
    order: orderReducer,
    product: productReducer,
    store: storeSliceReducer,
    paymentMethod: paymentMethodReducer,
    productCategory: productCategoryReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(listenerMiddleware.middleware)
      .concat(apiSlice.middleware),
});

export type AppStore = typeof reduxStore;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export type AppThunk<ThunkReturnType = void> = ThunkAction<
  ThunkReturnType,
  RootState,
  unknown,
  Action
>;
