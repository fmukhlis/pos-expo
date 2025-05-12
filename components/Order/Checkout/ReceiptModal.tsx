import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";

import BasicModal from "@/components/BasicModal";

import { resetOrder } from "../orderSlice";
import { currencyFormat } from "@/utils/defaultFormat";
import { useAppDispatch } from "@/components/reduxHooks";
import { PrimaryButtonLG } from "@/components/PrimaryButton";

const ReceiptModal = ({
  visible,
  amountPaid,
  chargeAmount,
  onRequestClose,
  ...props
}: ReceiptModalProps) => {
  const dispatch = useAppDispatch();

  const change = Number(amountPaid) - Number(chargeAmount);

  const newSale = (e: GestureResponderEvent) => {
    if (onRequestClose) {
      onRequestClose(e);
    }
    dispatch(resetOrder());
  };

  return (
    <BasicModal
      {...props}
      animationType="slide"
      visible={visible}
      containerClassName="flex-1 bg-white px-4 py-1"
    >
      <View className="flex-row justify-between mb-10">
        <TouchableOpacity onPress={newSale}>
          <Text className="font-medium text-blue-500 text-base">New Sale</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="font-medium text-blue-500 text-base">
            New Customer
          </Text>
        </TouchableOpacity>
      </View>
      <View className="items-center">
        {change === 0 ? (
          <Text className="text-xl font-medium">No change</Text>
        ) : (
          <Text className="text-xl font-medium">
            {currencyFormat.format(change)} change
          </Text>
        )}
        <Text className="text-xl">
          Out of {currencyFormat.format(Number(chargeAmount))}
        </Text>
      </View>
      <View className="items-center my-auto">
        <Text className="text-xl w-[200] text-center mb-5">
          How would you like your receipt?
        </Text>
        <PrimaryButtonLG className="w-[250] py-2 mb-3">Print</PrimaryButtonLG>
        <PrimaryButtonLG disabled className="w-[250] py-2 mb-3">
          Email
        </PrimaryButtonLG>
        <PrimaryButtonLG className="w-[250] py-2">No receipt</PrimaryButtonLG>
      </View>
    </BasicModal>
  );
};

export default ReceiptModal;

interface ReceiptModalProps
  extends React.ComponentPropsWithoutRef<typeof BasicModal> {
  chargeAmount: string;
  amountPaid: string;
}
