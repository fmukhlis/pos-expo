import { combineReducers } from "@reduxjs/toolkit";

import orderReducer from "./Order/orderSlice";
import productReducer from "./Product/productSlice";
import storeSliceReducer from "./Store/storeSlice";
import paymentMethodReducer from "./PaymentMethod/paymentMethodSlice";
import productCategoryReducer from "./Product/categorySlice";

import { apiSlice } from "./apiSlice";

const appReducer = combineReducers({
  order: orderReducer,
  product: productReducer,
  store: storeSliceReducer,
  paymentMethod: paymentMethodReducer,
  productCategory: productCategoryReducer,
  [apiSlice.reducerPath]: apiSlice.reducer,
});

const rootReducer = (
  state: ReturnType<typeof appReducer> | undefined,
  action: any
) => {
  if (action.type === "user/logout") {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
