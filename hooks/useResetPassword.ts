import { Colors } from "@/constants/Colors";
import { useSession } from "@/contexts/SessionContext";
import { useTheme } from "@/contexts/ThemeProvider";
import { router } from "expo-router";
import { useState } from "react";
import { Alert } from "react-native";

const useResetPassword = () => {
  const { colorScheme } = useTheme();
  const {
    resetPassword,
    resetPasswordLoading,
    sendResetPassword,
    sendResetPasswordLoading,
  } = useSession();

  // const [retryAfter, setRetryAfter] = useState(0);

  const [form, setForm] = useState({
    email: "",
    token: "",
    password: "",
    passwordConfirmation: "",
  });

  const handleEmailChange = (email: string) => {
    setForm((prev) => ({
      ...prev,
      email,
    }));
  };
  const handleTokenChange = (token: string) => {
    setForm((prev) => ({
      ...prev,
      token,
    }));
  };
  const handlePasswordChange = (password: string) => {
    setForm((prev) => ({
      ...prev,
      password,
    }));
  };
  const handlePasswordConfirmationChange = (passwordConfirmation: string) => {
    setForm((prev) => ({
      ...prev,
      passwordConfirmation,
    }));
  };

  const handleSendToken = () => {
    sendResetPassword(form.email);

    // setRetryAfter(60);
    // const retryAfterInterval = setInterval(() => {
    //   setRetryAfter((prev) => {
    //     if (prev > 1) {
    //       return prev - 1;
    //     } else {
    //       clearInterval(retryAfterInterval);
    //       return 0;
    //     }
    //   });
    // }, 1000);
  };

  const handleCancelPress = () => {
    router.back();
  };

  const handleSubmit = () => {
    resetPassword(form);
  };

  return {
    Colors,
    colorScheme,
    form,
    handleCancelPress,
    handleEmailChange,
    handlePasswordChange,
    handlePasswordConfirmationChange,
    handleSendToken,
    handleSubmit,
    handleTokenChange,
    sendResetPasswordLoading,
    resetPasswordLoading,
  };
};

export default useResetPassword;
