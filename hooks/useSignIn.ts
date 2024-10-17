import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";

import { useSession } from "@/contexts/SessionContext";
import { useTheme } from "@/contexts/ThemeProvider";

function useSignIn() {
  const { signIn, signInLoading, sessionLoading } = useSession();
  const { colorScheme } = useTheme();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleEmailChange = (email: string) => {
    setForm((prev) => ({
      ...prev,
      email,
    }));
  };
  const handlePasswordChange = (password: string) => {
    setForm((prev) => ({
      ...prev,
      password,
    }));
  };

  const handleSubmit = () => {
    signIn(form).then((isLoginSuccess) => {
      if (isLoginSuccess) {
        router.dismissAll();
        router.replace("/");
      }
    });
  };

  return {
    colorScheme,
    form,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
    sessionLoading,
    signInLoading,
  };
}

export default useSignIn;
