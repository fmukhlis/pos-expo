import { EmailVerificationHelperProps } from "@/types/auth";
import { useCustomFetch } from "@/utils/fetch";

function useEmailVerificationHelper({
  verifyEmailOption,
  sendVerificationEmailOption,
}: EmailVerificationHelperProps = {}) {
  const customFetch = useCustomFetch();

  /**
   * Send verify email request.
   *
   * @param token Bearer token
   * @param verificationCode A 6-digit code to verify email
   */
  const verifyEmail = async (token: string, verificationCode: string) => {
    const onErrorCallback = verifyEmailOption?.onError ?? (() => {});
    const onFinishCallback = verifyEmailOption?.onFinish ?? (() => {});
    const onSuccessCallback = verifyEmailOption?.onSuccess ?? (async () => {});
    const onStartCallback = verifyEmailOption?.onStart ?? (() => {});

    try {
      onStartCallback();
      const response = await customFetch.post("/verify-email", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ verificationCode }),
      });
      if (response.ok) {
        const responseData: { message: string } = await response.json();
        await onSuccessCallback(responseData.message, token);
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
  const sendVerificationEmail = async (token: string) => {
    const onErrorCallback = sendVerificationEmailOption?.onError ?? (() => {});
    const onFinishCallback =
      sendVerificationEmailOption?.onFinish ?? (() => {});
    const onSuccessCallback =
      sendVerificationEmailOption?.onSuccess ?? (async () => {});
    const onStartCallback = sendVerificationEmailOption?.onStart ?? (() => {});

    try {
      onStartCallback();
      const response = await customFetch.post(
        "/email/verification-notification",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  return { verifyEmail, sendVerificationEmail };
}

export default useEmailVerificationHelper;
