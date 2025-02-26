import { DetailedStore, Store, StorePayload } from "@/types/store";
import { apiSlice } from "../apiSlice";

const storeAPI = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getStores: build.query<Store[], GetStoresArg>({
      query: ({ userId }) => ({ url: `/profiles/${userId}/stores` }),
      transformResponse: (response: { data: Store[] }) => response.data,
      providesTags: [{ type: "Store", id: "LIST" }],
      keepUnusedDataFor: 600,
    }),
    getStore: build.query<DetailedStore, GetStoreArg>({
      query: ({ storeId }) => ({ url: `/stores/${storeId}` }),
      transformResponse: (response: { data: DetailedStore }) => response.data,
      providesTags: (result, error, { storeId: id }) => [{ type: "Store", id }],
    }),
    storeStore: build.mutation<Store, StoreStoreArg>({
      query: ({ ...body }) => ({
        url: `/stores`,
        method: "POST",
        body,
      }),
      transformResponse: (response: { data: Store }) => response.data,
      async onQueryStarted({ userId }, { dispatch, queryFulfilled }) {
        const result = await queryFulfilled;
        dispatch(
          storeAPI.util.updateQueryData("getStores", { userId }, (draft) => {
            draft.push(result.data);
          })
        );
      },
    }),
    updateStore: build.mutation<Store, UpdateStoreArg>({
      query: ({ storeId, ...body }) => ({
        url: `/stores/${storeId}`,
        method: "PUT",
        body,
      }),
      transformResponse: (response: { data: Store }) => response.data,
      async onQueryStarted({ userId, storeId }, { dispatch, queryFulfilled }) {
        const result = await queryFulfilled;
        dispatch(
          storeAPI.util.updateQueryData("getStores", { userId }, (draft) => {
            const index = draft.findIndex(({ id }) => id === storeId);
            if (index !== -1) {
              draft.splice(index, 1, result.data);
            }
          })
        );
      },
    }),
    destroyStore: build.mutation<void, DestroyStoreArg>({
      query: ({ storeId }) => ({
        url: `/stores/${storeId}`,
        method: "DELETE",
      }),
      async onQueryStarted({ userId, storeId }, { dispatch, queryFulfilled }) {
        await queryFulfilled;
        dispatch(
          storeAPI.util.updateQueryData("getStores", { userId }, (draft) => {
            const index = draft.findIndex(({ id }) => id === storeId);
            if (index !== -1) {
              draft.splice(index, 1);
            }
          })
        );
      },
    }),
  }),
});

export const {
  useGetStoresQuery,
  useLazyGetStoreQuery,
  useStoreStoreMutation,
  useUpdateStoreMutation,
  useDestroyStoreMutation,
} = storeAPI;

interface GetStoresArg {
  userId: number;
}

interface GetStoreArg {
  storeId: number;
}

type StoreStoreArg = GetStoresArg & StorePayload;
type UpdateStoreArg = GetStoresArg & GetStoreArg & StorePayload;
type DestroyStoreArg = GetStoresArg & GetStoreArg;
