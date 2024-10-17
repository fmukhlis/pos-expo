import * as Device from "expo-device";

import { useCustomFetch } from "@/utils/fetch";
import { UserModel } from "@/types/auth";

function useSyncUserHelper({
  onError,
  onFinish,
  onStart,
  onSuccess,
}: {
  onError?: ((message: string) => void) | null | undefined;
  onFinish?: (() => void) | null | undefined;
  onStart?: (() => void) | null | undefined;
  onSuccess?: ((user: UserModel) => Promise<void>) | null | undefined;
} = {}) {
  const customFetch = useCustomFetch();

  const onErrorCallback = onError ?? (() => {});
  const onFinishCallback = onFinish ?? (() => {});
  const onSuccessCallback = onSuccess ?? (async () => {});
  const onStartCallback = onStart ?? (() => {});

  const syncUser = async (token: string) => {
    try {
      onStartCallback();
      const response = await customFetch.get("/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        const responseData: { data: UserModel } = await response.json();
        await onSuccessCallback(responseData.data);
        return true;
      } else {
        const responseData: {
          message: string;
          errors: Record<string, string[]>;
        } = await response.json();
        onErrorCallback(responseData.message);
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      onFinishCallback();
    }
  };

  return syncUser;
}

export default useSyncUserHelper;
