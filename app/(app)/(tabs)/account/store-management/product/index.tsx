import React from "react";
import { router } from "expo-router";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TouchableHighlight,
  RefreshControl,
} from "react-native";

import PrimaryInput from "@/components/PrimaryInput";
import { Icon } from "@/components/Icon";
import { useAppSelector } from "@/components/reduxHooks";
import { useGetProductsQuery } from "@/components/services/product";

const Products = () => {
  const storeId = useAppSelector(({ store }) => store.selectedStoreId)!;

  const {
    data: products = [],
    isFetching,
    refetch,
  } = useGetProductsQuery({ storeId });

  const sortedProducts = React.useMemo(() => {
    return products.slice().sort((a, b) => a.name.localeCompare(b.name));
  }, [products]);

  return (
    <View className="flex-1 bg-white">
      <FlatList
        ListHeaderComponent={
          <>
            <View className="flex-row items-center mt-4 px-4">
              <TouchableOpacity
                onPress={() => {
                  router.back();
                }}
                className="w-[45] h-[45] rounded bg-gray-200"
              >
                <Icon name="arrow-back" className="m-auto" />
              </TouchableOpacity>
              <Text className="mx-auto text-lg font-semibold">
                All Products
              </Text>
              <TouchableOpacity
                className="w-[45] h-[45] border-2 border-r-blue-400 border-t-blue-400 border-b-blue-600 border-l-blue-600 bg-light-accent dark:bg-dark-accent justify-center items-center rounded"
                onPress={() => {
                  router.navigate({
                    pathname: "/account/store-management/product/[id]",
                    params: { id: 0 },
                  });
                }}
              >
                <Icon name="add" className="text-white" size={35} />
              </TouchableOpacity>
            </View>
            <PrimaryInput
              containerClassName="my-3 mx-4"
              placeholder="Search an item..."
              className="text-base h-[45] "
            />
          </>
        }
        ListEmptyComponent={
          <View className="h-[45] justify-center items-center">
            <Text className="text-gray-500">No product found</Text>
          </View>
        }
        data={sortedProducts}
        renderItem={({ item }) => {
          const activeVariant = item.availableVariants.filter(
            (variant) => variant.status === "Active"
          );
          return (
            <TouchableHighlight
              className="mx-4 border-t border-gray-300"
              underlayColor={"#f3f4f6"}
              onPress={() => {
                router.navigate({
                  pathname: "/account/store-management/product/[id]",
                  params: { id: item.id },
                });
              }}
            >
              <View className="p-3 flex-row items-center">
                <View className="border-2 rounded h-[50] w-[50] mr-3 bg-gray-200 border-gray-300">
                  <Text className="text-xl text-gray-500 font-bold m-auto tracking-widest">
                    {item.name.charAt(0).toUpperCase() + item.name.charAt(1)}
                  </Text>
                </View>
                <View className="w-8/12 border-r h-[50] justify-center border-gray-300 pr-3">
                  <Text className="text-base font-medium" numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text className="text-[13px] text-gray-500 mt-0.5">
                    {activeVariant.length} variants
                  </Text>
                </View>
                <Text className="ml-auto text-gray-500 text-[13px]">
                  {activeVariant.reduce(
                    (accumulator, currentValue) =>
                      accumulator + currentValue.stock,
                    0
                  )}
                </Text>
              </View>
            </TouchableHighlight>
          );
        }}
        refreshControl={
          <RefreshControl refreshing={isFetching} onRefresh={refetch} />
        }
      />
    </View>
  );
};

export default Products;
