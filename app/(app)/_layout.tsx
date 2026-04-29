import React from "react";
import * as SecureStore from "expo-secure-store";
import { PermissionsAndroid, Platform } from "react-native";

import {
  BLEPrinter,
  NetPrinter,
} from "react-native-thermal-receipt-printer-image-qr";
import { Redirect, Stack } from "expo-router";

import VerifyEmail from "@/components/VerifyEmail";
import LoadingPage from "@/components/LoadingPage";

import { useSession } from "@/contexts/SessionContext";
import { useAppDispatch } from "@/components/reduxHooks";
import {
  setPaperWidth,
  selectNetPrinter,
  setAutoPrintReceipt,
  setBase64ReceiptLogo,
  selectBluetoothPrinter,
} from "@/components/Store/storeSlice";
import { loadReceiptLogoBase64 } from "@/utils/pick-receipt-logo";

function AuthLayout() {
  const { session, user, sessionLoading } = useSession();

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const init = async () => {
      const base64ReceiptLogo = await loadReceiptLogoBase64();
      const isAutoPrintReceipt =
        await SecureStore.getItemAsync("isAutoPrintReceipt");
      const selectedBluetoothPrinterName = await SecureStore.getItemAsync(
        "selectedBluetoothPrinterName",
      );
      const selectedBluetoothPrinterInnerMacAddress =
        await SecureStore.getItemAsync(
          "selectedBluetoothPrinterInnerMacAddress",
        );
      const selectedNetPrinterHost = await SecureStore.getItemAsync(
        "selectedNetPrinterHost",
      );
      const selectedNetPrinterPort = await SecureStore.getItemAsync(
        "selectedNetPrinterPort",
      );
      const paperWidth = (await SecureStore.getItemAsync("paperWidth")) as
        | "58mm"
        | "80mm";

      dispatch(setBase64ReceiptLogo(base64ReceiptLogo));

      if (isAutoPrintReceipt !== null) {
        dispatch(setAutoPrintReceipt(isAutoPrintReceipt === "true"));
      }
      if (paperWidth) {
        dispatch(setPaperWidth(paperWidth));
      }
      if (
        selectedBluetoothPrinterName !== null &&
        selectedBluetoothPrinterInnerMacAddress !== null
      ) {
        const bluetoothScanPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        );
        const bluetoothConnectPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        );
        const accessFineLocationPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        );

        if (
          Platform.OS === "android" && Platform.Version >= 31
            ? bluetoothScanPermission &&
              bluetoothConnectPermission &&
              accessFineLocationPermission
            : accessFineLocationPermission
        ) {
          BLEPrinter.init()
            .then(() => {
              BLEPrinter.connectPrinter(selectedBluetoothPrinterInnerMacAddress)
                .then(
                  () => {
                    dispatch(
                      selectBluetoothPrinter({
                        device_name: selectedBluetoothPrinterName,
                        inner_mac_address:
                          selectedBluetoothPrinterInnerMacAddress,
                      }),
                    );
                  },
                  (err) => {
                    console.error(
                      `Error when trying to connect to the printer\n(${err})`,
                    );
                  },
                )
                .catch((err) => {
                  console.error(
                    `Error when trying to connect to the printer\n(${err})`,
                  );
                });
            })
            .catch((err) => {
              console.error(`Error when initializing BLEPrinter\n(${err})`);
            });
        } else {
          console.error("Bluetooth or Location permission is not granted.");
        }
      }
      if (selectedNetPrinterHost !== null && selectedNetPrinterPort !== null) {
        NetPrinter.init()
          .then(() => {
            NetPrinter.connectPrinter(
              selectedNetPrinterHost,
              Number(selectedNetPrinterPort),
            )
              .then(
                async () => {
                  dispatch(
                    selectNetPrinter({
                      host: selectedNetPrinterHost,
                      port: Number(selectedNetPrinterPort),
                    }),
                  );
                },
                (err) => {
                  console.error(
                    `Error when trying to connect to the NET printer\n(${err})`,
                  );
                },
              )
              .catch((err) => {
                console.error(
                  `Error when trying to connect to the NET printer\n(${err})`,
                );
              });
          })
          .catch((err) => {
            console.error(`Error when initializing NET printer\n(${err})`);
          });
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
