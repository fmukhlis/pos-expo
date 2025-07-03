import React from "react";

import { skipToken } from "@reduxjs/toolkit/query";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";

import StoreModal from "@/components/StoreManagement/StoreModal";
import CustomActivityIndicator from "@/components/CustomActivityIndicator";

import { Icon } from "@/components/Icon";
import { apiSlice } from "@/components/apiSlice";
import { useSession } from "@/contexts/SessionContext";
import { DangerButtonLG } from "@/components/DangerButton";
import { useGetStoresQuery } from "@/components/services/store";
import { useAppDispatch, useAppSelector } from "@/components/reduxHooks";
import { Feather } from "@expo/vector-icons";

export default function HomeScreen() {
  const { user, session, signOut, signOutLoading } = useSession();

  const storeId = useAppSelector(({ store }) => store.selectedStoreId);

  const dispatch = useAppDispatch();

  const {
    data: stores,
    isFetching,
    refetch,
  } = useGetStoresQuery(user?.id ? { userId: user.id } : skipToken);

  const [modalVisible, setModalVisible] = React.useState(false);

  const handleLogOut = () => {
    signOut(session ?? "").then((isLogoutSuccess) => {
      if (isLogoutSuccess) {
        router.replace("/");
        dispatch({ type: "user/logout" });
      }
    });
  };

  const showModal = (id: number | null) => {
    dispatch({
      type: "store/setSelectedStoreId",
      id,
    });
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  React.useEffect(() => {
    dispatch({
      type: "store/setSelectedStoreId",
      id: stores && stores.length > 0 ? stores[0].id : null,
    });
  }, [stores]);

  if (user?.role === "Free") {
    return <Redirect href={"/account"} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StoreModal visible={modalVisible} onClose={hideModal} />
      <ScrollView className="px-5 py-2">
        <View className="">
          <Text className="text-3xl font-black">Welcome Back</Text>
          <Text className="mt-2 text-base">{user?.fullName}!</Text>
        </View>
        <View className="mt-4 bg-gray-200/75 rounded p-1">
          <View className="mb-1 px-2 h-[40] rounded bg-gray-50 flex-row items-center">
            <Text className="text-gray-500 text-base font-semibold mr-auto">
              Store
            </Text>
            {storeId && (
              <TouchableOpacity
                className="mr-3 pr-3 border-r border-gray-300"
                onPress={() => {
                  showModal(storeId);
                }}
              >
                <View className="bg-gray-600 p-1 rounded-full">
                  <Feather name="edit-2" size={11} color="white" />
                </View>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              className="mr-1.5"
              onPress={() => {
                showModal(null);
              }}
            >
              <Icon name="add-circle" size={25} className="text-gray-600" />
            </TouchableOpacity>
            <TouchableOpacity onPress={refetch}>
              <Icon name="reload-circle" size={25} className="text-gray-600" />
            </TouchableOpacity>
          </View>
          {isFetching ? (
            <View className="h-[41] justify-center items-center">
              <CustomActivityIndicator size={"small"} />
            </View>
          ) : (
            <ScrollView className="max-h-[135] space-y-1">
              {stores && stores.length > 0 ? (
                stores.map((store) => (
                  <View
                    key={store.id}
                    className="flex-row space-x-2 items-center rounded border border-transparent p-1"
                  >
                    <Icon name="storefront-outline" className="text-gray-400" />
                    <View className="flex-1 flex-row items-center justify-between">
                      <Text className="text-gray-400">{store.name}</Text>
                      <TouchableOpacity
                        className="w-[55] h-[30] justify-center items-center"
                        disabled={store.id === storeId}
                        activeOpacity={0.5}
                        onPress={() => {
                          dispatch({
                            type: "store/setSelectedStoreId",
                            id: store.id,
                          });
                        }}
                      >
                        {store.id === storeId ? (
                          <Icon
                            size={25}
                            name="checkmark-outline"
                            className="text-emerald-500"
                          />
                        ) : (
                          <Text className="text-sky-500">[ Select ]</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                ))
              ) : (
                <View className="items-center justify-center rounded border border-transparent p-1">
                  <Text className="text-gray-400 mb-0.5">
                    You don't have any store.
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      showModal(null);
                    }}
                  >
                    <Text className="text-sky-500 font-bold">
                      Create a new one
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </ScrollView>
          )}
        </View>
        <View className="mt-4 border-t border-gray-300">
          <TouchableHighlight
            disabled={!storeId}
            className={`p-3 ${!storeId ? "opacity-40" : ""}`}
            onPress={() => {
              router.navigate("/account/payment-and-security");
            }}
            underlayColor={"#e5e7eb"}
          >
            <View className="flex-row space-x-2 items-center">
              <Icon name="key-outline" />
              <Text className="font-bold text-lg">Payment & Security</Text>
            </View>
          </TouchableHighlight>
        </View>
        <View className="border-t border-gray-300">
          <TouchableHighlight
            disabled={!storeId}
            className={`p-3 ${!storeId ? "opacity-40" : ""}`}
            onPress={() => {
              router.navigate("/account/store-management");
            }}
            underlayColor={"#e5e7eb"}
          >
            <View className="flex-row space-x-2 items-center">
              <Icon name="documents-outline" />
              <Text className="font-bold text-lg">Store Management</Text>
            </View>
          </TouchableHighlight>
        </View>
        <View className="border-t border-gray-300">
          <TouchableHighlight
            disabled={!storeId}
            className={`p-3 ${!storeId ? "opacity-40" : ""}`}
            onPress={() => {
              router.navigate("/account/printer-settings");
            }}
            underlayColor={"#e5e7eb"}
          >
            <View className="flex-row space-x-2 items-center">
              <Icon name="print-outline" />
              <Text className="font-bold text-lg">Printer Settings</Text>
            </View>
          </TouchableHighlight>
        </View>
        <View className="border-t border-gray-300">
          <TouchableHighlight
            disabled
            className={`p-3 opacity-40`}
            onPress={() => {}}
            underlayColor={"#e5e7eb"}
          >
            <View className="flex-row space-x-2 items-center">
              <Icon name="stats-chart-outline" />
              <Text className="font-bold text-lg">Reports</Text>
            </View>
          </TouchableHighlight>
        </View>
        <View className="border-t border-gray-300">
          <TouchableHighlight
            disabled
            className={`p-3 opacity-40`}
            onPress={() => {}}
            underlayColor={"#e5e7eb"}
          >
            <View className="flex-row space-x-2 items-center">
              <Icon name="settings-outline" />
              <Text className="font-bold text-lg">Account Settings</Text>
            </View>
          </TouchableHighlight>
        </View>
        <View className="flex-1 border-t pt-3 border-gray-300">
          <DangerButtonLG
            isProcessing={signOutLoading}
            onPress={handleLogOut}
            className="h-[50]"
          >
            Log out
          </DangerButtonLG>
        </View>
        <View className="flex-1 items-center justify-center h-[100]">
          <Text className="font-bold text-base mb-1 text-gray-500">Moncip</Text>
          <Text className="text-gray-400 mb-3">Version 1.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
