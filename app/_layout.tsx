import Toast from "react-native-toast-message";
import * as SplashScreen from "expo-splash-screen";

import { useEffect } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { Provider } from "react-redux";
import { StatusBar } from "expo-status-bar";
import { useColorScheme, View } from "react-native";

import { Colors } from "@/constants/Colors";
import { reduxStore } from "@/components/reduxStore";
import { ThemeProvider } from "@/contexts/ThemeProvider";
import { SessionProvider } from "@/contexts/SessionContext";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const colorScheme = useColorScheme() ?? "light";

  const {
    bottom: paddingBottom,
    left: paddingLeft,
    right: paddingRight,
    top: paddingTop,
  } = useSafeAreaInsets();

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={reduxStore}>
      <ThemeProvider value={{ colorScheme }}>
        <SessionProvider>
          <Stack screenOptions={{ headerShown: false }} />
          <StatusBar
            backgroundColor={
              colorScheme === "dark"
                ? Colors.dark.primaryBackground
                : Colors.light.primaryBackground
            }
          />
          <Toast />
        </SessionProvider>
      </ThemeProvider>
    </Provider>
  );
}
