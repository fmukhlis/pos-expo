import React from "react";

import { router } from "expo-router";
import { View, Text, TouchableHighlight } from "react-native";

import { Icon } from "@/components/Icon";

const StoreManagement = () => {
  return (
    <View className="flex-1 bg-white">
      <View className="border-b border-gray-300">
        <TouchableHighlight
          className={`px-3.5 py-[18]`}
          onPress={() => {
            router.navigate("/account/store-management/employee");
          }}
          underlayColor={"#e5e7eb"}
        >
          <View className="flex-row space-x-2 items-center justify-between">
            <Text className="font-medium text-base">Employees</Text>
            <Icon name="chevron-forward" size={20} />
          </View>
        </TouchableHighlight>
      </View>
      <View className="border-b border-gray-300">
        <TouchableHighlight
          className={`px-3.5 py-[18]`}
          onPress={() => {
            router.navigate("/account/store-management/product");
          }}
          underlayColor={"#e5e7eb"}
        >
          <View className="flex-row space-x-2 items-center justify-between">
            <Text className="font-medium text-base">All Products</Text>
            <Icon name="chevron-forward" size={20} />
          </View>
        </TouchableHighlight>
      </View>
      <View className="border-b border-gray-300">
        <TouchableHighlight
          className={`px-3.5 py-[18]`}
          onPress={() => {
            router.navigate("/account/store-management/product/category");
          }}
          underlayColor={"#e5e7eb"}
        >
          <View className="flex-row space-x-2 items-center justify-between">
            <Text className="font-medium text-base">Product Categories</Text>
            <Icon name="chevron-forward" size={20} />
          </View>
        </TouchableHighlight>
      </View>
    </View>
  );
};

export default StoreManagement;
