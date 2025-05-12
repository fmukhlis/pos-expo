import { Action, configureStore, ThunkAction } from "@reduxjs/toolkit";

import { apiSlice } from "./apiSlice";
import { listenerMiddleware } from "./reduxListenerMiddleware";
import rootReducer from "./rootReducer";

export const reduxStore = configureStore({
  reducer: rootReducer,
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
