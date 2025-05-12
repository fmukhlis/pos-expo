import React from "react";

import { z } from "zod";
import { router } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";

import BasicModal from "@/components/BasicModal";
import RadioGroup from "@/components/RadioGroup";
import PrimaryInput from "@/components/PrimaryInput";
import CurrencyTextInput from "@/components/CurrencyTextInput";

import { Icon } from "@/components/Icon";
import { Product } from "@/types/product";
import { useAppDispatch } from "@/components/reduxHooks";
import { PrimaryTouchable } from "@/components/PrimaryTouchable";
import {
  addItem,
  removeItem,
  setSelectedItem,
  StandardItem,
  updateItem,
} from "../orderSlice";
import { SecondaryTouchable } from "@/components/SecondaryTouchable";
import { DangerButton } from "@/components/DangerButton";
import { Alert } from "react-native";

const ManageStandardItemModal = ({
  onRequestClose,
  standardItem,
  visible,
  onSave,
  ...props
}: ManageStandardItemModalProps) => {
  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(Schema),
    mode: "all",
    defaultValues: { ...defaultValues },
  });
  const [product] = watch(["product"]);

  const [priceText, setPriceText] = React.useState("");

  const dispatch = useAppDispatch();

  const activeVariants = standardItem?.product
    ? standardItem.product.availableVariants
        .filter(({ status }) => status === "Active")
        .map(({ productOptions, id, price }) => {
          const optionNames = productOptions.map(({ name }) => name).join(", ");
          return {
            label: optionNames,
            value: `${id}`,
            price: `${price}`,
          };
        })
    : [];

  const activeModifierCategories = standardItem?.product
    ? standardItem.product.availableModifiers
        .filter(({ status }) => status === "Active")
        .map(({ id, name, values }) => {
          return {
            id,
            categoryName: name,
            activeModifiers: values.filter(
              (modifier) => modifier.status === "Active"
            ),
          };
        })
    : [];

  const onSubmit: SubmitHandler<z.infer<typeof Schema>> = (data, e) => {
    if (standardItem?.id) {
      dispatch(updateItem(data));
    } else {
      dispatch(addItem(data));
    }
    if (onRequestClose && e) {
      onRequestClose(e);
      setTimeout(() => {
        if (router.canGoBack()) {
          router.back();
        }
      }, 150);
    }
  };

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

  React.useEffect(() => {
    if (standardItem && standardItem.product) {
      const { id, product, selectedModifierIds, selectedVariantId, ...rest } =
        standardItem;
      const values = {
        ...defaultValues,
        ...(standardItem.id && { ...rest, selectedVariantId }),
        product,
        selectedModifierIds:
          selectedModifierIds && selectedModifierIds.length > 0
            ? selectedModifierIds
            : product.availableModifiers.length > 0
            ? product.availableModifiers.map(() => "")
            : [],
      };
      reset(values);
      setPriceText(
        `${
          product.availableVariants.find(
            ({ id }) => `${id}` === selectedVariantId
          )?.price
        }`
      );
    }
  }, [standardItem?.id, standardItem?.product?.id]);

  return (
    <BasicModal
      {...props}
      visible={visible}
      animationType="slide"
      onRequestClose={onRequestClose}
      containerClassName="bg-white flex-1 p-1"
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className="flex-row justify-between items-center mb-5">
          <SecondaryTouchable onPress={onRequestClose}>
            <Icon name="close" size={27} className="p-1.5" />
          </SecondaryTouchable>
          <Text
            className="text-base font-bold w-[240] text-center"
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {product?.name}
          </Text>
          <PrimaryTouchable onPress={handleSubmit(onSubmit)}>
            <Icon name="save-outline" size={27} className="text-white p-1.5" />
          </PrimaryTouchable>
        </View>
        <View className="px-3">
          <Text className="font-semibold text-base mb-3">
            Variant{"  "}
            <Text className="text-gray-400 font-normal">(Select one)</Text>
          </Text>
          <Controller
            name="selectedVariantId"
            control={control}
            render={({ field: { value: currentValue, onChange } }) => {
              return (
                <RadioGroup
                  className="mb-5 border-b border-gray-200"
                  value={activeVariants.find(
                    ({ value }) => value === currentValue
                  )}
                  onValueChange={({ value, price }) => {
                    onChange(value);
                    setPriceText(price);
                  }}
                  options={activeVariants}
                />
              );
            }}
          />
          {product && product.availableModifiers.length > 0 && (
            <Controller
              name="selectedModifierIds"
              control={control}
              render={({ field: { value: currentValue, onChange } }) => {
                return (
                  <>
                    <Text className="font-semibold text-base">
                      Modifiers{"  "}
                      <Text className="text-gray-400 font-normal">
                        (Select one on each category)
                      </Text>
                    </Text>
                    <View className="px-2 mb-5">
                      {activeModifierCategories.map(
                        ({ id, activeModifiers, categoryName }, index) => {
                          const options = activeModifiers.map(
                            ({ id, name }) => ({
                              label: name,
                              value: `${id}`,
                            })
                          );

                          return (
                            <React.Fragment key={id}>
                              <Text className="font-semibold text-base mt-3">
                                {categoryName}
                              </Text>
                              <RadioGroup
                                className="border-b border-gray-200 mt-3"
                                value={options.find(
                                  ({ value }) =>
                                    `${value}` === currentValue[index]
                                )}
                                onValueChange={(option) => {
                                  onChange(
                                    currentValue.toSpliced(
                                      index,
                                      1,
                                      option.value
                                    )
                                  );
                                }}
                                options={options}
                              />
                            </React.Fragment>
                          );
                        }
                      )}
                    </View>
                  </>
                );
              }}
            />
          )}
          <View className="flex-row justify-between mb-5">
            <View className="w-[220]">
              <Text className="font-semibold text-base mb-3">Price</Text>
              <CurrencyTextInput
                className="h-[40] text-sm"
                placeholder="Price"
                value={priceText}
                editable={false}
              />
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
                      placeholder="Custom amount..."
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
          {standardItem?.id && (
            <View className="py-5 my-5 border-t border-gray-300">
              <DangerButton className="py-2" onPress={handleRemoveItem}>
                Remove Item
              </DangerButton>
            </View>
          )}
        </View>
      </ScrollView>
    </BasicModal>
  );
};

