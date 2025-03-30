import React from "react";

import { router, Stack } from "expo-router";
import { View, Text, TouchableHighlight } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { Icon } from "@/components/Icon";

const PaymentAndSecurity = () => {
  return (
    <View className="flex-1 bg-white">
      <View className="border border-gray-300">
        <TouchableHighlight
          className={`px-3.5 py-[18]`}
          onPress={() => {
            router.navigate("/account/payment-and-security/payment-method");
          }}
          underlayColor={"#e5e7eb"}
        >
          <View className="flex-row space-x-2 items-center justify-between">
            <Text className="font-medium text-base">Payment Methods</Text>
            <Icon name="chevron-forward" size={20} />
          </View>
        </TouchableHighlight>
      </View>
      <View className="border-b border-gray-300">
        <TouchableHighlight
          className={`px-3.5 py-[18]`}
          onPress={() => {
            router.navigate("/account/payment-and-security/permission");
          }}
          underlayColor={"#e5e7eb"}
        >
          <View className="flex-row space-x-2 items-center justify-between">
            <Text className="font-medium text-base">Permissions</Text>
            <Icon name="chevron-forward" size={20} />
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default PaymentAndSecurity;
