import React from "react";

import { View, Text, TouchableOpacity } from "react-native";

import BasicModal from "@/components/BasicModal";

import { PrimaryButtonLG } from "@/components/PrimaryButton";

const ReceiptModal = ({
  visible,
  onRequestClose,
  ...props
}: ReceiptModalProps) => {
  return (
    <BasicModal
      {...props}
      animationType="slide"
      visible={visible}
      containerClassName="flex-1 bg-white px-4 py-1"
    >
      <View className="flex-row justify-between mb-10">
        <TouchableOpacity onPress={onRequestClose}>
          <Text className="font-medium text-blue-500 text-base">New Sale</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text className="font-medium text-blue-500 text-base">
            New Customer
          </Text>
        </TouchableOpacity>
      </View>
      <View className="items-center">
        {/* <Text className="text-xl font-medium">No change</Text> */}
        <Text className="text-xl font-medium">Rp 5.000 change</Text>
        <Text className="text-xl">Out of Rp 45.000</Text>
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
  extends React.ComponentPropsWithoutRef<typeof BasicModal> {}
