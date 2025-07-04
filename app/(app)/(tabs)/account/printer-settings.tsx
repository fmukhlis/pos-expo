import React from "react";
import * as SecureStore from "expo-secure-store";

import { Stack } from "expo-router";
import {
  BLEPrinter,
  NetPrinter,
} from "react-native-thermal-receipt-printer-image-qr";
import {
  View,
  Text,
  Switch,
  Platform,
  ScrollView,
  TouchableOpacity,
  PermissionsAndroid,
} from "react-native";

import PrimaryInput from "@/components/PrimaryInput";
import CustomRadioGroup from "@/components/CustomRadioGroup";
import LoadingComponent from "@/components/LoadingComponent";

import { Icon } from "@/components/Icon";
import { MaterialIcons } from "@expo/vector-icons";
import { PrimaryButtonSM } from "@/components/PrimaryButton";
import { useAppDispatch, useAppSelector } from "@/components/reduxHooks";
import {
  selectNetPrinter,
  setAutoPrintReceipt,
  setBase64ReceiptLogo,
  selectBluetoothPrinter,
} from "@/components/Store/storeSlice";

const PrinterSettings = () => {
  const selectedBluetoothPrinter = useAppSelector(
    ({ store }) => store.selectedBluetoothPrinter
  );
  const selectedNetPrinter = useAppSelector(
    ({ store }) => store.selectedNetPrinter
  );
  const isAutoPrintReceipt = useAppSelector(
    ({ store }) => store.isAutoPrintReceipt
  );
  const base64ReceiptLogo = useAppSelector(
    ({ store }) => store.base64ReceiptLogo
  );

  const dispatch = useAppDispatch();

  const [options, setOptions] = React.useState<
    { label: string; value: string }[]
  >([]);

  const [isLoading, setIsLoading] = React.useState(false);
  const [isBLEConnecting, setIsBLEConnecting] = React.useState(false);
  const [isNETConnecting, setIsNETConnecting] = React.useState(false);

  const [netPrinter, setNetPrinter] = React.useState({
    host: selectedNetPrinter?.host ?? "",
    port: `${selectedNetPrinter?.port ?? ""}`,
  });

  const [bleError, setBLEError] = React.useState("");
  const [netError, setNetError] = React.useState("");

  const handleBluetoothPrinterChange = async ({
    label,
    value,
  }: {
    label: string;
    value: string;
  }) => {
    if (label && value) {
      setIsBLEConnecting(true);
      BLEPrinter.connectPrinter(value)
        .then(
          async () => {
            dispatch(
              selectBluetoothPrinter({
                device_name: label,
                inner_mac_address: value,
              })
            );
            await SecureStore.setItemAsync(
              "selectedBluetoothPrinterName",
              label
            );
            await SecureStore.setItemAsync(
              "selectedBluetoothPrinterInnerMacAddress",
              value
            );
          },
          (err) => {
            setBLEError(
              `Error when trying to connect to the BLE printer\n(${err})`
            );
          }
        )
        .catch((err) => {
          setBLEError(
            `Error when trying to connect to the BLE printer\n(${err})`
          );
        })
        .finally(() => {
          setIsBLEConnecting(false);
        });
    }
  };

  const handleNetPrinterChange = () => {
    if (netPrinter.host && netPrinter.port) {
      setIsNETConnecting(true);
      NetPrinter.connectPrinter(netPrinter.host, Number(netPrinter.port))
        .then(
          async () => {
            dispatch(
              selectNetPrinter({
                host: netPrinter.host,
                port: Number(netPrinter.port),
              })
            );
            await SecureStore.setItemAsync(
              "selectedNetPrinterHOST",
              netPrinter.host
            );
            await SecureStore.setItemAsync(
              "selectedNetPrinterPort",
              netPrinter.port
            );
          },
          (err) => {
            setNetError(
              `Error when trying to connect to the NET printer\n(${err})`
            );
          }
        )
        .catch((err) => {
          setNetError(
            `Error when trying to connect to the NET printer\n(${err})`
          );
        })
        .finally(() => {
          setIsNETConnecting(false);
        });
    }
  };

  const handleDisableBluetoothPrinter = () => {
    BLEPrinter.closeConn()
      .then(async () => {
        dispatch(selectBluetoothPrinter(null));
        await SecureStore.deleteItemAsync("selectedBluetoothPrinterName");
        await SecureStore.deleteItemAsync(
          "selectedBluetoothPrinterInnerMacAddress"
        );
      })
      .catch((err) => {
        setBLEError(`Error when closing bluetooth connection\n(${err})`);
      });
  };

  const handleDisableNetPrinter = () => {
    NetPrinter.closeConn()
      .then(async () => {
        dispatch(selectNetPrinter(null));
        await SecureStore.deleteItemAsync("selectedNetPrinterHost");
        await SecureStore.deleteItemAsync("selectedNetPrinterPort");
      })
      .catch((err) => {
        setNetError(`Error when closing network connection\n(${err})`);
      });
  };

  React.useEffect(() => {
    const init = async () => {
      const bluetoothScanPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN
      );
      const bluetoothConnectPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
      );
      const accessFineLocationPermission = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
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
            setIsLoading(true);
            BLEPrinter.getDeviceList()
              .then((deviceList) => {
                setOptions(
                  deviceList.map(({ device_name, inner_mac_address }) => ({
                    label: device_name,
                    value: inner_mac_address,
                  }))
                );
                if (selectedBluetoothPrinter?.inner_mac_address) {
                  setIsBLEConnecting(true);
                  BLEPrinter.connectPrinter(
                    selectedBluetoothPrinter.inner_mac_address
                  )
                    .then(
                      () => {},
                      (err) => {
                        setBLEError(
                          `Error when trying to connect to the printer\n(${err})`
                        );
                      }
                    )
                    .catch((err) => {
                      setBLEError(
                        `Error when trying to connect to the printer\n(${err})`
                      );
                    })
                    .finally(() => {
                      setIsBLEConnecting(false);
                    });
                }
              })
              .catch((err) => {
                setBLEError(`Error when trying to get device list\n(${err})`);
              })
              .finally(() => {
                setIsLoading(false);
              });
          })
          .catch((err) => {
            setBLEError(`Error when initializing BLEPrinter\n(${err})`);
          });
      } else {
        setBLEError(`Bluetooth or Location permission is not granted.`);
      }

      if (selectedNetPrinter?.host && selectedNetPrinter?.port) {
        setIsNETConnecting(true);
        NetPrinter.connectPrinter(netPrinter.host, Number(netPrinter.port))
          .then(
            async () => {
              dispatch(
                selectNetPrinter({
                  host: netPrinter.host,
                  port: Number(netPrinter.port),
                })
              );
              await SecureStore.setItemAsync(
                "selectedNetPrinterHOST",
                netPrinter.host
              );
              await SecureStore.setItemAsync(
                "selectedNetPrinterPort",
                netPrinter.port
              );
            },
            (err) => {
              setNetError(
                `Error when trying to connect to the NET printer\n(${err})`
              );
            }
          )
          .catch((err) => {
            setNetError(
              `Error when trying to connect to the NET printer\n(${err})`
            );
          })
          .finally(() => {
            setIsNETConnecting(false);
          });
      }
    };
    init();
  }, []);

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="">
        <View className="bg-white">
          <Stack.Screen
            options={{
              headerShown: true,
              headerTitle: () => (
                <View className="flex-1 pt-2 pb-4 flex-row items-center space-x-3">
                  <Icon name="print-outline" />
                  <Text className="text-xl font-semibold">
                    Printer Settings
                  </Text>
                </View>
              ),
              headerBackVisible: false,
            }}
          />

          <View className="mt-5 mb-2 mx-5">
            <Text className="text-lg  font-bold text-gray-700">
              Select bluetooth printer
            </Text>
            <Text className="text-sm mt-2 text-orange-600/70">
              Please make sure to select a real{" "}
              <Text className="font-bold">printer</Text> device and ensure it is
              <Text className="font-bold"> idle</Text> before printing to
              prevent the app from crashing.
            </Text>
          </View>
          {bleError ? (
            <View className="mx-5 px-4 py-2 bg-red-100 border border-red-500 rounded">
              <Text className="text-red-500">{bleError}</Text>
            </View>
          ) : isLoading ? (
            <View className="h-[50]">
              <LoadingComponent />
            </View>
          ) : (
            <>
              <View className="flex-row mx-5 items-center">
                <Text className="font-bold text-base text-gray-400">
                  Disable Bluetooth Printer ?
                </Text>
                <TouchableOpacity
                  disabled={!selectedBluetoothPrinter}
                  onPress={handleDisableBluetoothPrinter}
                  className="ml-auto border p-1.5 border-gray-300 bg-gray-100 rounded"
                >
                  <MaterialIcons
                    name="print-disabled"
                    size={20}
                    color={"#9ca3af"}
                  />
                </TouchableOpacity>
              </View>
              <CustomRadioGroup
                className="mx-5 mt-2"
                options={options}
                renderItem={(label, isSelected) => {
                  return (
                    <>
                      <View className="border rounded-full border-gray-300 w-[25] h-[25]">
                        {isSelected && (
                          <View className="rounded-full bg-blue-500 w-[18] h-[18] m-auto border border-blue-400" />
                        )}
                      </View>
                      <Text className="ml-2 text-base">{label}</Text>
                      {isSelected &&
                        (isBLEConnecting ? (
                          <LoadingComponent
                            size={"small"}
                            className="ml-auto flex-none"
                          />
                        ) : (
                          <Icon
                            name="checkmark-done"
                            size={20}
                            className="ml-auto text-green-500"
                          />
                        ))}
                    </>
                  );
                }}
                value={selectedBluetoothPrinter?.inner_mac_address}
                onValueChange={handleBluetoothPrinterChange}
              />
            </>
          )}

          <View className="mx-5 mt-3 mb-3">
            <Text className="text-lg  font-bold text-gray-700">
              Select network printer
            </Text>
            <Text className="text-sm mt-2 mb-2 text-orange-600/70">
              You can perform a <Text className="font-bold">Self Test</Text> on
              the printer to check its IP address. This feature has not been
              tested yet, so make sure the printer is{" "}
              <Text className="font-bold">idle</Text> before printing and{" "}
              <Text className="font-bold">the cable</Text> is properly connected
              to avoid any issues.
            </Text>
            <View className="flex-row items-center">
              <Text className="font-bold text-base text-gray-400">
                Disable Network Printer ?
              </Text>
              <TouchableOpacity
                onPress={handleDisableNetPrinter}
                className="ml-auto border p-1.5 border-gray-300 bg-gray-100 rounded"
              >
                <MaterialIcons
                  name="print-disabled"
                  size={20}
                  color={"#9ca3af"}
                />
              </TouchableOpacity>
            </View>
            {netError ? (
              <View className="mt-2 px-4 py-2 bg-red-100 border border-red-500 rounded">
                <Text className="text-red-500">{netError}</Text>
              </View>
            ) : isNETConnecting ? (
              <View className="justify-center items-center h-[35] mt-2">
                <LoadingComponent size={"small"} />
              </View>
            ) : selectedNetPrinter ? (
              <View className="border border-gray-300 px-3 py-1.5 rounded mt-2">
                <View className="flex-row justify-between items-center">
                  <Text className="font-medium text-base">Net Printer 1</Text>
                </View>
                <View className="flex-row justify-between mt-1">
                  <Text className="text-gray-500 text-medium">
                    IP: {selectedNetPrinter.host}
                  </Text>
                  <Text className="text-gray-500 text-medium">
                    PORT: {selectedNetPrinter.port}
                  </Text>
                </View>
              </View>
            ) : (
              <>
                <PrimaryInput
                  value={netPrinter.host}
                  onChangeText={(host) => {
                    setNetPrinter((prev) => ({ ...prev, host }));
                  }}
                  placeholder="Enter IP address..."
                  className="text-sm h-[40]"
                  containerClassName="mt-2"
                />
                <PrimaryInput
                  keyboardType="numeric"
                  value={netPrinter.port}
                  onChangeText={(text) => {
                    const port = text.replace(/[^\d]/g, "");
                    setNetPrinter((prev) => ({ ...prev, port }));
                  }}
                  maxLength={5}
                  placeholder="Enter port number..."
                  className="text-sm h-[40]"
                  containerClassName="mt-2"
                />
                <PrimaryButtonSM
                  onPress={handleNetPrinterChange}
                  className="mt-3 h-[45]"
                >
                  Connect Net Printer
                </PrimaryButtonSM>
              </>
            )}
          </View>

          <View className="flex-row justify-between items-center border-y border-gray-300 py-3 px-5 my-5">
            <View className="w-9/12">
              <Text className="font-medium text-base mb-0.5">
                Print Receipt Automatically
              </Text>
            </View>
            <Switch
              value={isAutoPrintReceipt}
              onValueChange={async (value) => {
                dispatch(setAutoPrintReceipt(value));
                await SecureStore.setItemAsync(
                  "isAutoPrintReceipt",
                  `${value}`
                );
              }}
            />
          </View>

          {/* <View className="px-5 mt-3 border-b pb-4 border-gray-300">
          <Text className="font-medium text-base">Receipt Logo</Text>
          <View className="flex-row mt-3">
            <PrimaryInput
              containerClassName="flex-1 mr-3"
              className="text-sm h-[40]"
              placeholder="Base64 image..."
              numberOfLines={1}
              value={base64ReceiptLogo}
              onChangeText={(text) => {
                dispatch(setBase64ReceiptLogo(text));
              }}
            />
            <SecondaryButtonSM
              onPress={async () => {
                dispatch(setBase64ReceiptLogo(""));
                await SecureStore.deleteItemAsync("base64ReceiptLogo");
              }}
              className="mr-0.5"
            >
              Clear
            </SecondaryButtonSM>
            <PrimaryButtonSM
              onPress={async () => {
                if (base64ReceiptLogo) {
                  await SecureStore.setItemAsync(
                    "base64ReceiptLogo",
                    base64ReceiptLogo
                  );
                }
              }}
            >
              Save
            </PrimaryButtonSM>
          </View>
          <Text className="text-orange-600/70 text-sm mt-2">
            Please provide a valid{" "}
            <Text className="font-bold">Base64 image string</Text>. Providing an
            invalid value may cause the app to crash when printing.
          </Text>
          <Text className="text-orange-600/70 text-sm ">
            If you're already provided an invalid value, tap the{" "}
            <Text className="font-bold">Clear</Text> button to reset it.
          </Text>
        </View> */}
          {/* 
          <View className="h-[100] my-auto justify-center px-5">
            <Text className="text-base text-center text-gray-500">
              Set up printer with printer profile to print receipts, order
              tickets, and more. (Coming soon)
            </Text>
          </View> */}
          {/* <FlatList
        ListHeaderComponent={
          //   <View className="mt-4 mx-4">
          //     <Text className="text-base text-gray-700">
          //       Set up printer with printer profile to print receipts, order
          //       tickets, and more. (Coming soon)
          //     </Text>
          //   </View>

          <View className="mt-5 mb-2 mx-5">
            <Text className="text-lg  font-bold text-gray-700">
              Select printer
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View className="mx-5">
            <Text className="text-base text-gray-500">
              No printers connected
            </Text>
          </View>
        }
        data={[]}
        renderItem={() => {
          return <Text>Hello</Text>;
        }}
      />
      <PrimaryTouchable className="mx-auto w-[200] h-[45] mb-5">
        <Text className="text-white font-bold text-base">Connect printer</Text>
      </PrimaryTouchable> */}
        </View>
      </ScrollView>
    </View>
  );
};

export default PrinterSettings;
