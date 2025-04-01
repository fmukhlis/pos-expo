import React from "react";

import { Tabs } from "expo-router";
import { View, Text } from "react-native";

import ReviewSaleModal from "@/components/Order/Checkout/ReviewSaleModal";

import { ItemProvider } from "@/contexts/ItemContext";
import { useAppSelector } from "@/components/reduxHooks";
import { PrimaryTouchableLG } from "@/components/PrimaryTouchable";

const CheckoutLayout = () => {
  const items = useAppSelector(({ order }) => order.items);

  const [saleModalVisible, setSaleModalVisible] = React.useState(false);

  const hideSaleModal = () => {
    setSaleModalVisible(false);
  };

  const showSaleModal = () => {
    setSaleModalVisible(true);
  };

  return (
    <ItemProvider>
      <View className="flex-1 relative">
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
              backgroundColor: "#f3f4f6",
              elevation: 0,
              shadowOpacity: 0,
              height: 53,
              width: 300,
              borderRadius: 6,
              paddingLeft: 2,
              paddingRight: 2,
              borderWidth: 2,
              borderTopWidth: 2,
              borderColor: "rgba(209, 213, 219, 0.4)",
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
                    focused ? "border bg-gray-200" : "bg-transparent"
                  } border-t-gray-200 border-r-gray-200 border-b-gray-300 border-l-gray-300  h-[40] w-[95] rounded justify-center items-center`}
                >
                  <Text
                    className={`${
                      focused ? "font-bold" : ""
                    } text-gray-500 text-base`}
                  >
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
                    focused ? "border bg-gray-200" : "bg-transparent"
                  }  border-t-gray-200 border-r-gray-200 border-b-gray-300 border-l-gray-300 h-[40] w-[95] rounded justify-center items-center`}
                >
                  <Text
                    className={`${
                      focused ? "font-bold" : ""
                    } text-gray-500 text-base`}
                  >
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
                    focused ? "border bg-gray-200" : "bg-transparent"
                  } border-t-gray-200 border-r-gray-200 border-b-gray-300 border-l-gray-300  h-[40] w-[95] rounded-md justify-center items-center`}
                >
                  <Text
                    className={`${
                      focused ? "font-bold" : ""
                    } text-gray-500 text-base`}
                  >
                    Library
                  </Text>
                </View>
              ),
            }}
          />
        </Tabs>
        <View className="p-3 bg-white border-t-2 border-gray-300/80">
          <ReviewSaleModal
            visible={saleModalVisible}
            onRequestClose={hideSaleModal}
          />
          <PrimaryTouchableLG onPress={showSaleModal} className="h-[55]">
            <Text className="text-[17px] font-bold text-white">
              Review sale
            </Text>
            <Text className="text-sm text-white">
              {items.length > 1
                ? `${items.length} items`
                : `${items.length} item`}
            </Text>
          </PrimaryTouchableLG>
        </View>
      </View>
    </ItemProvider>
  );
};

export default CheckoutLayout;
