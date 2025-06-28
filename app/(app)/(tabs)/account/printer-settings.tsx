import React from "react";

import { Stack } from "expo-router";
import { BLEPrinter } from "react-native-thermal-receipt-printer-image-qr";
import { View, Text, Switch, PermissionsAndroid } from "react-native";

import CustomRadioGroup from "@/components/CustomRadioGroup";
import LoadingComponent from "@/components/LoadingComponent";

import { Icon } from "@/components/Icon";
import { useAppDispatch, useAppSelector } from "@/components/reduxHooks";
import {
  selectBluetoothPrinter,
  setAutoPrintReceipt,
} from "@/components/Store/storeSlice";

const PrinterSettings = () => {
  const selectedBluetoothPrinter = useAppSelector(
    ({ store }) => store.selectedBluetoothPrinter
  );
  const isAutoPrintReceipt = useAppSelector(
    ({ store }) => store.isAutoPrintReceipt
  );

  const dispatch = useAppDispatch();

  const [options, setOptions] = React.useState<
    { label: string; value: string }[]
  >([]);

  const [isConnecting, setIsConnecting] = React.useState(false);

  const [error, setError] = React.useState("");

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
        bluetoothScanPermission &&
        bluetoothConnectPermission &&
        accessFineLocationPermission
      ) {
        BLEPrinter.init()
          .then(() => {
            BLEPrinter.getDeviceList()
              .then((deviceList) => {
                setOptions(
                  deviceList.map(({ device_name, inner_mac_address }) => ({
                    label: device_name,
                    value: inner_mac_address,
                  }))
                );
              })
              .catch((err) => {
                setError(`Error when trying to get device list\n(${err})`);
              });
          })
          .catch((err) => {
            setError(`Error when initializing BLEPrinter\n(${err})`);
          });
      } else {
        setError(`Bluetooth or Location permission is not granted.`);
      }
    };
    init();
  }, []);

  React.useEffect(() => {
    if (selectedBluetoothPrinter) {
      setIsConnecting(true);
      const timer = setTimeout(() => {
        BLEPrinter.connectPrinter(selectedBluetoothPrinter.inner_mac_address)
          .then(
            () => {},
            (err) => {
              setError(`Error when trying to connect to the printer\n(${err})`);
            }
          )
          .catch((err) => {
            setError(`Error when trying to connect to the printer\n(${err})`);
          })
          .finally(() => {
            setIsConnecting(false);
          });
      }, 100);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [selectedBluetoothPrinter?.inner_mac_address]);

  return (
    <View className="flex-1 bg-white">
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: () => (
            <View className="flex-1 pt-2 pb-4 flex-row items-center space-x-3">
              <Icon name="print-outline" />
              <Text className="text-xl font-semibold">Printer Settings</Text>
            </View>
          ),
          headerBackVisible: false,
        }}
      />

      <View className="mt-5 mb-2 mx-5">
        <Text className="text-lg  font-bold text-gray-700">Select printer</Text>
        <Text className="text-base text-gray-700">
          Currently, it only supports Bluetooth devices.
        </Text>
        <Text className="text-sm mt-2 text-red-500/70">
          Please make sure to select a real "printer" device and ensure it is
          idle before printing to prevent the app from crashing.
        </Text>
      </View>
      {error ? (
        <Text className="mx-5 my-2 text-red-500">{error}</Text>
      ) : (
        <CustomRadioGroup
          className="mx-5 my-2"
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
                  (isConnecting ? (
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
          onValueChange={({ label, value }) => {
            dispatch(
              selectBluetoothPrinter({
                device_name: label,
                inner_mac_address: value,
              })
            );
          }}
        />
      )}

      <View className="flex-row justify-between items-center border-y border-gray-300 py-3 px-5 mt-2">
        <View className="w-9/12">
          <Text className="font-medium text-base mb-0.5">
            Print Receipt Automatically
          </Text>
        </View>
        <Switch
          value={isAutoPrintReceipt}
          onValueChange={(value) => {
            dispatch(setAutoPrintReceipt(value));
          }}
        />
      </View>

      <View className="p-5 my-auto">
        <Text className="text-base text-center text-gray-700">
          Set up printer with printer profile to print receipts, order tickets,
          and more. (Coming soon)
        </Text>
      </View>
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
  );
};

export default PrinterSettings;
