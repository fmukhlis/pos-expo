import React from "react";
import * as SecureStore from "expo-secure-store";

import { BLEPrinter } from "react-native-thermal-receipt-printer-image-qr";
import { Redirect, Stack } from "expo-router";

import VerifyEmail from "@/components/VerifyEmail";
import LoadingPage from "@/components/LoadingPage";

import { useSession } from "@/contexts/SessionContext";
import { useAppDispatch } from "@/components/reduxHooks";
import {
  selectBluetoothPrinter,
  setAutoPrintReceipt,
  setBase64ReceiptLogo,
} from "@/components/Store/storeSlice";

function AuthLayout() {
  const { session, user, sessionLoading } = useSession();

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const init = async () => {
      const base64ReceiptLogo = await SecureStore.getItemAsync(
        "base64ReceiptLogo"
      );
      const isAutoPrintReceipt = await SecureStore.getItemAsync(
        "isAutoPrintReceipt"
      );
      const selectedBluetoothPrinterName = await SecureStore.getItemAsync(
        "selectedBluetoothPrinterName"
      );
      const selectedBluetoothPrinterInnerMacAddress =
        await SecureStore.getItemAsync(
          "selectedBluetoothPrinterInnerMacAddress"
        );
      if (base64ReceiptLogo !== null) {
        dispatch(setBase64ReceiptLogo(base64ReceiptLogo));
      }
      if (isAutoPrintReceipt !== null) {
        dispatch(setAutoPrintReceipt(isAutoPrintReceipt === "true"));
      }
      if (
        selectedBluetoothPrinterName !== null &&
        selectedBluetoothPrinterInnerMacAddress
      ) {
        dispatch(
          selectBluetoothPrinter({
            device_name: selectedBluetoothPrinterName,
            inner_mac_address: selectedBluetoothPrinterInnerMacAddress,
          })
        );
        BLEPrinter.init()
          .then(() => {
            BLEPrinter.connectPrinter(selectedBluetoothPrinterInnerMacAddress)
              .then(
                () => {},
                (err) => {
                  console.error(
                    `Error when trying to connect to the printer\n(${err})`
                  );
                }
              )
              .catch((err) => {
                console.error(
                  `Error when trying to connect to the printer\n(${err})`
                );
              });
          })
          .catch((err) => {});
      }
    };
    init();
  }, []);

  if (sessionLoading) {
    return <LoadingPage />;
  }

  if (!session) {
    return <Redirect href="/welcome" />;
  }

  if (user && !user.emailVerifiedAt) {
    return <VerifyEmail />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default AuthLayout;
