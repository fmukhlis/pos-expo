import * as Device from "expo-device";

import { useCustomFetch } from "@/utils/fetch";

function useSignUpHelper({
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
  onSuccess?: ((token: string) => Promise<void>) | null | undefined;
} = {}) {
  const customFetch = useCustomFetch();

  const onErrorCallback = onError ?? (() => {});
  const onFinishCallback = onFinish ?? (() => {});
  const onSuccessCallback = onSuccess ?? (async () => {});
  const onStartCallback = onStart ?? (() => {});

  const signUp = async (requestBody: {
    fullName: string;
    email: string;
    password: string;
    passwordConfirmation: string;
  }) => {
    try {
      onStartCallback();
      const response = await customFetch.post("/register", {
        body: JSON.stringify({
          ...requestBody,
          deviceName: Device.deviceName,
        }),
      });
      if (response.ok) {
        const responseData: { token: string } = await response.json();
        await onSuccessCallback(responseData.token);
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

  return signUp;
}

export default useSignUpHelper;
