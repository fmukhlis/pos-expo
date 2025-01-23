import { useSession } from "@/contexts/SessionContext";
import api from "@/utils/api";
import { useStore } from "@/contexts/StoreContext";
import { PermissionData, PermissionProps } from "@/contexts/PermissionContext";
import axios from "axios";

export default function usePermissionAPI() {
  const { session: bearerToken } = useSession();
  const { selectedStore } = useStore();

  const getPermissions = async (param?: GetPermissionsParam) => {
    try {
      if (param?.onStart) {
        param.onStart();
      }

      const response = await api.get(
        "/stores/" + selectedStore?.id + "/permissions",
        {
          headers: {
            Authorization: "Bearer " + bearerToken,
          },
        }
      );

      if (param?.onSuccess) {
        param.onSuccess(response.data.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (param?.onFailed) {
          param.onFailed(error.message);
        }
      }
    } finally {
      if (param?.onFinish) {
        param.onFinish();
      }
    }
  };

  const getPermission = async (param?: GetPermissionParam) => {
    try {
      if (param?.onStart) {
        param.onStart();
      }
      const response = await api.get(
        "/stores/" + selectedStore?.id + "/permissions/" + param?.permissionId,
        {
          headers: {
            Authorization: "Bearer " + bearerToken,
          },
        }
      );
      if (param?.onSuccess) {
        param.onSuccess(response.data.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (param?.onFailed) {
          param.onFailed(error.message);
        }
      }
    } finally {
      if (param?.onFinish) {
        param.onFinish();
      }
    }
  };

  const createPermission = async (param?: CreatePermissionParam) => {
    try {
      if (param?.onStart) {
        param.onStart();
      }
      const response = await api.post(
        "/stores/" + selectedStore?.id + "/permissions",
        param?.data,
        {
          headers: {
            Authorization: "Bearer " + bearerToken,
          },
        }
      );
      if (param?.onSuccess) {
        param.onSuccess(response.data.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (param?.onFailed) {
          param.onFailed(error.message);
        }
      }
    } finally {
      if (param?.onFinish) {
        param.onFinish();
      }
    }
  };

  const updatePermission = async (param?: UpdatePermissionParam) => {
    try {
      if (param?.onStart) {
        param.onStart();
      }
      const response = await api.put(
        "/stores/" + selectedStore?.id + "/permissions/" + param?.permissionId,
        param?.data,
        {
          headers: {
            Authorization: "Bearer " + bearerToken,
          },
        }
      );
      if (param?.onSuccess) {
        param.onSuccess(response.data.data);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (param?.onFailed) {
          param.onFailed(error.message);
        }
      }
    } finally {
      if (param?.onFinish) {
        param.onFinish();
      }
    }
  };

  const deletePermission = async (param?: DeletePermissionParam) => {
    try {
      if (param?.onStart) {
        param.onStart();
      }
      const response = api.delete(
        "/stores/" + selectedStore?.id + "/permissions/" + param?.permissionId,
        {
          headers: {
            Authorization: "Bearer " + bearerToken,
          },
        }
      );
      if (param?.onSuccess) {
        param.onSuccess();
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (param?.onFailed) {
          param.onFailed(error.message);
        }
      }
    } finally {
      if (param?.onFinish) {
        param.onFinish();
      }
    }
  };

  return {
    createPermission,
    deletePermission,
    getPermissions,
    getPermission,
    updatePermission,
  };
}

interface GetPermissionsParam {
  onFailed?: (errorMessage: string) => void;
  onFinish?: () => void;
  onStart?: () => void;
  onSuccess?: (permissions: PermissionProps[]) => void;
}

interface GetPermissionParam {
  permissionId?: number | null | undefined;
  onFailed?: (errorMessage: string) => void;
  onFinish?: () => void;
  onStart?: () => void;
  onSuccess?: (permission: PermissionProps) => void;
}

interface CreatePermissionParam {
  data?: PermissionData | null | undefined;
  onFailed?: (errorMessage: string) => void;
  onFinish?: () => void;
  onStart?: () => void;
  onSuccess?: (permission: PermissionProps) => void;
}

interface UpdatePermissionParam {
  permissionId?: number | null | undefined;
  data?: PermissionData | null | undefined;
  onFailed?: (errorMessage: string) => void;
  onFinish?: () => void;
  onStart?: () => void;
  onSuccess?: (permission: PermissionProps) => void;
}

interface DeletePermissionParam {
  permissionId?: number | null | undefined;
  onFailed?: (errorMessage: string) => void;
  onFinish?: () => void;
  onStart?: () => void;
  onSuccess?: () => void;
}
