import { PasswordResetHelperProps } from "@/types/auth";
import { useCustomFetch } from "@/utils/fetch";

function usePasswordResetHelper({
  resetPasswordOption,
  sendResetPasswordOption,
}: PasswordResetHelperProps = {}) {
  const customFetch = useCustomFetch();

  /**
   * Send verify email request.
   *
   * @param token Bearer token
   * @param verificationCode A 6-digit code to verify email
   */
  const resetPassword = async (requestBody: {
    email: string;
    token: string;
    password: string;
    passwordConfirmation: string;
  }) => {
    const onErrorCallback = resetPasswordOption?.onError ?? (() => {});
    const onFinishCallback = resetPasswordOption?.onFinish ?? (() => {});
    const onSuccessCallback =
      resetPasswordOption?.onSuccess ?? (async () => {});
    const onStartCallback = resetPasswordOption?.onStart ?? (() => {});

    try {
      onStartCallback();
      const response = await customFetch.post("/reset-password", {
        body: JSON.stringify(requestBody),
      });
      if (response.ok) {
        const responseData: { message: string } = await response.json();
        await onSuccessCallback(responseData.message);
        return true;
      } else {
        const responseData: {
          message: string;
          errors?: Record<string, string[]>;
        } = await response.json();
        onErrorCallback(responseData.message, responseData.errors ?? {});
        throw new Error(responseData.message);
      }
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      onFinishCallback();
    }
  };

  /**
   * Send email verification request.
   *
   * @param token Bearer token for authenticating the request
   */
  const sendResetPassword = async (email: string) => {
    const onErrorCallback = sendResetPasswordOption?.onError ?? (() => {});
    const onFinishCallback = sendResetPasswordOption?.onFinish ?? (() => {});
    const onSuccessCallback =
      sendResetPasswordOption?.onSuccess ?? (async () => {});
    const onStartCallback = sendResetPasswordOption?.onStart ?? (() => {});

    try {
      onStartCallback();
      const response = await customFetch.post("/forgot-password", {
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        const responseData: { message: string } = await response.json();
        await onSuccessCallback(responseData.message);
        return true;
      }
      if (response.status === 429) {
        const retryAfter = response.headers.get("retry-after");
        onErrorCallback("Too many attempts", {
          retryAfter: [retryAfter ?? ""],
        });
        throw new Error(
          "Too many attempts, please retry in: " + retryAfter + " sec."
        );
      }
      const responseData: {
        message: string;
        errors?: Record<string, string[]>;
      } = await response.json();
      onErrorCallback(responseData.message, responseData.errors ?? {});
      throw new Error(responseData.message);
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      onFinishCallback();
    }
  };

  return { resetPassword, sendResetPassword };
}

export default usePasswordResetHelper;
