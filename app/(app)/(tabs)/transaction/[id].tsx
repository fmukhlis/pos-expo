import React from "react";
import dayjs from "dayjs";

import { SafeAreaView } from "react-native-safe-area-context";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import {
  View,
  Text,
  TouchableHighlight,
  FlatList,
  TouchableOpacity,
} from "react-native";

import LoadingComponent from "@/components/LoadingComponent";

import { Icon } from "@/components/Icon";
import { currencyFormat } from "@/utils/defaultFormat";
import { useAppSelector } from "@/components/reduxHooks";
import { useLazyGetOrderQuery } from "@/components/services/order";

const OrderDetail = () => {
  const storeId = useAppSelector(({ store }) => store.selectedStoreId)!;

  const { id: orderId }: { id: string } = useLocalSearchParams();

  const [getOrder, getOrderResult] = useLazyGetOrderQuery();

  React.useEffect(() => {
    getOrder({ orderId: Number(orderId), storeId });
  }, []);

  if (getOrderResult.isFetching) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <LoadingComponent />
      </>
    );
  }

  return (
    <View className="bg-white flex-1">
      <Stack.Screen
        options={{
          header: () => (
            <SafeAreaView className="border-b border-gray-300 w-full flex-row justify-between items-center bg-white">
              <TouchableOpacity
                className="w-[50] h-[50]"
                onPress={() => {
                  router.back();
                }}
              >
                <Icon name="arrow-back" size={25} className="m-auto" />
              </TouchableOpacity>
              <Text className="text-center font-bold text-lg w-[220]">
                {currencyFormat.format(
                  Number(getOrderResult.data?.totalAmount ?? 0)
                )}{" "}
                Sale
              </Text>
              <View className="w-[50]" />
            </SafeAreaView>
          ),
          headerShown: true,
        }}
      />
      <FlatList
        data={getOrderResult.data?.orderedProducts}
        keyExtractor={(item) => `${item.id}`}
        ListHeaderComponent={
          <View className="px-7">
            <TouchableHighlight
              onPress={() => {}}
              underlayColor={"#e5e7eb"}
              className="border border-blue-500 w-full h-[50] mx-auto mt-6 rounded-sm bg-gray-100"
            >
              <Text className="text-base font-bold m-auto text-blue-500">
                Issue Refund
              </Text>
            </TouchableHighlight>
            <TouchableHighlight
              onPress={() => {}}
              underlayColor={"#e5e7eb"}
              className="border border-blue-500 w-full h-[50] mx-auto mt-3 rounded-sm bg-gray-100"
            >
              <Text className="text-base font-bold m-auto text-blue-500">
                New Receipt
              </Text>
            </TouchableHighlight>

            <Text className="font-bold mt-5 text-base">Payment</Text>
            <Text className="text-gray-500 mb-3">
              {dayjs(getOrderResult.data?.createdAt).format(
                "hh:mm A / DD-MM-YYYY"
              )}
            </Text>
            <View className="mb-5">
              <View className="flex-row items-center border border-gray-300 border-b-0">
                <View className="mr-2 bg-gray-200 h-[50] w-[50] justify-center items-center">
                  <MaterialIcons name="payment" color={"#6b7280"} size={30} />
                </View>
                <Text className="text-base w-[95]">
                  {getOrderResult.data?.paymentMethod.name}
                </Text>
                <Text className="text-base ml-auto w-[130] text-right mr-3 font-bold">
                  {getOrderResult.data?.paymentMethod.destination}
                </Text>
              </View>
              <View className="flex-row items-center border border-gray-300 border-b-0">
                <View className="mr-2 bg-gray-200 h-[50] w-[50] justify-center items-center">
                  <MaterialCommunityIcons
                    name="cash-plus"
                    color={"#6b7280"}
                    size={30}
                  />
                </View>
                <Text className="text-base">Amt. tendered</Text>
                <Text className="text-base ml-auto w-[105] text-right mr-3 font-bold">
                  {currencyFormat.format(
                    Number(getOrderResult.data?.cashAmount ?? 0)
                  )}
                </Text>
              </View>
              <View className="flex-row items-center border border-gray-300">
                <View className="mr-2 bg-gray-200 h-[50] w-[50] justify-center items-center">
                  <MaterialCommunityIcons
                    name="cash-minus"
                    color={"#6b7280"}
                    size={30}
                  />
                </View>
                <Text className="text-base">Change</Text>
                <Text className="text-base ml-auto w-[105] text-right mr-3 font-bold">
                  {currencyFormat.format(
                    getOrderResult.data
                      ? Number(getOrderResult.data.cashAmount) -
                          Number(getOrderResult.data.totalAmount)
                      : 0
                  )}
                </Text>
              </View>
            </View>

            <View className="flex-row items-center">
              <Text className="font-bold text-base">Order ID </Text>
              <Text className="text-gray-500">#{getOrderResult.data?.id}</Text>
            </View>
            <Text className="font-bold text-base">Processed By</Text>
            <Text className="text-gray-500 mb-3">
              {`${getOrderResult.data?.processedBy.name} (${getOrderResult.data?.processedBy.email})`}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="mx-7 py-2 border-t border-gray-300">
            <View className="flex-row">
              <View className="w-[195]">
                <View className="flex-row items-center">
                  {Number(item.quantity) > 1 ? (
                    <>
                      <Text
                        className="text-base font-medium max-w-[140]"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.name}
                      </Text>
                      <Text className="text-sm text-gray-500 ml-1">{`x ${item.quantity}`}</Text>
                    </>
                  ) : (
                    <Text
                      className="text-base font-medium w-full"
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {item.name}
                    </Text>
                  )}
                </View>
                {item.options.length > 0 && (
                  <Text
                    className="text-sm text-gray-500"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Variant: {item.options.join(", ")}
                  </Text>
                )}
                {item.options.length > 0 && (
                  <Text
                    className="text-sm text-gray-500"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    Modifiers: {item.modifiers.join(", ")}
                  </Text>
                )}
                {!!item.note && (
                  <Text className="text-sm text-gray-500">
                    Note: {item.note}
                  </Text>
                )}
              </View>
              <View className="ml-auto w-[105]">
                <Text
                  className="text-base text-right"
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  {currencyFormat.format(
                    Number(item.price) * Number(item.quantity)
                  )}
                </Text>
                <View className="flex-row items-center">
                  <View className="ml-auto mr-1.5">
                    <MaterialIcons
                      name="discount"
                      size={15}
                      color={"#9ca3af"}
                    />
                  </View>
                  <Text
                    className="text-sm text-right text-gray-400"
                    ellipsizeMode="tail"
                    numberOfLines={1}
                  >
                    {currencyFormat.format(
                      (Number(item.discount) * Number(item.price)) / 100
                    )}
                  </Text>
                </View>
                <Text
                  className="text-right text-base font-bold"
                  ellipsizeMode="tail"
                  numberOfLines={1}
                >
                  {currencyFormat.format(Number(item.totalPrice))}
                </Text>
              </View>
            </View>
          </View>
        )}
        ListFooterComponent={
          <View className="mt-1">
            <View className="flex-row items-center border-y border-gray-300 mb-5 mx-7">
              <View className="mr-2 bg-gray-200 h-[50] w-[50]">
                <Icon name="cash" className="m-auto text-gray-500" />
              </View>
              <Text className="text-base font-bold">Total</Text>
              <Text className="text-base ml-auto w-[100] text-right font-bold">
                {currencyFormat.format(
                  Number(getOrderResult.data?.totalAmount ?? 0)
                )}
              </Text>
            </View>
            {getOrderResult.data && getOrderResult.data.refunds.length > 0 && (
              <View className="bg-gray-50 border-t-2 border-dashed">
                {getOrderResult.data?.refunds.map((item) => (
                  <View
                    key={item.refundedAt}
                    className="pb-7 border-b border-gray-400 border-dashed px-7"
                  >
                    <Text className="font-bold text-base mt-7">Refund</Text>
                    <Text className="text-gray-500 mb-3">
                      {dayjs(item.refundedAt).format("hh:mm A / DD-MM-YYYY")}
                    </Text>
                    <View className="items-center flex-row border-t p-1">
                      <MaterialCommunityIcons name="text" size={30} />
                      <Text className="ml-3 font-bold">
                        {item.refundReason}
                      </Text>
                    </View>
                    {item.products.map((product) => (
                      <View
                        key={`${product.id}`}
                        className="py-2 border-t border-gray-300"
                      >
                        <View className="flex-row">
                          <View className="w-[195]">
                            <View className="flex-row items-center">
                              {Number(product.quantity) > 1 ? (
                                <>
                                  <Text
                                    className="text-base font-medium max-w-[140]"
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                  >
                                    {product.name}
                                  </Text>
                                  <Text className="text-sm text-gray-500 ml-1">{`x ${product.quantity}`}</Text>
                                </>
                              ) : (
                                <Text
                                  className="text-base font-medium w-full"
                                  numberOfLines={1}
                                  ellipsizeMode="tail"
                                >
                                  {product.name}
                                </Text>
                              )}
                            </View>
                            {product.options.length > 0 && (
                              <Text
                                className="text-sm text-gray-500"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                              >
                                Variant: {product.options.join(", ")}
                              </Text>
                            )}
                            {product.options.length > 0 && (
                              <Text
                                className="text-sm text-gray-500"
                                numberOfLines={1}
                                ellipsizeMode="tail"
                              >
                                Modifiers: {product.modifiers.join(", ")}
                              </Text>
                            )}
                            {!!product.note && (
                              <Text className="text-sm text-gray-500">
                                Note: {product.note}
                              </Text>
                            )}
                          </View>
                          <View className="ml-auto w-[105]">
                            <Text
                              className="text-base text-right"
                              ellipsizeMode="tail"
                              numberOfLines={1}
                            >
                              {currencyFormat.format(
                                Number(product.price) * Number(product.quantity)
                              )}
                            </Text>
                            <View className="flex-row items-center">
                              <View className="ml-auto mr-1.5">
                                <MaterialIcons
                                  name="discount"
                                  size={15}
                                  color={"#9ca3af"}
                                />
                              </View>
                              <Text
                                className="text-sm text-right text-gray-400"
                                ellipsizeMode="tail"
                                numberOfLines={1}
                              >
                                {currencyFormat.format(
                                  (Number(product.discount) *
                                    Number(product.price)) /
                                    100
                                )}
                              </Text>
                            </View>
                            <Text
                              className="text-right text-base font-bold"
                              ellipsizeMode="tail"
                              numberOfLines={1}
                            >
                              {currencyFormat.format(
                                Number(product.totalPrice)
                              )}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ))}
                    <View className="flex-row items-center border-y border-gray-300 my-1">
                      <View className="mr-2 bg-gray-200 h-[50] w-[50]">
                        <Icon name="cash" className="m-auto text-gray-500" />
                      </View>
                      <Text className="text-base font-bold">Total</Text>
                      <Text className="text-base ml-auto w-[100] text-right font-bold">
                        {currencyFormat.format(Number(item.totalAmount ?? 0))}
                      </Text>
                    </View>
                    <Text className="font-bold text-base">Processed By</Text>
                    <Text className="text-gray-500">
                      {`${getOrderResult.data?.processedBy.name} (${getOrderResult.data?.processedBy.email})`}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        }
      />
    </View>
  );
};

export default OrderDetail;
