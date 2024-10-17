import * as Device from "expo-device";

import { useCustomFetch } from "@/utils/fetch";

function useSignOutHelper({
  onError,
  onFinish,
  onStart,
  onSuccess,
}: {
  onError?:
    | ((message: string, errors: Record<string, string[]>) => void)
    | null
    | undefined;
  onFinish?: (() => void) | null | undefined;
  onStart?: (() => void) | null | undefined;
  onSuccess?: (() => Promise<void>) | null | undefined;
} = {}) {
  const customFetch = useCustomFetch();

  const onErrorCallback = onError ?? (() => {});
  const onFinishCallback = onFinish ?? (() => {});
  const onSuccessCallback = onSuccess ?? (async () => {});
  const onStartCallback = onStart ?? (() => {});

  const signOut = async (token: string) => {
    try {
      onStartCallback();
      const response = await customFetch.post("/logout", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.ok) {
        await onSuccessCallback();
        return true;
      } else {
        const responseData: {
          message: string;
          errors: Record<string, string[]>;
        } = await response.json();
        onErrorCallback(responseData.message, responseData.errors);
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      onFinishCallback();
    }
  };

  return signOut;
}

export default useSignOutHelper;
