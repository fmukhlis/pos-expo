import { apiSlice } from "../apiSlice";
import {
  DetailedPaymentMethod,
  PaymentMethod,
  PaymentMethodPayload,
} from "@/types/payment-method";

const paymentMethodAPI = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getPaymentMethods: build.query<PaymentMethod[], GetPaymentMethodsArg>({
      query: ({ storeId }) => ({ url: `/stores/${storeId}/payment-methods` }),
      transformResponse: (response: { data: PaymentMethod[] }) => response.data,
      providesTags: [{ type: "PaymentMethod", id: "LIST" }],
    }),
    getPaymentMethod: build.query<DetailedPaymentMethod, GetPaymentMethodArg>({
      query: ({ paymentMethodId, storeId }) => ({
        url: `/stores/${storeId}/payment-methods/${paymentMethodId}`,
      }),
      transformResponse: (response: { data: DetailedPaymentMethod }) =>
        response.data,
      providesTags: (result, error, { storeId: id }) => [
        { type: "PaymentMethod", id },
      ],
    }),
    storePaymentMethod: build.mutation<PaymentMethod, StorePaymentMethodArg>({
      query: ({ storeId, ...body }) => ({
        url: `/stores/${storeId}/payment-methods`,
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: PaymentMethod }) => response.data,
      async onQueryStarted({ storeId }, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            paymentMethodAPI.util.updateQueryData(
              "getPaymentMethods",
              { storeId },
              (draft) => {
                draft.push(result.data);
              }
            )
          );
        } catch (error) {}
      },
    }),
    updatePaymentMethod: build.mutation<PaymentMethod, UpdatePaymentMethodArg>({
      query: ({ storeId, paymentMethodId, ...body }) => ({
        url: `/stores/${storeId}/payment-methods/${paymentMethodId}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: { data: PaymentMethod }) => response.data,
      async onQueryStarted(
        { paymentMethodId, storeId },
        { dispatch, queryFulfilled }
      ) {
        try {
          const result = await queryFulfilled;
          dispatch(
            paymentMethodAPI.util.updateQueryData(
              "getPaymentMethods",
              { storeId },
              (draft) => {
                const index = draft.findIndex(
                  ({ id }) => id === paymentMethodId
                );
                if (index !== -1) {
                  draft.splice(index, 1, result.data);
                }
              }
            )
          );
        } catch (error) {}
      },
    }),
    destroyPaymentMethod: build.mutation<void, DestroyPaymentMethodArg>({
      query: ({ storeId, paymentMethodId }) => ({
        url: `/stores/${storeId}/payment-methods/${paymentMethodId}`,
        method: "DELETE",
      }),
      async onQueryStarted(
        { paymentMethodId, storeId },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
          dispatch(
            paymentMethodAPI.util.updateQueryData(
              "getPaymentMethods",
              { storeId },
              (draft) => {
                const index = draft.findIndex(
                  ({ id }) => id === paymentMethodId
                );
                if (index !== -1) {
                  draft.splice(index, 1);
                }
              }
            )
          );
        } catch (error) {}
      },
    }),
  }),
});

export const {
  useGetPaymentMethodsQuery,
  useLazyGetPaymentMethodQuery,
  useDestroyPaymentMethodMutation,
  useStorePaymentMethodMutation,
  useUpdatePaymentMethodMutation,
} = paymentMethodAPI;

interface GetPaymentMethodsArg {
  storeId: number;
}

interface GetPaymentMethodArg extends GetPaymentMethodsArg {
  paymentMethodId: number;
}

type StorePaymentMethodArg = GetPaymentMethodsArg & PaymentMethodPayload;
type UpdatePaymentMethodArg = GetPaymentMethodArg & PaymentMethodPayload;
type DestroyPaymentMethodArg = GetPaymentMethodArg;
