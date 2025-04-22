import React from "react";

import { Stack } from "expo-router";
import { View, Text } from "react-native";

import { Icon } from "@/components/Icon";

const PaymentAndSecurityLayout = () => {
  return (
    <Stack
      screenOptions={{
        title: "payment-and-security",
        headerTitle: (props) => (
          <View className="flex-1 pt-2 pb-4 flex-row items-center space-x-3">
            <Icon name="key-outline" />
            <Text className="text-xl font-semibold">Payment & Security</Text>
          </View>
        ),
        headerBackVisible: false,
      }}
    />
  );
};

export default PaymentAndSecurityLayout;
