import React from "react";

import {
  Alert,
  TouchableHighlight,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import BasicModal from "@/components/BasicModal";

import { Icon } from "@/components/Icon";
import { currencyFormat } from "@/utils/defaultFormat";
import { removeItem, setSelectedItemId } from "../orderSlice";
import { PrimaryTouchable } from "@/components/PrimaryTouchable";
import { useAppDispatch, useAppSelector } from "@/components/reduxHooks";

const ReviewSaleModal = ({
  onRequestClose,
  visible,
  ...props
}: ReviewSaleModalProps) => {
  const totalCharge = useAppSelector(({ order }) => order.totalCharge);
  const items = useAppSelector(({ order }) => order.items);

  const dispatch = useAppDispatch();

  const attemptClearItems = () => {
    dispatch(setSelectedItemId(null));
    Alert.alert(
      "Clear All Items ?",
      "All selected items will be removed.  Do you want to proceed?",
      [
        {
          text: "Cancel",
        },
        {
          text: "Clear items",
          onPress: () => {
            dispatch(removeItem());
          },
        },
      ]
    );
  };

  return (
    <BasicModal
      {...props}
      onRequestClose={onRequestClose}
      animationType="slide"
      visible={visible}
      containerClassName="h-[95%] mt-auto bg-white p-5"
    >
      <View className="flex-row justify-between items-center mb-5">
        <TouchableOpacity className="w-[30]" onPress={onRequestClose}>
          <Icon name="close" size={25} className="m-auto" />
        </TouchableOpacity>
        <Text className="text-base font-bold">Current sale</Text>
        <TouchableOpacity className="w-[30]" onPress={attemptClearItems}>
          <Icon name="trash-outline" size={25} className="m-auto" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity className="mb-3">
        <View className="flex-row items-center justify-between bg-gray-100 px-5 py-3.5">
          <Icon name="person-add-outline" size={25} />
          <Text className="flex-1 ml-5 text-base font-medium">
            Add customer
          </Text>
          <Icon name="chevron-forward" size={25} />
        </View>
      </TouchableOpacity>
      <ScrollView className="mb-3">
        {items.map((item) => {
          return (
            <TouchableHighlight
              key={item.id}
              className="rounded"
              underlayColor={"#f3f4f6"}
              onPress={() => {}}
            >
              <View className="flex-row justify-between px-1.5 py-2">
                <View className="w-[190]">
                  <Text
                    className="text-base font-medium"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.productVariantId ? "Item Name" : "Custom amount"}
                  </Text>
                  {!!item.note && (
                    <Text
                      className="text-sm text-gray-500"
                      numberOfLines={5}
                      ellipsizeMode="tail"
                    >
                      Note: {item.note}
                    </Text>
                  )}
                </View>
                <Text className="text-base">
                  {item.productVariantId
                    ? "Item Price"
                    : currencyFormat.format(Number(item.customAmount))}
                </Text>
              </View>
            </TouchableHighlight>
          );
        })}
      </ScrollView>
      <TouchableOpacity className="mb-3">
        <View className="flex-row items-center justify-between py-3.5 px-5 bg-gray-100">
          <Icon name="wallet-outline" size={25} />
          <Text className="flex-1 ml-5 text-base text-gray-700">
            Add discount
          </Text>
          <Icon name="chevron-forward" size={25} className="text-gray-500" />
        </View>
      </TouchableOpacity>
      <PrimaryTouchable className="h-[50]">
        <Text className="text-white font-bold text-base">
          Charge {currencyFormat.format(totalCharge)}
        </Text>
      </PrimaryTouchable>
    </BasicModal>
  );
};

export default ReviewSaleModal;

interface ReviewSaleModalProps
  extends React.ComponentPropsWithoutRef<typeof BasicModal> {}
