import React from "react";

import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, Image, PermissionsAndroid, Platform } from "react-native";

import CustomButton from "@/components/CustomButton";

import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeProvider";

const Welcome = () => {
  const { colorScheme } = useTheme();

  React.useEffect(() => {
    requestBluetoothPermissions();
  }, []);

  return (
    <SafeAreaView
      className={`${
        colorScheme === "dark"
          ? "bg-dark-primaryBackground"
          : "bg-light-primaryBackground"
      } justify-center items-center flex-1 px-4`}
    >
      <Image
        tintColor={
          colorScheme === "dark" ? Colors.dark.accent : Colors.light.accent
        }
        source={require("@/assets/images/logo.png")}
        className="w-[200px] h-[60px]"
        resizeMode="contain"
      />
      <Text
        className={`${
          colorScheme === "dark"
            ? "text-dark-primaryText"
            : "text-light-primaryText"
        } text-2xl font-bold text-center mt-7`}
      >
        Effortless Sales, Simplified
      </Text>

      <Text
        className={`${
          colorScheme === "dark"
            ? "text-dark-secondaryText"
            : "text-light-secondaryText"
        } text-center mt-3`}
      >
        Manage transactions, track inventory, and generate detailed reports with
        ease
      </Text>
      <Link href={"/sign-in"} asChild>
        <CustomButton className={`w-full mt-7 h-12`}>
          <Text
            className={`text-light-primaryBackground dark:text-dark-primaryBackground font-bold text-lg`}
          >
            Get Started
          </Text>
        </CustomButton>
      </Link>
    </SafeAreaView>
  );
};

export default Welcome;

export async function requestBluetoothPermissions() {
  if (Platform.OS === "android" && Platform.Version >= 31) {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);

      const allGranted = Object.values(granted).every(
        (result) => result === PermissionsAndroid.RESULTS.GRANTED
      );

      if (!allGranted) {
        console.warn("Bluetooth permissions not granted");
      }
    } catch (err) {
      console.error("Failed to request permissions", err);
    }
  }
}
