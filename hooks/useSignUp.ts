import { useState } from "react";
import { Alert, useColorScheme } from "react-native";
import { router } from "expo-router";

import { useSession } from "@/contexts/SessionContext";
import { useCustomFetch } from "@/utils/fetch";
import { RegistrationResponseData } from "@/types/auth";

export default function useSignUp() {
  const colorScheme = useColorScheme();
  const { signUp, sessionLoading } = useSession();

  const [form, setForm] = useState({
    email: "",
    fullName: "",
    password: "",
    passwordConfirmation: "",
  });

  const handleFullNameChange = (fullName: string) => {
    setForm((prev) => ({
      ...prev,
      fullName,
    }));
  };
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
  const handlePasswordConfirmationChange = (passwordConfirmation: string) => {
    setForm((prev) => ({
      ...prev,
      passwordConfirmation,
    }));
  };

  const handleSubmit = async () => {
    signUp(form)
      .then(() => {
        router.dismissAll();
        router.replace("/");
      })
      .catch((e) => {
        Alert.alert("Register Failed", e.message ?? e, [{ text: "Ok" }]);
      });
  };

  return {
    colorScheme,
    form,
    handleEmailChange,
    handleFullNameChange,
    handlePasswordChange,
    handlePasswordConfirmationChange,
    handleSubmit,
    sessionLoading,
  };
}
