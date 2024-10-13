import { useState } from "react";
import { Alert } from "react-native";
import { router } from "expo-router";

import { useSession } from "@/contexts/SessionContext";
import { useTheme } from "@/contexts/ThemeProvider";

function useSignIn() {
  const { signIn, sessionLoading } = useSession();
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
    signIn(form)
      .then(() => {
        router.dismissAll();
        router.replace("/");
      })
      .catch((e) => {
        Alert.alert("Login Failed", e.message ?? e, [{ text: "Ok" }]);
      })
  };

  return {
    colorScheme,
    form,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit,
    sessionLoading,
  };
}

export default useSignIn;
