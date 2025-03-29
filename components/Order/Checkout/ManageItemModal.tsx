import React from "react";

import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  GestureResponderEvent,
} from "react-native";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import BasicModal from "@/components/BasicModal";
import PrimaryInput from "@/components/PrimaryInput";
import CurrencyTextInput from "@/components/CurrencyTextInput";

import { Icon } from "@/components/Icon";
import { currencyFormat } from "@/utils/defaultFormat";
import { DangerButton } from "@/components/DangerButton";
import { useAppDispatch } from "@/components/reduxHooks";
import { PrimaryTouchable } from "@/components/PrimaryTouchable";
import { SecondaryTouchable } from "@/components/SecondaryTouchable";
import { Item, removeItem, setSelectedItemId, updateItem } from "../orderSlice";

const ManageItemModal = ({
  onSave = () => {},
  onRequestClose,
  item,
  ...props
}: ManageItemModalProps) => {
  const {
    handleSubmit,
    control,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(Schema),
    mode: "all",
    defaultValues: {
      customAmount: item?.customAmount ?? "",
      quantity: "1",
      note: item?.note ?? "",
    },
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
            if (onRequestClose) {
              onRequestClose(e);
            }
            dispatch(removeItem());
            dispatch(setSelectedItemId(null));
          },
        },
      ]
    );
  };

  const onSubmit: SubmitHandler<z.infer<typeof Schema>> = (data, e) => {
    if (onRequestClose && e) {
      onRequestClose(e);
    }
    dispatch(updateItem(data));
  };

  React.useEffect(() => {
    setValue("customAmount", item?.customAmount ?? "", {
      shouldValidate: true,
    });
    setValue("note", item?.note ?? "", { shouldValidate: true });
    setValue("quantity", item?.quantity ?? "", { shouldValidate: true });
  }, [item]);

  return (
    <BasicModal
      {...props}
      animationType="slide"
      onRequestClose={onRequestClose}
      containerClassName="bg-white flex-1 p-1"
    >
      {item && (
        <>
          <View className="flex-row justify-between items-center mb-5">
            <SecondaryTouchable onPress={onRequestClose}>
              <Icon name="arrow-back" size={27} className="p-1.5" />
            </SecondaryTouchable>
            <Text
              className="text-base font-bold w-[240] text-center"
              ellipsizeMode="tail"
              numberOfLines={1}
            >
              {item.productVariantId
                ? "Item X"
                : `Custom Amount ${currencyFormat.format(
                    Number(item.customAmount ?? 0)
                  )}`}
            </Text>
            <PrimaryTouchable onPress={handleSubmit(onSubmit)}>
              <Icon
                name="save-outline"
                size={27}
                className="text-white p-1.5"
              />
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
                          onBlur={(e) => {
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
            <View className="py-5 my-5 border-t border-gray-300">
              <DangerButton className="py-2" onPress={handleRemoveItem}>
                Remove Item
              </DangerButton>
            </View>
          </View>
        </>
      )}
    </BasicModal>
  );
};

export default ManageItemModal;

const Schema = z.object({
  customAmount: z
    .string()
    .min(1)
    .max(8, { message: "The maximum price is Rp99.999.999" }),
  quantity: z
    .string()
    .min(1)
    .max(4, { message: "The maximum quantity is 9999" }),
  note: z.string().max(200, { message: "Must contain at most 200 characters" }),
});

interface ManageItemModalProps
  extends React.ComponentPropsWithoutRef<typeof BasicModal> {
  onSave?: () => void;
  item: Item | undefined;
}
