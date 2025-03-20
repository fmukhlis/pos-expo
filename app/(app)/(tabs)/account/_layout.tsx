import React from "react";
import { Stack } from "expo-router";
import { View, Text } from "react-native";

import { Icon } from "@/components/Icon";

const HomeLayout = () => {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="store-owner"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="payment-and-security"
        options={{
          headerTitle: (props) => (
            <View className="flex-1 pt-2 pb-4 flex-row items-center space-x-3">
              <Icon name="key-outline" />
              <Text className="text-xl font-semibold">Payment & Security</Text>
            </View>
          ),
          headerBackVisible: false,
        }}
      />
      <Stack.Screen
        name="store-management"
        options={{
          headerTitle: (props) => (
            <View className="flex-1 pt-2 pb-4 flex-row items-center space-x-3">
              <Icon name="documents-outline" />
              <Text className="text-xl font-semibold">Store Management</Text>
            </View>
          ),
          headerBackVisible: false,
        }}
      />
    </Stack>
  );
};

export default HomeLayout;
