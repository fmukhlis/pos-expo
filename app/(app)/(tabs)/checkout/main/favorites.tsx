import React from "react";

import { View, ScrollView } from "react-native";

import { Icon } from "@/components/Icon";

const Favorites = () => {
  return (
    <ScrollView className="flex-1 bg-white pt-[70]">
      <View className="flex-row flex-wrap gap-2 p-2">
        <View className="basis-[40%] flex-grow h-24 bg-gray-100 border border-gray-300 rounded justify-center items-center">
          <Icon name="add" className="text-gray-300" size={40} />
        </View>
      </View>
    </ScrollView>
  );
};

export default Favorites;
