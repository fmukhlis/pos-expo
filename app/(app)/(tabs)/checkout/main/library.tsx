import React from "react";

import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { Link } from "expo-router";
import { skipToken } from "@reduxjs/toolkit/query";
import { SafeAreaView } from "react-native-safe-area-context";

import PrimaryInput from "@/components/PrimaryInput";

import { Icon } from "@/components/Icon";
import { useAppSelector } from "@/components/reduxHooks";
import { useGetProductCategoriesQuery } from "@/components/services/productCategory";

const Library = () => {
  const storeId = useAppSelector(({ store }) => store.selectedStoreId);

  const {
    data: categories,
    refetch,
    isFetching,
  } = useGetProductCategoriesQuery(storeId ? { storeId } : skipToken);

  return (
    <SafeAreaView className="flex-1 pt-[42] bg-white">
      <FlatList
        data={categories}
        ListHeaderComponent={
          <View className="mb-3">
            <PrimaryInput
              placeholder="Search category..."
              className="text-base h-[50]"
              containerClassName="rounded-none"
            />
            <Link href={"/checkout/0"} asChild>
              <TouchableOpacity activeOpacity={0.8}>
                <View className="flex-row">
                  <View className="w-[55] h-[55] bg-blue-500">
                    <Icon name="cube-outline" className="text-white m-auto" />
                  </View>
                  <View className="flex-1 border-b border-gray-300 flex-row items-center">
                    <Text className="ml-3 font-medium text-base">
                      All Items
                    </Text>
                    <Icon
                      name="chevron-forward"
                      className="ml-auto"
                      size={25}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            </Link>
          </View>
        }
        renderItem={({ item, index }) => (
          <Link href={`/checkout/${item.id}`} asChild>
            <TouchableOpacity activeOpacity={0.8}>
              <View className="flex-row bg-gray-50">
                <View
                  className={`${
                    index ? "border-b" : "border-y"
                  } w-[55] h-[55] bg-blue-500 border-blue-300`}
                >
                  <Text className="m-auto text-2xl font-medium text-gray-50">
                    {item.name.substring(0, 2)}
                  </Text>
                </View>
                <View
                  className={`${
                    index ? "border-b" : "border-y"
                  } flex-1 border-gray-300 flex-row items-center`}
                >
                  <View className="ml-3">
                    <Text className="font-medium text-base">{item.name}</Text>
                    <Text className="text-sm text-gray-500">
                      {item.productsCount} items
                    </Text>
                  </View>
                  <Icon name="chevron-forward" className="ml-auto" size={25} />
                </View>
              </View>
            </TouchableOpacity>
          </Link>
        )}
        keyExtractor={({ id }) => `${id}`}
        ListEmptyComponent={() => (
          <View className="p-1 h-[55] bg-gray-200/50 rounded border border-gray-300 flex-1 flex-row space-x-3">
            <View className="justify-center items-center flex-1">
              <Text className="text-sm">No product categories found</Text>
            </View>
          </View>
        )}
        refreshControl={
          <RefreshControl onRefresh={refetch} refreshing={isFetching} />
        }
      />
    </SafeAreaView>
  );
};

export default Library;
