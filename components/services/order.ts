import { apiSlice } from "../apiSlice";
import { Order, OrderPayload } from "@/types/order";

const orderAPI = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getOrders: build.query<Order[], GetOrdersArg>({
      query: ({ storeId }) => `/stores/${storeId}/orders`,
      transformResponse: (data: { data: Order[] }) => data.data,
      providesTags: [{ type: "Permission", id: "LIST" }],
    }),
    storeOrder: build.mutation<Order, StoreOrderArg>({
      query: ({ storeId, ...body }) => ({
        url: `/stores/${storeId}/orders`,
        method: "POST",
        body,
      }),
      transformResponse: (data: { data: Order }) => data.data,
      invalidatesTags: [{ type: "Permission", id: "LIST" }],
    }),
  }),
});

export const { useGetOrdersQuery, useStoreOrderMutation } = orderAPI;

interface GetOrdersArg {
  storeId: number;
}

type StoreOrderArg = GetOrdersArg & OrderPayload;
