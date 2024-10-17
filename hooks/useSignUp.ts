import { useColorScheme } from "react-native";
import { router } from "expo-router";
import { useState } from "react";

import { useSession } from "@/contexts/SessionContext";

export default function useSignUp() {
  const colorScheme = useColorScheme();
  const { signUp, signUpLoading } = useSession();

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
    signUp(form).then((isRegisterSuccess) => {
      if (isRegisterSuccess) {
        router.dismissAll();
        router.replace("/");
      }
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
    signUpLoading,
  };
}
