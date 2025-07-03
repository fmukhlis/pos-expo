import React from "react";

import Checkbox from "expo-checkbox";
import BasicModal from "@/components/BasicModal";
import RadioGroup from "@/components/RadioGroup";
import PrimaryInput from "@/components/PrimaryInput";
import CurrencyTextInput from "@/components/CurrencyTextInput";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";

import { Icon } from "@/components/Icon";
import { currencyFormat } from "@/utils/defaultFormat";
import { useAppDispatch, useAppSelector } from "@/components/reduxHooks";
import { PrimaryTouchable } from "@/components/PrimaryTouchable";
import { SecondaryTouchable } from "@/components/SecondaryTouchable";
import { closeModal, openModal, setRefundPayload } from "../orderSlice";

const IssueRefundModal = ({
  visible,
  onRequestClose,
  ...props
}: IssueRefundModalProps) => {
  const selectedOrder = useAppSelector(({ order }) => order.selectedOrder);

  const { reset, control, handleSubmit, watch, setValue } = useForm({
    resolver: zodResolver(Schema),
    mode: "all",
    defaultValues,
  });

  const dispatch = useAppDispatch();

  const [price, setPrice] = React.useState("0");

  const reason = watch("reason");

  const onSubmit: SubmitHandler<z.infer<typeof Schema>> = (data, e) => {
    const { otherReason, reason, orderProductVariantIds } = data;
    if (reason) {
      dispatch(openModal("PinModal"));
      if (reason === "Other") {
        dispatch(
          setRefundPayload({
            reason: otherReason,
            authorizationCode: "",
            orderProductVariantIds,
          })
        );
      } else {
        dispatch(
          setRefundPayload({
            orderProductVariantIds,
            reason,
            authorizationCode: "",
          })
        );
      }
    }
  };

  React.useEffect(() => {
    reset();
  }, [visible]);

  if (!selectedOrder) {
    return <></>;
  }

  return (
    <BasicModal
      {...props}
      visible={visible}
      animationType="slide"
      onRequestClose={() => {
        dispatch(closeModal("IssueRefundModal"));
      }}
      containerClassName="bg-white flex-1 p-1"
    >
      <ScrollView keyboardShouldPersistTaps="handled">
        <View className="flex-row justify-between items-center mb-2.5">
          <SecondaryTouchable
            onPress={() => {
              dispatch(closeModal("IssueRefundModal"));
            }}
          >
            <Icon name="close" size={27} className="p-1.5" />
          </SecondaryTouchable>
          <Text
            className="text-base font-bold w-[240] text-center"
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            Issue Refund
          </Text>
          <PrimaryTouchable onPress={handleSubmit(onSubmit)} className="p-1">
            <MaterialCommunityIcons
              name="cash-refund"
              size={31}
              color={"#fff"}
            />
          </PrimaryTouchable>
        </View>
        <Controller
          name="orderProductVariantIds"
          control={control}
          render={({ field: { value: currentValue, onChange } }) => {
            return (
              <>
                <View className="items-center justify-between flex-row bg-gray-100 border-gray-400">
                  <Text className="font-semibold text-base pl-4">
                    Select Items
                  </Text>
                  <TouchableOpacity
                    className="py-4 px-4"
                    onPress={() => {
                      if (
                        currentValue.length !==
                        selectedOrder.refundableProducts.length
                      ) {
                        onChange(
                          selectedOrder.refundableProducts.map(
                            ({ id }) => `${id}`
                          )
                        );
                        setPrice(
                          `${selectedOrder.refundableProducts.reduce(
                            (acc, carry) => {
                              return acc + Number(carry.totalPrice);
                            },
                            0
                          )}`
                        );
                      } else {
                        onChange([]);
                        setPrice(`0`);
                      }
                    }}
                  >
                    <Checkbox
                      value={
                        currentValue.length ===
                        selectedOrder.refundableProducts.length
                      }
                      onValueChange={(value) => {
                        if (value) {
                          onChange(
                            selectedOrder.refundableProducts.map(
                              ({ id }) => `${id}`
                            )
                          );
                          setPrice(
                            `${selectedOrder.refundableProducts.reduce(
                              (acc, carry) => {
                                return acc + Number(carry.totalPrice);
                              },
                              0
                            )}`
                          );
                        } else {
                          onChange([]);
                          setPrice(`0`);
                        }
                      }}
                      className="m-1"
                    />
                  </TouchableOpacity>
                </View>
                {selectedOrder.refundableProducts.map(
                  ({ id, options, name, totalPrice }) => {
                    const handlePress = () => {
                      if (currentValue.includes(`${id}`)) {
                        onChange(
                          currentValue.filter((item) => item !== `${id}`)
                        );
                        setPrice(
                          (prev) => `${Number(prev) - Number(totalPrice)}`
                        );
                      } else {
                        onChange([...currentValue, `${id}`]);
                        setPrice(
                          (prev) => `${Number(prev) + Number(totalPrice)}`
                        );
                      }
                    };

                    return (
                      <TouchableOpacity
                        className="py-2 border-b border-gray-300 mx-4"
                        activeOpacity={1}
                        onPress={handlePress}
                        key={id}
                      >
                        <View className="flex-row items-center">
                          <View>
                            <Text
                              className="font-bold text-base w-[150]"
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {name}
                            </Text>
                            <Text
                              className="text-gray-400 text-base w-[150]"
                              numberOfLines={1}
                              ellipsizeMode="tail"
                            >
                              {options.join(", ")}
                            </Text>
                          </View>
                          <Text
                            className="font-bold ml-auto mr-2 text-base w-[130] text-right"
                            numberOfLines={1}
                            ellipsizeMode="tail"
                          >
                            {currencyFormat.format(Number(totalPrice))}
                          </Text>
                          <Checkbox
                            className="m-1"
                            value={currentValue.includes(`${id}`)}
                            onValueChange={handlePress}
                          />
                        </View>
                      </TouchableOpacity>
                    );
                  }
                )}
              </>
            );
          }}
        />
        <Text className="text-center text-gray-500 mt-3 mb-5">
          Item amount includes discounts where applicable
        </Text>
        <View className="mx-4 flex-row items-center border-b border-gray-300 py-1">
          <Icon name="cash" />
          <Text className="font-semibold text-base ml-3">Cash</Text>
          <CurrencyTextInput
            className="h-[40] font-bold text-right text-black"
            containerClassName="w-[200] ml-auto border-0 bg-transparent"
            placeholder="Price"
            value={price}
            editable={false}
          />
        </View>
        <View className="mx-4 h-[280]">
          <Text className="mt-5 font-semibold text-base">
            Reason for refund
          </Text>
          <Controller
            name="reason"
            control={control}
            render={({ field: { onChange, value, ref, ...rest } }) => {
              return (
                <RadioGroup
                  {...rest}
                  className="mt-3"
                  onValueChange={({ value }) => {
                    onChange(value);
                    if (value !== "Other") {
                      setValue("otherReason", "");
                    }
                  }}
                  options={options}
                  value={value}
                />
              );
            }}
          />
          {reason === "Other" && (
            <Controller
              name="otherReason"
              control={control}
              render={({ field: { onChange, value, ...rest } }) => {
                return (
                  <View className="pb-2 border-b border-gray-200">
                    <PrimaryInput
                      {...rest}
                      value={value}
                      onChangeText={onChange}
                      containerClassName="bg-transparent"
                      className="py-1.5 text-[15px]"
                      placeholder="Other reason..."
                    />
                  </View>
                );
              }}
            />
          )}
        </View>
      </ScrollView>
    </BasicModal>
  );
};

export default IssueRefundModal;

interface IssueRefundModalProps
  extends React.ComponentPropsWithoutRef<typeof BasicModal> {}

const optionsString = [
  "Returned goods",
  "Accidental charge",
  "Canceled order",
  "Other",
] as const;

const options = optionsString.map((option) => ({
  label: option,
  value: option,
}));

const Schema = z
  .object({
    reason: z.enum(optionsString).optional(),
    otherReason: z
      .string()
      .max(200, { message: "Must contain at most 200 characters" }),
    orderProductVariantIds: z.array(z.string()).min(1),
  })
  .refine(
    (data) =>
      data.reason
        ? data.reason === "Other"
          ? data.otherReason.length > 0
          : true
        : false,
    {
      message: "Reason is invalid",
      path: ["reason"],
    }
  );

const defaultValues = {
  reason: undefined,
  otherReason: "",
  orderProductVariantIds: [] as string[],
};
