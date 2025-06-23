import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as SecureStore from "expo-secure-store";

export const apiSlice = createApi({
  reducerPath: "api",
  tagTypes: [
    "Product",
    "ProductCategory",
    "Store",
    "PaymentMethod",
    "Permission",
    "Employee",
    "IncomingEmployeeInvitation",
    "OutgoingEmployeeInvitation",
    "Order",
  ],
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.EXPO_PUBLIC_API_URL,
    prepareHeaders: async (headers) => {
      const bearerToken = await SecureStore.getItemAsync("session");
      headers.set("Accept", "application/json");
      headers.set("Authorization", `Bearer ${bearerToken}`);
      return headers;
    },
  }),
  endpoints: (build) => ({}),
});
