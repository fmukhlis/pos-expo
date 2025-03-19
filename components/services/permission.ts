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
  }),
});

export const { useGetPermissionsQuery } = permissionAPI;

interface GetPermissionsArg {
  storeId: number;
}

interface GetPermissionArg {
  storeId: number;
  permissionId: number;
}

type StorePermissionArg = GetPermissionsArg & PermissionPayload;
type UpdatePermissionArg = GetPermissionsArg & PermissionPayload;
type DeletePermissionArg = GetPermissionArg;
