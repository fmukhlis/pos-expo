import { apiSlice } from "../apiSlice";
import { Permission, PermissionPayload } from "@/types/permission";

const permissionAPI = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (build) => ({
    getPermissions: build.query<Permission[], GetPermissionsArg>({
      query: ({ storeId }) => ({ url: `/stores/${storeId}/permissions` }),
      transformResponse: (data: { data: Permission[] }) => data.data,
      providesTags: [{ type: "Permission", id: "LIST" }],
    }),
    getPermission: build.query<Permission, GetPermissionArg>({
      query: ({ permissionId, storeId }) => ({
        url: `/stores/${storeId}/permissions/${permissionId}`,
      }),
      transformResponse: (data: { data: Permission }) => data.data,
      providesTags: (result, error, { permissionId: id }) => [
        { type: "Permission", id },
      ],
    }),
    storePermission: build.mutation<Permission, StorePermissionArg>({
      query: ({ storeId, ...body }) => ({
        url: `/stores/${storeId}/permissions`,
        method: "POST",
        body,
      }),
      transformResponse: (data: { data: Permission }) => data.data,
      async onQueryStarted({ storeId }, { dispatch, queryFulfilled }) {
        try {
          const result = await queryFulfilled;
          dispatch(
            permissionAPI.util.updateQueryData(
              "getPermissions",
              { storeId },
              (draft) => {
                draft.push(result.data);
              }
            )
          );
        } catch (error) {}
      },
    }),
    updatePermission: build.mutation<Permission, UpdatePermissionArg>({
      query: ({ permissionId, storeId, ...body }) => ({
        url: `/stores/${storeId}/permissions/${permissionId}`,
        method: "PUT",
        body,
      }),
      transformResponse: (data: { data: Permission }) => data.data,
      async onQueryStarted(
        { permissionId, storeId },
        { dispatch, queryFulfilled }
      ) {
        try {
          const result = await queryFulfilled;
          dispatch(
            permissionAPI.util.updateQueryData(
              "getPermissions",
              { storeId },
              (draft) => {
                const index = draft.findIndex(({ id }) => id === permissionId);
                if (index !== -1) {
                  draft.splice(index, 1, result.data);
                }
              }
            )
          );
        } catch (error) {}
      },
    }),
    destroyPermission: build.mutation<void, DestroyPermissionArg>({
      query: ({ permissionId, storeId }) => ({
        url: `/stores/${storeId}/permissions/${permissionId}`,
        method: "DELETE",
      }),
      async onQueryStarted(
        { permissionId, storeId },
        { dispatch, queryFulfilled }
      ) {
        try {
          await queryFulfilled;
          dispatch(
            permissionAPI.util.updateQueryData(
              "getPermissions",
              { storeId },
              (draft) => {
                const index = draft.findIndex(({ id }) => id === permissionId);
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
  useGetPermissionsQuery,
  useLazyGetPermissionQuery,
  useStorePermissionMutation,
  useUpdatePermissionMutation,
  useDestroyPermissionMutation,
} = permissionAPI;

interface GetPermissionsArg {
  storeId: number;
}

interface GetPermissionArg {
  storeId: number;
  permissionId: number;
}

type StorePermissionArg = GetPermissionsArg & PermissionPayload;
type UpdatePermissionArg = GetPermissionArg & PermissionPayload;
type DestroyPermissionArg = GetPermissionArg;
