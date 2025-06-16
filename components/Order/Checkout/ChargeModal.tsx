import React from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { View, Text, TouchableOpacity } from "react-native";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

import ReceiptModal from "./ReceiptModal";
import BasicModal from "@/components/BasicModal";
import RadioGroup from "@/components/RadioGroup";
import CurrencyTextInput from "@/components/CurrencyTextInput";

import { z } from "zod";
import { Icon } from "@/components/Icon";
import { openModal } from "../orderSlice";
import { PrimaryButton } from "@/components/PrimaryButton";
import { currencyFormat } from "@/utils/defaultFormat";
import { useStoreOrderMutation } from "@/components/services/order";
import { useGetPaymentMethodsQuery } from "@/components/services/paymentMethod";
import { useAppDispatch, useAppSelector } from "@/components/reduxHooks";

const ChargeModal = ({
  onRequestClose,
  chargeAmount,
  visible,
  ...props
}: ChargeModalProps) => {
  const storeId = useAppSelector(
    ({ store: { selectedStoreId } }) => selectedStoreId
  )!;
  const items = useAppSelector(({ order }) => order.items);
  const openModals = useAppSelector(({ order }) => order.openModals);

  const dispatch = useAppDispatch();

  const [storeOrder, storeOrderResult] = useStoreOrderMutation();

  const { data: paymentMethods, isFetching } = useGetPaymentMethodsQuery({
    storeId,
  });

  const { control, handleSubmit, watch, reset } = useForm({
    resolver: zodResolver(Schema),
    mode: "all",
  });

  const paymentMethodsOption = React.useMemo(
    () =>
      paymentMethods
        ? paymentMethods.map(({ name, destination, id }) => ({
            label: `${name} (${destination})`,
            value: `${id}`,
          }))
        : [],
    [paymentMethods]
  );

  const onSubmit: SubmitHandler<z.infer<typeof Schema>> = (data) => {
    const orderedProducts = items.map((item) =>
      "variantId" in item
        ? {
            note: item.note,
            discount: item.discount,
            quantity: item.quantity,
            variantId: item.variantId,
            modifierIds: item.modifierIds,
          }
        : {
            note: item.note,
            discount: item.discount,
            quantity: item.quantity,
            customAmount: item.customAmount,
          }
    );

    storeOrder({
      cashAmount: data.cashAmount,
      orderedProducts,
      paymentMethodId: parseInt(data.paymentMethodId),
      storeId,
    })
      .unwrap()
      .then(() => {
        dispatch(openModal("receipt"));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const cashAmount = watch("cashAmount");

  React.useEffect(() => {
    reset({ cashAmount: chargeAmount });
  }, [chargeAmount]);

  return (
    <>
      <BasicModal
        {...props}
        animationType="slide"
        containerClassName="flex-1 bg-white px-4 py-1"
        visible={visible}
        onRequestClose={onRequestClose}
      >
        <View className="flex-row items-center">
          <TouchableOpacity className="w-[30] mr-3" onPress={onRequestClose}>
            <Icon name="arrow-back" size={25} className="m-auto" />
          </TouchableOpacity>
          <Text className="text-base font-bold">Charge</Text>
          <TouchableOpacity className="ml-auto">
            <Text className="font-medium text-blue-500">Split Bill</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-4xl font-bold mx-auto my-8">
          {currencyFormat.format(Number(chargeAmount))}
        </Text>
        <View className="mb-5">
          <Text className="text-base mb-3 font-medium">Payment Method</Text>
          <Controller
            name="paymentMethodId"
            control={control}
            render={({
              field: { onChange, value: currentValue, ref, ...rest },
            }) => {
              return (
                <RadioGroup
                  {...rest}
                  value={paymentMethodsOption.find(
                    ({ value }) => value === currentValue
                  )}
                  onValueChange={({ value }) => {
                    onChange(value);
                  }}
                  options={paymentMethodsOption}
                />
              );
            }}
          />
        </View>
        <Text className="text-base mb-3 font-medium">Amount Paid</Text>
        <Controller
          name="cashAmount"
          control={control}
          render={({ field: { onChange, value, ref, ...rest } }) => {
            return (
              <CurrencyTextInput
                {...rest}
                value={value}
                className="py-2"
                onValueChange={({ raw }) => {
                  onChange(raw);
                }}
              />
            );
          }}
        />
        <PrimaryButton
          isProcessing={storeOrderResult.isLoading}
          onPress={handleSubmit(onSubmit)}
          className="mt-3 h-[45]"
        >
          Tender
        </PrimaryButton>
      </BasicModal>
      <ReceiptModal
        amountPaid={cashAmount}
        chargeAmount={chargeAmount}
        visible={openModals.includes("receipt")}
      />
    </>
  );
};

export default ChargeModal;

interface ChargeModalProps
  extends React.ComponentPropsWithoutRef<typeof BasicModal> {
  chargeAmount: string;
}

const Schema = z.object({
  paymentMethodId: z.string().regex(/^\d+$/),
  cashAmount: z.string().regex(/^\d+$/, { message: "Invalid cash amount" }),
});
