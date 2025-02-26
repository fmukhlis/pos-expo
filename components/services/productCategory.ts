import {
  DetailedProductCategory,
  ProductCategory,
  ProductCategoryPayload,
} from "@/types/product-category";
import { apiSlice } from "../apiSlice";

const productCategoryAPI = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => {
    return {
      getProductCategories: build.query<ProductCategory[], GetCategoriesArg>({
        query: ({ storeId }) => ({
          url: `/stores/${storeId}/product-categories`,
        }),
        transformResponse: (response: { data: ProductCategory[] }) =>
          response.data,
        providesTags: (result) => [{ type: "ProductCategory", id: "LIST" }],
      }),
      getProductCategory: build.query<DetailedProductCategory, GetCategoryArg>({
        query: ({ storeId, productCategoryId }) => ({
          url: `/stores/${storeId}/product-categories/${productCategoryId}`,
        }),
        transformResponse: (response: { data: DetailedProductCategory }) =>
          response.data,
        providesTags: (result, error, { productCategoryId: id }) => [
          { type: "ProductCategory", id },
        ],
      }),
      storeProductCategory: build.mutation<ProductCategory, StoreCategoryArg>({
        query: ({ storeId, ...body }) => ({
          url: `/stores/${storeId}/product-categories`,
          method: "POST",
          body,
        }),
        transformResponse: (response: { data: ProductCategory }) =>
          response.data,
        invalidatesTags: [{ type: "ProductCategory", id: "LIST" }],
      }),
      updateProductCategory: build.mutation<ProductCategory, UpdateCategoryArg>(
        {
          query: ({ storeId, productCategoryId, ...body }) => ({
            url: `/stores/${storeId}/product-categories/${productCategoryId}`,
            method: "PUT",
            body,
          }),
          transformResponse: (response: { data: ProductCategory }) =>
            response.data,
          invalidatesTags: [{ type: "ProductCategory", id: "LIST" }],
        }
      ),
      destroyProductCategory: build.mutation<void, DestroyCategoryArg>({
        query: ({ productCategoryId, storeId }) => ({
          url: `/stores/${storeId}/product-categories/${productCategoryId}`,
          method: "DELETE",
        }),
        async onQueryStarted(
          { storeId, productCategoryId },
          { dispatch, queryFulfilled }
        ) {
          try {
            await queryFulfilled;
            dispatch(
              productCategoryAPI.util.updateQueryData(
                "getProductCategories",
                { storeId },
                (draft) => {
                  const index = draft.findIndex(
                    (item) => item.id === productCategoryId
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
    };
  },
});

export const {
  useGetProductCategoriesQuery,
  useLazyGetProductCategoryQuery,
  useStoreProductCategoryMutation,
  useUpdateProductCategoryMutation,
  useDestroyProductCategoryMutation,
} = productCategoryAPI;

interface GetCategoriesArg {
  storeId: number;
}

interface GetCategoryArg {
  storeId: number;
  productCategoryId: number;
}

type StoreCategoryArg = GetCategoriesArg & ProductCategoryPayload;

type UpdateCategoryArg = GetCategoryArg & ProductCategoryPayload;

type DestroyCategoryArg = GetCategoryArg;
