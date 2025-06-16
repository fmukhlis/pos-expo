import React from "react";

import {
  Text,
  View,
  Alert,
  ScrollView,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import BasicModal from "@/components/BasicModal";
import PrimaryInput from "@/components/PrimaryInput";
import CurrencyTextInput from "@/components/CurrencyTextInput";

import { Icon } from "@/components/Icon";
import { DangerButton } from "@/components/DangerButton";
import { currencyFormat } from "@/utils/defaultFormat";
import { PrimaryTouchable } from "@/components/PrimaryTouchable";
import { SecondaryTouchable } from "@/components/SecondaryTouchable";
import { removeItem, updateItem } from "../orderSlice";
import { useAppDispatch, useAppSelector } from "@/components/reduxHooks";

const ManageCustomItemModal = ({
  onRequestClose,
  ...props
}: ManageCustomItemModalProps) => {
  const selectedItem = useAppSelector(({ order }) => order.selectedItem);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(Schema),
    mode: "all",
    defaultValues,
  });

  const dispatch = useAppDispatch();

  const handleRemoveItem = (e: GestureResponderEvent) => {
    Alert.alert(
      "Confirm Remove Item",
      "The item will be removed from the sales. Are you sure?",
      [
        {
          text: "Cancel",
        },
        {
          text: "Remove",
          onPress: () => {
            dispatch(removeItem());
            if (onRequestClose) {
              onRequestClose(e);
            }
          },
        },
      ]
    );
  };

  const onSubmit: SubmitHandler<z.infer<typeof Schema>> = (data, e) => {
    dispatch(updateItem(data));
    if (onRequestClose && e) {
      onRequestClose(e);
    }
  };

  React.useEffect(() => {
    if (selectedItem && !("variantId" in selectedItem)) {
      reset({
        name: selectedItem?.name ?? defaultValues.name,
        note: selectedItem?.note ?? defaultValues.note,
        discount: selectedItem?.discount ?? defaultValues.discount,
        quantity: selectedItem?.quantity ?? defaultValues.quantity,
        customAmount: selectedItem?.customAmount ?? defaultValues.customAmount,
      });
    }
  }, [selectedItem?.id]);

  if (selectedItem && "variantId" in selectedItem) {
    return <></>;
  }

  return (
    <BasicModal
      {...props}
      animationType="slide"
      onRequestClose={onRequestClose}
      containerClassName="bg-white flex-1 p-1"
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className="flex-row justify-between items-center mb-5">
          <SecondaryTouchable onPress={onRequestClose}>
            <Icon name="arrow-back" size={27} className="p-1.5" />
          </SecondaryTouchable>
          <Text
            className="text-base font-bold w-[240] text-center"
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {`Custom amount ${currencyFormat.format(
              Number(selectedItem?.customAmount ?? 0)
            )}`}
          </Text>
          <PrimaryTouchable onPress={handleSubmit(onSubmit)}>
            <Icon name="save-outline" size={27} className="text-white p-1.5" />
          </PrimaryTouchable>
        </View>
        <View className="px-3">
          <View className="flex-row justify-between mb-5">
            <View className="w-[220]">
              <Text className="font-semibold text-base mb-3">Price</Text>
              <Controller
                name="customAmount"
                control={control}
                render={({ field: { value, onBlur, onChange } }) => {
                  return (
                    <CurrencyTextInput
                      autoCapitalize="none"
                      keyboardType="numeric"
                      className="h-[40] text-sm"
                      placeholder="Price"
                      value={value}
                      onBlur={onBlur}
                      onValueChange={({ raw }) => {
                        onChange(raw);
                      }}
                    />
                  );
                }}
              />
              {errors.customAmount && (
                <Text className="text-red-500 text-xs">
                  {errors.customAmount.message}
                </Text>
              )}
            </View>
            <View>
              <Text className="font-semibold text-base mb-3">Quantity</Text>
              <Controller
                name="quantity"
                control={control}
                render={({ field: { value, onBlur, onChange } }) => {
                  return (
                    <View className="relative">
                      <PrimaryInput
                        autoCapitalize="none"
                        keyboardType="numeric"
                        className="h-[40] text-sm text-center "
                        containerClassName="w-[95] px-[30]"
                        value={value}
                        onBlur={() => {
                          if (!value) {
                            onChange("1");
                          }
                          onBlur();
                        }}
                        onChangeText={(text) => {
                          const numericText = text.replace(/^0+|\D/g, "");
                          onChange(numericText.substring(0, 4));
                        }}
                      />
                      <TouchableOpacity
                        className="absolute top-[1px] left-0 h-[40] w-[30] border-r border-gray-300"
                        onPress={() => {
                          const decrementedValue = Number(value) - 1;
                          if (decrementedValue > 0) {
                            onChange(`${decrementedValue}`);
                          }
                        }}
                      >
                        <Icon
                          name="remove"
                          className="m-auto text-gray-500"
                          size={20}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="absolute top-[1px] right-0 h-[40] w-[30] border-l border-gray-300"
                        onPress={() => {
                          const incrementedValue = Number(value) + 1;
                          if (`${incrementedValue}`.length < 5) {
                            onChange(`${incrementedValue}`);
                          }
                        }}
                      >
                        <Icon
                          name="add"
                          className="m-auto text-gray-500"
                          size={20}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
              {errors.quantity && (
                <Text className="text-red-500 text-xs">
                  {errors.quantity.message}
                </Text>
              )}
            </View>
          </View>
          <Text className="font-semibold text-base mb-3">Notes</Text>
          <Controller
            name="note"
            control={control}
            render={({ field: { onBlur, onChange, value } }) => {
              return (
                <PrimaryInput
                  multiline
                  value={value}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  textAlignVertical="top"
                  className="min-h-[100] my-2"
                />
              );
            }}
          />
          {errors.note && (
            <Text className="text-red-500 text-xs">{errors.note.message}</Text>
          )}
          <Text className="font-semibold text-base mt-5 mb-3">Discounts</Text>
          <Controller
            name="discount"
            control={control}
            render={({ field: { onBlur, onChange, value } }) => {
              return (
                <View className="flex-row flex-wrap gap-3 justify-between mb-3 pb-1">
                  <SecondaryTouchable
                    className={`py-2 px-1.5 ${value ? "bg-gray-100" : ""}`}
                    onPress={() => {
                      onChange("");
                    }}
                  >
                    <Text className="text-sm text-gray-500 font-medium">
                      None
                    </Text>
                  </SecondaryTouchable>
                  {discountSuggestions.map((discountSuggestion) => (
                    <SecondaryTouchable
                      key={discountSuggestion}
                      className={`py-2 px-1.5 ${
                        value !== discountSuggestion ? "bg-gray-100" : ""
                      }`}
                      onPress={() => {
                        onChange(discountSuggestion);
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
                      placeholder="Custom discount..."
                      className="h-[38] text-sm"
                      onChangeText={(text) => {
                        onChange(text.replace(/\D/g, ""));
                      }}
                      onBlur={onBlur}
                      value={value}
                    />
                  </View>
                </View>
              );
            }}
          />
          {errors.discount && (
            <Text className="text-red-500 text-xs">
              {errors.discount.message}
            </Text>
          )}
          <View className="py-5 my-5 border-t border-gray-300">
            <DangerButton className="py-2" onPress={handleRemoveItem}>
              Remove Item
            </DangerButton>
          </View>
        </View>
      </ScrollView>
    </BasicModal>
  );
};

export default ManageCustomItemModal;

const Schema = z
  .object({
    name: z.string(),
    note: z
      .string()
      .max(200, { message: "Must contain at most 200 characters" }),
    discount: z.string().regex(/^\d*$/, { message: "Invalid discount" }),
    quantity: z
      .string()
      .regex(/^(?!0$)\d+$/, { message: "Invalid quantity" })
      .max(4, { message: "The maximum quantity is 9999" }),
    customAmount: z
      .string()
      .regex(/^\d+$/, { message: "Invalid price" })
      .max(8, { message: "The maximum price is Rp99.999.999" }),
  })
  .required();

const defaultValues = {
  name: "Custom amount",
  note: "",
  discount: "",
  quantity: "1",
  customAmount: "",
};

const discountSuggestions = ["10", "15", "20", "25", "30", "40", "50"];

interface ManageCustomItemModalProps
  extends React.ComponentPropsWithoutRef<typeof BasicModal> {}
