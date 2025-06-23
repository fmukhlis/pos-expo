import { apiSlice } from "../apiSlice";
import {
  Order,
  OrderPayload,
  DetailedOrder,
  IssueRefundPayload,
} from "@/types/order";

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
    getOrder: build.query<DetailedOrder, GetOrderArg>({
      query: ({ orderId, storeId }) => ({
        url: `/stores/${storeId}/orders/${orderId}`,
        method: "GET",
      }),
      transformResponse: (data: { data: DetailedOrder }) => data.data,
      providesTags: (result, error, { orderId: id }) => [{ type: "Order", id }],
    }),
    refundItems: build.mutation<void, RefundItemsArg>({
      query: ({ storeId, orderId, ...body }) => ({
        url: `/stores/${storeId}/orders/${orderId}/refund`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (result, error, { orderId: id }) => {
        if (!error?.status) {
          return [
            { type: "Order", id: "LIST" },
            { type: "Order", id },
          ];
        }
        return [];
      },
    }),
  }),
});

export const {
  useLazyGetOrderQuery,
  useStoreOrderMutation,
  useRefundItemsMutation,
  useGetTransactionHistoryInfiniteQuery,
} = orderAPI;

interface GetTransactionHistoryArg {
  date?: string;
  storeId: number;
  refreshKey?: number;
}

interface GetOrderArg {
  storeId: number;
  orderId: number;
}

type StoreOrderArg = { storeId: number } & OrderPayload;

type RefundItemsArg = IssueRefundPayload & GetOrderArg;

interface TransactionHistory
  extends Pick<Order, "id" | "totalAmount" | "createdAt"> {
  refunds: Pick<
    DetailedOrder["refunds"][number],
    "refundedAt" | "totalAmount"
  >[];
  orderedProducts: Pick<
    Order["orderedProducts"][number],
    "id" | "name" | "quantity"
  >[];
}
