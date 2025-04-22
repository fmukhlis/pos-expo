import { Tabs } from "expo-router";
import { Text } from "react-native";

import { TabBarIcon } from "@/components/navigation/TabBarIcon";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          height: 60,
          paddingBottom: 5,
        },
      }}
    >
      <Tabs.Screen
        name="checkout"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              className={`${
                focused
                  ? "font-bold text-light-tabIconSelected"
                  : "text-light-tabIconDefault"
              } text-xs`}
            >
              Checkout
            </Text>
          ),
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon
              name={focused ? "apps" : "apps-outline"}
              className={`${
                focused
                  ? "text-light-tabIconSelected"
                  : " text-light-tabIconDefault"
              }`}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              className={`${
                focused
                  ? "font-bold text-light-tabIconSelected"
                  : "text-light-tabIconDefault"
              } text-xs`}
            >
              Account
            </Text>
          ),
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon
              name={focused ? "notifications-sharp" : "notifications-outline"}
              className={`${
                focused
                  ? "text-light-tabIconSelected"
                  : " text-light-tabIconDefault"
              }`}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              className={`${
                focused
                  ? "font-bold text-light-tabIconSelected"
                  : "text-light-tabIconDefault"
              } text-xs`}
            >
              Account
            </Text>
          ),
          tabBarIcon: ({ focused, size }) => (
            <TabBarIcon
              name={focused ? "person-sharp" : "person-outline"}
              className={`${
                focused
                  ? "text-light-tabIconSelected"
                  : " text-light-tabIconDefault"
              }`}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
