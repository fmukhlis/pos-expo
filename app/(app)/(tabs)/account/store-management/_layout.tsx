import React from "react";

import { Stack } from "expo-router";
import { View, Text } from "react-native";

import { Icon } from "@/components/Icon";

const StoreManagementLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerTitle: () => (
          <View className="flex-1 pt-2 pb-4 flex-row items-center space-x-3">
            <Icon name="documents-outline" />
            <Text className="text-xl font-semibold">Store Management</Text>
          </View>
        ),
        headerBackVisible: false,
      }}
    />
  );
};

export default StoreManagementLayout;
