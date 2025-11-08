import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import * as SecureStore from "expo-secure-store";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: process.env.EXPO_PUBLIC_API_URL,
  prepareHeaders: async (headers) => {
    const bearerToken = await SecureStore.getItemAsync("session");
    headers.set("Accept", "application/json");
    headers.set("Authorization", `Bearer ${bearerToken}`);
    return headers;
  },
});

const dynamicBaseQuery = async (args: any, api: any, extraOptions: any) => {
  const dynamicUrl = await SecureStore.getItemAsync("apiBaseUrl");

  if (dynamicUrl) {
    if (typeof args === "string") {
      args = dynamicUrl + args;
    } else if (args.url) {
      args.url = dynamicUrl + args.url;
    }
  }

  return rawBaseQuery(args, api, extraOptions);
};

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
  baseQuery: dynamicBaseQuery,
  endpoints: (build) => ({}),
});
