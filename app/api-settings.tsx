import React from "react";
import * as SecureStore from "expo-secure-store";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TouchableOpacity } from "react-native";

import { Icon } from "@/components/Icon";
import PrimaryInput from "@/components/PrimaryInput";
import { PrimaryButtonSM } from "@/components/PrimaryButton";

import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeProvider";

const ApiSettings = () => {
  const { colorScheme } = useTheme();

  const [apiBaseUrl, setApiBaseUrl] = React.useState("");

  React.useEffect(() => {
    // Prefill the currently stored endpoint so it can be corrected in place.
    SecureStore.getItemAsync("apiEndpoint").then((storedApiBaseUrl) => {
      if (storedApiBaseUrl) {
        setApiBaseUrl(storedApiBaseUrl);
      }
    });
  }, []);

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/sign-in");
    }
  };

  const handleSetApiBaseUrl = async () => {
    const trimmedApiBaseUrl = apiBaseUrl.trim();

    if (!trimmedApiBaseUrl) {
      return;
    }

    await SecureStore.setItemAsync("apiEndpoint", trimmedApiBaseUrl);
    setApiBaseUrl(trimmedApiBaseUrl);
    Toast.show({
      type: "success",
      text1: "Alamat API disimpan",
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-light-primaryBackground dark:bg-dark-primaryBackground">
      <View className="flex-row items-center space-x-3 px-5 pt-2 pb-4">
        <TouchableOpacity onPress={handleBackPress} activeOpacity={0.7}>
          <Icon
            name="chevron-back"
            size={24}
            color={
              colorScheme === "dark"
                ? Colors.dark.primaryText
                : Colors.light.primaryText
            }
          />
        </TouchableOpacity>
        <Text className="text-xl font-semibold text-light-primaryText dark:text-dark-primaryText">
          Pengaturan API
        </Text>
      </View>
      <View className="px-5">
        <Text className="mb-3 text-base font-medium text-light-primaryText dark:text-dark-primaryText">
          Alamat API
        </Text>
        <View className="flex-row">
          <PrimaryInput
            containerClassName="flex-1 mr-3"
            className="text-sm h-[40]"
            placeholder="https://..."
            numberOfLines={1}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            value={apiBaseUrl}
            onChangeText={setApiBaseUrl}
          />
          <PrimaryButtonSM
            className="h-[40]"
            disabled={!apiBaseUrl.trim()}
            onPress={handleSetApiBaseUrl}
          >
            Set
          </PrimaryButtonSM>
        </View>
        <Text className="text-sm mt-2 text-orange-600/70">
          Alamat ini digunakan untuk menghubungkan aplikasi ke server. Pastikan
          alamat sudah benar sebelum menyimpan.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default ApiSettings;
