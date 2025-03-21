import React from "react";
import { Tabs } from "expo-router";
import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ItemProvider } from "@/contexts/ItemContext";
import { PrimaryButtonLG } from "@/components/PrimaryButton";

const CheckoutLayout = () => {
  const {
    bottom: paddingBottom,
    left: paddingLeft,
    right: paddingRight,
    top: paddingTop,
  } = useSafeAreaInsets();

  return (
    <ItemProvider>
      <View
        style={{
          paddingBottom,
          paddingLeft,
          paddingRight,
          paddingTop,
        }}
        className="flex-1 relative"
      >
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              position: "absolute",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              top: 10,
              left: "50%",
              transform: [{ translateX: -150 }],
              backgroundColor: "#00000011",
              elevation: 0,
              shadowOpacity: 0,
              borderTopWidth: 0,
              height: 42,
              width: 300,
              borderRadius: 6,
              paddingLeft: 2,
              paddingRight: 2,
            },
            tabBarShowLabel: false,
          }}
        >
          <Tabs.Screen
            name="favorites"
            options={{
              title: "Favorites",
              tabBarIcon: ({ color, focused, size }) => (
                <View
                  className={`${
                    focused ? "font-bold bg-gray-100" : "bg-transparent"
                  } 
                                h-[35] w-[95] rounded-md justify-center items-center`}
                >
                  <Text className="text-gray-500 text-sm font-bold">
                    Favorites
                  </Text>
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="index"
            options={{
              title: "Keypad",
              tabBarIcon: ({ color, focused, size }) => (
                <View
                  className={`${
                    focused ? "font-bold bg-gray-100" : "bg-transparent"
                  } 
                                h-[35] w-[95] rounded-md justify-center items-center`}
                >
                  <Text className="text-gray-500 text-sm font-bold">
                    Keypad
                  </Text>
                </View>
              ),
            }}
          />
          <Tabs.Screen
            name="library"
            options={{
              title: "Library",
              tabBarIcon: ({ color, focused, size }) => (
                <View
                  className={`${
                    focused ? "font-bold bg-gray-100" : "bg-transparent"
                  } 
                                h-[35] w-[95] rounded-md justify-center items-center`}
                >
                  <Text className="text-gray-500 text-sm font-bold">
                    Library
                  </Text>
                </View>
              ),
            }}
          />
        </Tabs>
        <View className="p-4">
          <PrimaryButtonLG className="h-12">Charge Rp0.00</PrimaryButtonLG>
        </View>
      </View>
    </ItemProvider>
  );
};

export default CheckoutLayout;
