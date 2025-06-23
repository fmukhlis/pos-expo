import { Tabs } from "expo-router";
import { Text } from "react-native";

import { regenerateRefreshKey } from "@/components/Order/orderSlice";
import { useAppDispatch, useAppSelector } from "@/components/reduxHooks";
import { Icon } from "@/components/Icon";

export default function TabLayout() {
  const storeId = useAppSelector(({ store }) => store.selectedStoreId);
  const dispatch = useAppDispatch();

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
            <Icon
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
        name="transaction"
        listeners={{
          blur: () => {
            if (storeId) {
              dispatch(regenerateRefreshKey());
            }
          },
        }}
        options={{
          tabBarLabel: ({ focused }) => (
            <Text
              className={`${
                focused
                  ? "font-bold text-light-tabIconSelected"
                  : "text-light-tabIconDefault"
              } text-xs`}
            >
              Transaction
            </Text>
          ),
          tabBarIcon: ({ focused, size }) => (
            <Icon
              name="swap-horizontal"
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
            <Icon
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
            <Icon
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
