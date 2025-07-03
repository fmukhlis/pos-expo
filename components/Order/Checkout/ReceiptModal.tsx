import React from "react";

import { Alert } from "react-native";
import {
  View,
  Text,
  TouchableOpacity,
  GestureResponderEvent,
} from "react-native";

import BasicModal from "@/components/BasicModal";
import printCustomerReceipt from "@/utils/printCustomerReceipt";

import { resetOrder } from "../orderSlice";
import { currencyFormat } from "@/utils/defaultFormat";
import { PrimaryButtonLG } from "@/components/PrimaryButton";
import { useLazyGetStoreQuery } from "@/components/services/store";
import { useAppDispatch, useAppSelector } from "@/components/reduxHooks";

const ReceiptModal = ({
  visible,
  onRequestClose,
  ...props
}: ReceiptModalProps) => {
  const storeId = useAppSelector(({ store }) => store.selectedStoreId)!;
  const isAutoPrint = useAppSelector(({ store }) => store.isAutoPrintReceipt);
  const base64ReceiptLogo = useAppSelector(
    ({ store }) => store.base64ReceiptLogo
  )!;
  const detailedOrder = useAppSelector(({ order }) => order.selectedOrder);
  const selectedBluetoothPrinter = useAppSelector(
    ({ store }) => store.selectedBluetoothPrinter
  );

  const dispatch = useAppDispatch();

  const [getStore, getStoreResult] = useLazyGetStoreQuery();

  const change = detailedOrder
    ? Number(detailedOrder.cashAmount) - Number(detailedOrder.totalAmount)
    : 0;

  const [isPrinting, setIsPrinting] = React.useState(false);

  const newSale = (e: GestureResponderEvent) => {
    if (onRequestClose) {
      onRequestClose(e);
    }
    dispatch(resetOrder());
  };

  const handlePrint = () => {
    if (selectedBluetoothPrinter) {
      if (getStoreResult.data && detailedOrder) {
        setIsPrinting(true);
        printCustomerReceipt({
          store: getStoreResult.data,
          order: detailedOrder,
          printer: selectedBluetoothPrinter,
          base64Logo: base64ReceiptLogo,
        }).then(() => {
          setIsPrinting(false);
        });
      }
    } else {
      Alert.alert(
        "No Printer Selected",
        "No printer device has been selected yet. Please set it up in the settings menu.",
        [{ text: "Ok" }]
      );
    }
  };

  React.useEffect(() => {
    getStore({ storeId });
  }, []);

  React.useEffect(() => {
    if (!isPrinting && visible && detailedOrder?.id && isAutoPrint) {
      handlePrint();
    }
  }, [visible]);

  if (!detailedOrder) {
    return <></>;
  }

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
          Out of {currencyFormat.format(Number(detailedOrder.totalAmount))}
        </Text>
      </View>
      <View className="items-center my-auto">
        <Text className="text-xl w-[200] text-center mb-5">
          How would you like your receipt?
        </Text>
        <PrimaryButtonLG
          isProcessing={isPrinting}
          className="w-[250] py-2 mb-3"
          onPress={handlePrint}
        >
          Print
        </PrimaryButtonLG>
        <PrimaryButtonLG disabled className="w-[250] py-2 mb-3">
          Email
        </PrimaryButtonLG>
      </View>
    </BasicModal>
  );
};

export default ReceiptModal;

interface ReceiptModalProps
  extends React.ComponentPropsWithoutRef<typeof BasicModal> {}
