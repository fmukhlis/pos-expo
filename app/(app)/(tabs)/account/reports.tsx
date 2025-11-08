import { Icon } from "@/components/Icon";
import LoadingComponent from "@/components/LoadingComponent";
import { useAppSelector } from "@/components/reduxHooks";
import { useLazyGetSalesSummaryQuery } from "@/components/services/order";
import { currencyFormat } from "@/utils/defaultFormat";
import { Stack } from "expo-router";
import React from "react";
import { ScrollView, Text, View } from "react-native";

export default function Reports() {
  const storeId = useAppSelector(({ store }) => store.selectedStoreId)!;

  const [salesSummaryState, setSalesSummaryState] = React.useState({
    totalRevenue: {
      thisMonth: "",
      lastMonth: "",
      thisYear: "",
    },
    totalTransactions: {
      thisMonth: "",
      lastMonth: "",
      thisYear: "",
    },
    averageOrderValue: {
      thisMonth: "",
      lastMonth: "",
      thisYear: "",
    },
  });

  const now = new Date();

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear(), 11, 31);

  const formatDate = (date: any) => date.toISOString().split("T")[0];

  const [getSalesSummary, getSalesSummaryResult] =
    useLazyGetSalesSummaryQuery();

  React.useEffect(() => {
    getSalesSummary({
      from: formatDate(startOfMonth),
      to: formatDate(endOfMonth),
      storeId,
    })
      .unwrap()
      .then((salesSummary) => {
        console.log(salesSummary);
        setSalesSummaryState((prev) => ({
          totalRevenue: {
            ...prev.totalRevenue,
            thisMonth: currencyFormat.format(Number(salesSummary.totalRevenue)),
          },
          totalTransactions: {
            ...prev.totalTransactions,
            thisMonth: salesSummary.totalTransactions,
          },
          averageOrderValue: {
            ...prev.averageOrderValue,
            thisMonth: currencyFormat.format(
              Number(salesSummary.averageOrderValue)
            ),
          },
        }));
      });
    getSalesSummary({
      from: formatDate(startOfLastMonth),
      to: formatDate(endOfLastMonth),
      storeId,
    })
      .unwrap()
      .then((salesSummary) => {
        setSalesSummaryState((prev) => ({
          totalRevenue: {
            ...prev.totalRevenue,
            lastMonth: currencyFormat.format(Number(salesSummary.totalRevenue)),
          },
          totalTransactions: {
            ...prev.totalTransactions,
            lastMonth: salesSummary.totalTransactions,
          },
          averageOrderValue: {
            ...prev.averageOrderValue,
            lastMonth: currencyFormat.format(
              Number(salesSummary.averageOrderValue)
            ),
          },
        }));
      });
    getSalesSummary({
      from: formatDate(startOfYear),
      to: formatDate(endOfYear),
      storeId,
    })
      .unwrap()
      .then((salesSummary) => {
        setSalesSummaryState((prev) => ({
          totalRevenue: {
            ...prev.totalRevenue,
            thisYear: currencyFormat.format(Number(salesSummary.totalRevenue)),
          },
          totalTransactions: {
            ...prev.totalTransactions,
            thisYear: salesSummary.totalTransactions,
          },
          averageOrderValue: {
            ...prev.averageOrderValue,
            thisYear: currencyFormat.format(
              Number(salesSummary.averageOrderValue)
            ),
          },
        }));
      });
  }, []);

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="border-yellow-500">
        <View className="bg-white">
          <Stack.Screen
            options={{
              headerShown: true,
              headerTitle: () => (
                <View className="flex-1 pt-2 pb-4 flex-row items-center space-x-3">
                  <Icon name="print-outline" />
                  <Text className="text-xl font-semibold">Reports</Text>
                </View>
              ),
              headerBackVisible: false,
            }}
          />
          {getSalesSummaryResult.isFetching ? (
            <View className="justify-center items-center h-screen">
              <LoadingComponent className="pb-32" />
            </View>
          ) : (
            <>
              <View className="mt-5 mb-2 mx-5">
                <Text className="text-lg font-bold text-gray-700 mb-3">
                  Total Revenue
                </Text>
                <View className="border-t opacity-10"></View>
                <View className="flex flex-row justify-between py-3 bg-gray-100">
                  <View className="space-y-1 items-center flex-1">
                    <Text className="text-base">This Month</Text>
                    <Text className="text-sm">
                      {salesSummaryState.totalRevenue.thisMonth}
                    </Text>
                  </View>
                  <View className="border-r opacity-10"></View>
                  <View className="space-y-1 items-center flex-1">
                    <Text className="text-base">Last Month</Text>
                    <Text className="text-sm">
                      {salesSummaryState.totalRevenue.lastMonth}
                    </Text>
                  </View>
                </View>
                <View className="border-t opacity-10"></View>
                <View className="space-y-1 items-center bg-gray-200/75 py-3">
                  <Text className="text-base">This Year</Text>
                  <Text className="text-sm">
                    {salesSummaryState.totalRevenue.thisYear}
                  </Text>
                </View>
                <View className="border-t opacity-10"></View>
              </View>

              <View className="mt-5 mb-2 mx-5">
                <Text className="text-lg font-bold text-gray-700 mb-3">
                  Total Transaction
                </Text>
                <View className="border-t opacity-10"></View>
                <View className="flex flex-row justify-between bg-gray-100 py-3">
                  <View className="space-y-1 items-center flex-1">
                    <Text className="text-base">This Month</Text>
                    <Text className="text-sm">
                      {salesSummaryState.totalTransactions.thisMonth}
                    </Text>
                  </View>
                  <View className="border-r opacity-10"></View>
                  <View className="space-y-1 items-center flex-1">
                    <Text className="text-base">Last Month</Text>
                    <Text className="text-sm">
                      {salesSummaryState.totalTransactions.lastMonth}
                    </Text>
                  </View>
                </View>
                <View className="border-t opacity-10"></View>
                <View className="space-y-1 items-center py-3 bg-gray-200/75">
                  <Text className="text-base">This Year</Text>
                  <Text className="text-sm">
                    {salesSummaryState.totalTransactions.thisYear}
                  </Text>
                </View>
                <View className="border-t opacity-10"></View>
              </View>

              <View className="mt-5 mb-2 mx-5">
                <Text className="text-lg font-bold text-gray-700 mb-3">
                  Average Order Value
                </Text>
                <View className="border-t opacity-10"></View>
                <View className="flex flex-row justify-between py-3 bg-gray-100">
                  <View className="space-y-1 items-center flex-1">
                    <Text className="text-base">This Month</Text>
                    <Text className="text-sm">
                      {salesSummaryState.averageOrderValue.thisMonth}
                    </Text>
                  </View>
                  <View className="border-r opacity-10"></View>
                  <View className="space-y-1 items-center flex-1">
                    <Text className="text-base">Last Month</Text>
                    <Text className="text-sm">
                      {salesSummaryState.averageOrderValue.lastMonth}
                    </Text>
                  </View>
                </View>
                <View className="border-t opacity-10"></View>
                <View className="space-y-1 items-center py-3 bg-gray-200/75">
                  <Text className="text-base">This Year</Text>
                  <Text className="text-sm">
                    {salesSummaryState.averageOrderValue.thisYear}
                  </Text>
                </View>
                <View className="border-t opacity-10"></View>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
