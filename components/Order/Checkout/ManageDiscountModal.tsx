import React from "react";

import { View, Text, TouchableOpacity } from "react-native";

import BasicModal from "@/components/BasicModal";
import PrimaryInput from "@/components/PrimaryInput";

import { Icon } from "@/components/Icon";
import { SecondaryTouchable } from "@/components/SecondaryTouchable";

const ManageDiscountModal = ({
  visible,
  onRequestClose,
  onSave,
  ...props
}: ManageDiscountModalProps) => {
  const [discount, setDiscount] = React.useState("");

  return (
    <BasicModal
      {...props}
      visible={visible}
      onRequestClose={onRequestClose}
      animationType="slide"
      containerClassName="h-full bg-white p-4"
    >
      <View className="flex-row justify-between items-center mb-5">
        <TouchableOpacity className="w-[30]" onPress={onRequestClose}>
          <Icon name="close" size={25} className="m-auto" />
        </TouchableOpacity>
        <Text className="text-base font-bold">Manage discount</Text>
        <TouchableOpacity
          className="w-[30]"
          onPress={() => {
            if (onSave) onSave(discount);
          }}
        >
          <Icon name="checkmark" size={25} className="m-auto" />
        </TouchableOpacity>
      </View>
      <View className="flex-row flex-wrap gap-3 justify-between mb-3 pb-1">
        <SecondaryTouchable
          className={`py-2 px-1.5 ${discount ? "bg-gray-100" : ""}`}
          onPress={() => {
            setDiscount("");
          }}
        >
          <Text className="text-sm text-gray-500 font-medium">None</Text>
        </SecondaryTouchable>
        {discountSuggestions.map((discountSuggestion) => (
          <SecondaryTouchable
            key={discountSuggestion}
            className={`py-2 px-1.5 ${
              discount !== discountSuggestion ? "bg-gray-100" : ""
            }`}
            onPress={() => {
              setDiscount(discountSuggestion);
            }}
          >
            <Text className="text-sm text-gray-500 font-medium">
              {discountSuggestion}%
            </Text>
          </SecondaryTouchable>
        ))}
        <View className="w-[215]">
          <PrimaryInput
            keyboardType="numeric"
            maxLength={2}
            placeholder="Custom amount..."
            className="h-[38] text-sm"
            onChangeText={(text) => {
              setDiscount(text.replace(/\D/g, ""));
            }}
            value={discount}
          />
        </View>
      </View>
      <Text className="text-gray-400">
        Note: The discount is applied globally, so it might replace the discount
        applied to some products
      </Text>
    </BasicModal>
  );
};

export default ManageDiscountModal;

const discountSuggestions = ["10", "15", "20", "25", "30", "40", "50"];

interface ManageDiscountModalProps
  extends React.ComponentPropsWithoutRef<typeof BasicModal> {
  onSave?: (discount: string) => void;
}
