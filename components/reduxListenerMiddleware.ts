import { addListener, createListenerMiddleware } from "@reduxjs/toolkit";
import { AppDispatch, RootState } from "./reduxStore";

export const listenerMiddleware = createListenerMiddleware();
export const startAppListening = listenerMiddleware.startListening.withTypes<
  RootState,
  AppDispatch
>();
export const addAppListener = addListener.withTypes<RootState, AppDispatch>();

export type AppStartListening = typeof startAppListening;
export type AppAddListener = typeof addAppListener;
