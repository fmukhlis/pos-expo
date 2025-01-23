import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";
import productReducer from "./Product/productSlice";
import productCategoryReducer from "./Product/categorySlice";
import { listenerMiddleware } from "./reduxListenerMiddleware";

export const reduxStore = configureStore({
  reducer: {
    product: productReducer,
    productCategory: productCategoryReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
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
