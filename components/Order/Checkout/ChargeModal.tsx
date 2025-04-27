import React from "react";

import { View, Text, TouchableOpacity } from "react-native";

import ReceiptModal from "./ReceiptModal";
import BasicModal from "@/components/BasicModal";
import RadioGroup from "@/components/RadioGroup";
import CurrencyTextInput from "@/components/CurrencyTextInput";

import { Icon } from "@/components/Icon";
import { useAppSelector } from "@/components/reduxHooks";
import { PrimaryButton } from "@/components/PrimaryButton";
import { useGetPaymentMethodsQuery } from "@/components/services/paymentMethod";

const ChargeModal = ({
  onRequestClose,
  visible,
  ...props
}: ChargeModalProps) => {
  const storeId = useAppSelector(
    ({ store: { selectedStoreId } }) => selectedStoreId
  )!;

  const totalCharge = React.useRef("Rp 45.000");

  const { data: paymentMethods, isFetching } = useGetPaymentMethodsQuery({
    storeId,
  });

  const paymentMethodsOption = React.useMemo(
    () =>
      paymentMethods
        ? paymentMethods.map(({ name, id }) => ({
            label: name,
            value: `${id}`,
          }))
        : [],
    [paymentMethods]
  );

  const [form, setForm] = React.useState<{
    paymentMethod: { label: string; value: string } | undefined;
    amountPaid: string;
  }>({
    paymentMethod: paymentMethodsOption[0],
    amountPaid: totalCharge.current,
  });

  const [modalVisible, setModalVisible] = React.useState(false);

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
          {totalCharge.current}
        </Text>
        <View className="mb-5">
          <Text className="text-base mb-3 font-medium">Payment Method</Text>
          <RadioGroup
            options={paymentMethodsOption}
            onValueChange={(paymentMethod) => {
              setForm(({ amountPaid }) => ({ paymentMethod, amountPaid }));
            }}
            value={form.paymentMethod}
          />
        </View>
        <Text className="text-base mb-3 font-medium">Amount Paid</Text>
        <CurrencyTextInput
          className="py-2"
          value={form.amountPaid}
          onValueChange={({ raw: amountPaid }) => {
            setForm(({ paymentMethod }) => ({ paymentMethod, amountPaid }));
          }}
        />
        <PrimaryButton
          onPress={() => {
            setModalVisible(true);
          }}
          className="mt-3 h-[45]"
        >
          Tender
        </PrimaryButton>
      </BasicModal>
      <ReceiptModal
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      />
    </>
  );
};

export default ChargeModal;

interface ChargeModalProps
  extends React.ComponentPropsWithoutRef<typeof BasicModal> {}
