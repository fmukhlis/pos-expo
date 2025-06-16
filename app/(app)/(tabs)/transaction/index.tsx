import React from "react";
import dayjs from "dayjs";

import {
  View,
  Text,
  TouchableOpacity,
  SectionList,
  RefreshControl,
} from "react-native";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";

import { currencyFormat } from "@/utils/defaultFormat";
import { useAppSelector } from "@/components/reduxHooks";
import { useGetTransactionHistoryInfiniteQuery } from "@/components/services/order";

const Transaction = () => {
  const storeId = useAppSelector(({ store }) => store.selectedStoreId)!;
  const refreshKey = useAppSelector(({ order }) => order.refreshKey);

  const { data, isFetching, fetchNextPage, refetch, hasNextPage } =
    useGetTransactionHistoryInfiniteQuery({
      storeId,
      refreshKey,
    });

  const sections = React.useMemo(() => {
    const transactionHistory = data?.pages.map((page) => page.data).flat(1);

    const map = new Map<
      string,
      Exclude<typeof transactionHistory, undefined>
    >();

    if (transactionHistory) {
      for (const item of transactionHistory) {
        const key = item.createdAt.substring(0, 10);
        if (!map.has(key)) {
          map.set(key, []);
        }
        map.get(key)?.push(item);
      }
    }

    return Array.from(map, ([key, value]) => ({
      title: key,
      data: value,
    }));
  }, [data]);

  return (
    <SafeAreaView className="flex-1">
      <View className="flex-1 py-1 bg-white">
        <Text className="px-5 text-2xl font-bold mb-3">Transactions</Text>
        <SectionList
          sections={sections}
          ListEmptyComponent={
            <View className="px-4">
              <View className="p-4 border border-gray-400 rounded items-center">
                <Text className="text-lg text-gray-500 font-medium mb-2">
                  No transactions yet
                </Text>
                <Text className="text-sm text-center text-gray-500">
                  Check back later to view your transaction history
                </Text>
              </View>
            </View>
          }
          renderItem={({ item }) => (
            <View className="mx-5">
              <View className="border-b border-gray-200">
                <TouchableOpacity
                  onPress={() => {
                    router.navigate(`/transaction/${item.id}`);
                  }}
                >
                  <View className="py-2 flex-row items-center">
                    <View className="px-2">
                      <MaterialCommunityIcons
                        name="cash"
                        size={40}
                        color="#22c55e"
                      />
                    </View>
                    <View className="w-[185]">
                      <Text className="font-bold text-base mb-0.5">
                        {currencyFormat.format(Number(item.totalAmount))}
                      </Text>
                      <Text
                        numberOfLines={1}
                        ellipsizeMode="tail"
                        className="text-gray-500"
                      >
                        {item.orderedProducts
                          .map(({ quantity, name }) => `${name} x${quantity}`)
                          .join(", ")}
                      </Text>
                    </View>
                    <Text className="px-2 ml-auto">
                      {dayjs(item.createdAt).format("hh:mm A")}
                    </Text>
                  </View>
                  {item.refunds.length > 0 &&
                    item.refunds.map((refund) => (
                      <View
                        key={refund.refundedAt}
                        className="border-t border-gray-100 mx-2 p-1 items-center flex-row"
                      >
                        <View className="px-1">
                          <MaterialCommunityIcons
                            name="cash"
                            size={25}
                            color="#f87171"
                          />
                        </View>
                        <FontAwesome name="minus" size={8} color="#f87171" />
                        <Text className="font-bold text-red-400 text-xs ml-0.5">
                          {currencyFormat.format(Number(refund.totalAmount))}
                        </Text>
                        <Text className="ml-auto text-xs">
                          {dayjs(refund.refundedAt).format(
                            "HH:mm / DD-MM-YYYY"
                          )}
                        </Text>
                      </View>
                    ))}
                </TouchableOpacity>
              </View>
            </View>
          )}
          keyExtractor={(item) => `${item.id}`}
          renderSectionHeader={({ section: { title } }) => (
            <View className="mx-5 pt-2 pb-2 border-b border-gray-400 bg-white">
              <Text className="font-bold text-base">
                {dayjs(title).format("dddd, DD MMMM YYYY")}
              </Text>
            </View>
          )}
          refreshControl={
            <RefreshControl refreshing={isFetching} onRefresh={refetch} />
          }
          stickySectionHeadersEnabled={true}
          onEndReached={() => {
            if (hasNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.01}
          ListFooterComponent={
            <View className="h-[60] items-center justify-center">
              <Text className="text-gray-400">
                {isFetching && "Loading..."}
              </Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default Transaction;
