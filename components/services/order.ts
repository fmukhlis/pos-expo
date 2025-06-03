import { apiSlice } from "../apiSlice";
import { TransactionHistory, Order, OrderPayload } from "@/types/order";

export const orderAPI = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getTransactionHistory: build.infiniteQuery<
      {
        data: TransactionHistory[];
        meta: { next_cursor: string; prev_cursor: string };
      },
      GetTransactionHistoryArg,
      string
    >({
      infiniteQueryOptions: {
        initialPageParam: "",
        getNextPageParam: (lastPage) => {
          if (!lastPage.meta.next_cursor) {
            return undefined;
          }
          return lastPage.meta.next_cursor;
        },
        getPreviousPageParam: (firstPage) => {
          if (!firstPage.meta.prev_cursor) {
            return undefined;
          }
          return firstPage.meta.prev_cursor;
        },
      },
      query: ({ pageParam: cursor, queryArg: { storeId } }) =>
        `/stores/${storeId}/transaction-history?cursor=${cursor}`,
      providesTags: [{ type: "Order", id: "LIST" }],
    }),
    storeOrder: build.mutation<Order, StoreOrderArg>({
      query: ({ storeId, ...body }) => ({
        url: `/stores/${storeId}/orders`,
        method: "POST",
        body,
      }),
      transformResponse: (data: { data: Order }) => data.data,
      invalidatesTags: [{ type: "Order", id: "LIST" }],
    }),
  }),
});

export const { useGetTransactionHistoryInfiniteQuery, useStoreOrderMutation } =
  orderAPI;

interface GetTransactionHistoryArg {
  storeId: number;
  refreshKey?: number;
  date?: string;
}

type StoreOrderArg = { storeId: number } & OrderPayload;