export default ManageStandardItemModal;

const Schema = z
  .object({
    note: z
      .string()
      .max(200, { message: "Must contain at most 200 characters" }),
    quantity: z
      .string()
      .min(1)
      .max(4, { message: "The maximum quantity is 9999" }),
    product: z
      .object({
        id: z.number(),
        name: z.string(),
        category: z
          .object({
            id: z.number(),
            name: z.string(),
            productsCount: z.number(),
          })
          .nullable(),
        availableModifiers: z
          .object({
            id: z.number(),
            name: z.string(),
            status: z.enum(["Active", "Inactive"]),
            values: z
              .object({
                id: z.number(),
                name: z.string(),
                status: z.enum(["Active", "Inactive"]),
              })
              .array(),
          })
          .array(),
        availableOptions: z
          .object({
            id: z.number(),
            name: z.string(),
            status: z.enum(["Active", "Inactive"]),
            values: z
              .object({
                id: z.number(),
                name: z.string(),
                status: z.enum(["Active", "Inactive"]),
              })
              .array(),
          })
          .array(),
        availableVariants: z
          .object({
            id: z.number(),
            price: z.number(),
            stock: z.number(),
            sku: z.string().nullable(),
            status: z.enum(["Active", "Inactive"]),
            productOptions: z
              .object({
                id: z.number(),
                name: z.string(),
                status: z.enum(["Active", "Inactive"]),
              })
              .array(),
          })
          .array(),
      })
      .required(),
    discount: z.string().regex(/^\d*$/),
    selectedVariantId: z.string().regex(/^\d+$/),
    selectedModifierIds: z.string().regex(/^\d+$/).array(),
  })
  .required();

const defaultValues = {
  note: "",
  discount: "",
  quantity: "1",
  selectedVariantId: "",
  selectedModifierIds: [] as string[],
};

const discountSuggestions = ["10", "15", "20", "25", "30", "40", "50"];

interface ManageStandardItemModalProps
  extends React.ComponentPropsWithoutRef<typeof BasicModal> {
  onSave?: () => void;
  standardItem?: Partial<StandardItem> | undefined;
}
