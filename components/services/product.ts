import { DetailedProduct, Product, ProductPayload } from "@/types/product";
import { apiSlice } from "../apiSlice";

const productAPI = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => {
    return {
      getProducts: build.query<Product[], GetProductsArg>({
        query: ({ storeId }) => ({ url: `/stores/${storeId}/products` }),
        transformResponse: (response: { data: Product[] }) => response.data,
        providesTags: (result) => [{ type: "Product", id: "LIST" }],
      }),
      getProduct: build.query<DetailedProduct, GetProductArg>({
        query: ({ storeId, productId }) => ({
          url: `/stores/${storeId}/products/${productId}`,
        }),
        transformResponse: (response: { data: DetailedProduct }) =>
          response.data,
        providesTags: (result, error, { productId: id }) => {
          return [{ type: "Product", id }];
        },
      }),
      storeProduct: build.mutation<Product, StoreProductArg>({
        query: ({ storeId, ...body }) => ({
          url: `/stores/${storeId}/products`,
          method: "POST",
          body,
        }),
        transformResponse: (response: { data: Product }) => response.data,
        async onQueryStarted({ storeId }, { dispatch, queryFulfilled }) {
          try {
            const result = await queryFulfilled;
            dispatch(
              productAPI.util.updateQueryData(
                "getProducts",
                { storeId },
                (draft) => {
                  if (result.data) {
                    draft.push(result.data);
                  }
                }
              )
            );
          } catch (error) {}
        },
      }),
      updateProduct: build.mutation<Product, UpdateProductArg>({
        query: ({ storeId, productId, ...body }) => ({
          url: `/stores/${storeId}/products/${productId}`,
          method: "PUT",
          body,
        }),
        transformResponse: (response: { data: Product }) => response.data,
        async onQueryStarted(
          { storeId, productId },
          { dispatch, queryFulfilled }
        ) {
          try {
            const result = await queryFulfilled;
            dispatch(
              productAPI.util.updateQueryData(
                "getProducts",
                { storeId },
                (draft) => {
                  if (result.data) {
                    const index = draft.findIndex(
                      (item) => item.id == productId
                    );
                    if (index !== -1) {
                      draft.splice(index, 1, result.data);
                    }
                  }
                }
              )
            );
          } catch (error) {}
        },
      }),
      destroyProduct: build.mutation<void, DestroyProductArg>({
        query: ({ storeId, productId }) => ({
          url: `/stores/${storeId}/products/${productId}`,
          method: "DELETE",
        }),
        async onQueryStarted(
          { productId, storeId },
          { queryFulfilled, dispatch }
        ) {
          try {
            await queryFulfilled;
            dispatch(
              productAPI.util.updateQueryData(
                "getProducts",
                { storeId },
                (draft) => {
                  const indexToRemove = draft.findIndex(
                    (item) => item.id == productId
                  );
                  draft.splice(indexToRemove, 1);
                }
              )
            );
          } catch (error) {}
        },
      }),
    };
  },
});

export const {
  useLazyGetProductQuery,
  useGetProductsQuery,
  useStoreProductMutation,
  useUpdateProductMutation,
  useDestroyProductMutation,
} = productAPI;

interface GetProductsArg {
  storeId: number;
}
interface GetProductArg {
  storeId: number;
  productId: number;
}
type StoreProductArg = GetProductsArg & ProductPayload;
type UpdateProductArg = GetProductArg & ProductPayload;
type DestroyProductArg = GetProductArg;
