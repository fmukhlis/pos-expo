import React from "react";

import {
  Alert,
  TouchableHighlight,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";

import ChargeModal from "./ChargeModal";
import BasicModal from "@/components/BasicModal";
import ManageDiscountModal from "./ManageDiscountModal";

import { Icon } from "@/components/Icon";
import { MaterialIcons } from "@expo/vector-icons";
import { currencyFormat } from "@/utils/defaultFormat";
import { PrimaryTouchable } from "@/components/PrimaryTouchable";
import { useAppDispatch, useAppSelector } from "@/components/reduxHooks";
import {
  removeItem,
  setSelectedItem,
  setDiscountGlobally,
  closeModal,
  openModal,
} from "../orderSlice";

const ReviewSaleModal = ({
  onRequestClose,
  visible,
  ...props
}: ReviewSaleModalProps) => {
  const selectedItem = useAppSelector(({ order }) => order.selectedItem);
  const totalCharge = useAppSelector(({ order }) => order.totalCharge);
  const items = useAppSelector(({ order }) => order.items);
  const openModals = useAppSelector(({ order }) => order.openModals);

  const dispatch = useAppDispatch();

  const attemptClearItems = () => {
    dispatch(setSelectedItem(null));
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

  React.useEffect(() => {
    if (selectedItem?.id) {
      if ("variantId" in selectedItem) {
        dispatch(openModal("ManageStandardItemModal"));
      } else {
        dispatch(openModal("ManageCustomItemModal"));
      }
    }
  }, [selectedItem?.id]);

  return (
    <>
      <BasicModal
        {...props}
        onRequestClose={onRequestClose}
        animationType="slide"
        visible={visible}
        containerClassName="h-[95%] mt-auto bg-white p-4"
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
            const price = "variantId" in item ? item.price : item.customAmount;
            return (
              <TouchableHighlight
                key={item.id}
                className="rounded"
                underlayColor={"#f3f4f6"}
                onPress={() => {
                  dispatch(setSelectedItem(item));
                }}
              >
                <View className="flex-row px-1.5 py-2">
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
                    {"variantId" in item && (
                      <Text
                        className="text-sm text-gray-500"
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {item.optionNames}
                      </Text>
                    )}
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
                  <View className="ml-auto w-[105]">
                    <Text
                      className="text-base text-right"
                      ellipsizeMode="tail"
                      numberOfLines={1}
                    >
                      {currencyFormat.format(
                        Number(price) * Number(item.quantity)
                      )}
                    </Text>
                    {item.discount && (
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
                            (Number(price) *
                              Number(item.quantity) *
                              (100 - Number(item.discount))) /
                              100
                          )}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </TouchableHighlight>
            );
          })}
        </ScrollView>
        <TouchableOpacity
          className="mb-3"
          onPress={() => {
            dispatch(openModal("ManageDiscountModal"));
          }}
        >
          <View className="flex-row items-center justify-between py-3.5 px-5 bg-gray-100">
            <MaterialIcons name="discount" size={25} />
            <Text className="flex-1 ml-5 text-base text-gray-700">
              Add discount
            </Text>
            <Icon name="chevron-forward" size={25} className="text-gray-500" />
          </View>
        </TouchableOpacity>
        <PrimaryTouchable
          className="h-[50]"
          onPress={() => {
            dispatch(openModal("charge"));
          }}
        >
          <Text className="text-white font-bold text-base">
            Charge {currencyFormat.format(totalCharge)}
          </Text>
        </PrimaryTouchable>
      </BasicModal>
      <ManageDiscountModal
        visible={openModals.includes("ManageDiscountModal")}
        onRequestClose={() => {
          dispatch(closeModal("ManageDiscountModal"));
        }}
        onSave={(discount) => {
          dispatch(closeModal("ManageDiscountModal"));
          dispatch(setDiscountGlobally(discount));
        }}
      />
      <ChargeModal
        chargeAmount={`${totalCharge}`}
        visible={openModals.includes("charge")}
        onRequestClose={() => {
          dispatch(closeModal("charge"));
        }}
      />
    </>
  );
};

export default ReviewSaleModal;

interface ReviewSaleModalProps
  extends React.ComponentPropsWithoutRef<typeof BasicModal> {}
