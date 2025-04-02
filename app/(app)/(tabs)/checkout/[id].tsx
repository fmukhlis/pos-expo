import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useEffect } from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Icon } from "@/components/Icon";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLazyGetProductCategoryQuery } from "@/components/services/productCategory";
import { useAppSelector } from "@/components/reduxHooks";
import LoadingComponent from "@/components/LoadingComponent";
import { useGetProductsQuery } from "@/components/services/product";
import PrimaryInput from "@/components/PrimaryInput";

const Category = () => {
  const { id }: { id: string } = useLocalSearchParams();
  const storeId = useAppSelector(({ store }) => store.selectedStoreId)!;

  const [filter, setFilter] = React.useState("");

  const {
    data: products,
    refetch,
    isFetching,
  } = useGetProductsQuery({ storeId });

  const [getProductCategory, getProductCategoryResult] =
    useLazyGetProductCategoryQuery();

  const filteredProducts = React.useMemo(
    () =>
      products
        ? Number(id)
          ? products
              .filter((product) => product.category.id === Number(id))
              .filter((product) =>
                product.name.toLowerCase().includes(filter.toLocaleLowerCase())
              )
          : products.filter((product) =>
              product.name.toLowerCase().includes(filter.toLocaleLowerCase())
            )
        : [],
    [isFetching, filter]
  );

  useEffect(() => {
    const productCategoryId = Number(id);
    if (productCategoryId) {
      getProductCategory({ productCategoryId, storeId });
    }
  }, []);

  return (
    <View className="bg-white flex-1">
      {getProductCategoryResult.isFetching ? (
        <>
          <Stack.Screen options={{ headerShown: false }} />
          <LoadingComponent />
        </>
      ) : (
        <>
          <Stack.Screen
            options={{
              header: () => (
                <SafeAreaView className="w-full flex-row justify-between items-center bg-white">
                  <TouchableOpacity
                    className="w-[50] h-[50]"
                    onPress={() => {
                      router.back();
                    }}
                  >
                    <Icon name="arrow-back" size={25} className="m-auto" />
                  </TouchableOpacity>
                  <Text className="text-center font-bold text-lg w-[220]">
                    {getProductCategoryResult.data
                      ? getProductCategoryResult.data.name
                      : "All Items"}
                  </Text>
                  <View className="w-[50]" />
                </SafeAreaView>
              ),
              headerShown: true,
            }}
          />
          <FlatList
            data={filteredProducts}
            ListHeaderComponent={
              <View className="mb-3">
                <PrimaryInput
                  value={filter}
                  onChangeText={(text) => {
                    setFilter(text);
                  }}
                  placeholder="Search product..."
                  className="text-base h-[50]"
                  containerClassName="rounded-none"
                />
              </View>
            }
            renderItem={({ item, index }) => (
              <TouchableOpacity activeOpacity={0.8}>
                <View className="flex-row bg-gray-50">
                  <View
                    className={`${
                      index ? "border-b" : "border-y"
                    } w-[55] h-[55] bg-gray-500 border-blue-300`}
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
                    <View className="ml-3 w-[220]">
                      <Text
                        className="font-medium text-base"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.name}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {item.availableVariants.length} variant(s)
                      </Text>
                    </View>
                    <Text
                      className="my-auto w-[50] ml-auto text-center text-sm font-medium text-gray-500"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.availableVariants.reduce(
                        (accumulator, currentValue) =>
                          accumulator + currentValue.stock,
                        0
                      )}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={({ id }) => `${id}`}
            ListEmptyComponent={() => (
              <View className="p-1 h-[55] bg-gray-200/50 rounded border border-gray-300 flex-1 flex-row space-x-3">
                <View className="justify-center items-center flex-1">
                  <Text className="text-sm">No products found</Text>
                </View>
              </View>
            )}
            refreshControl={
              <RefreshControl onRefresh={refetch} refreshing={isFetching} />
            }
          />
        </>
      )}
    </View>
  );
};

export default Category;
