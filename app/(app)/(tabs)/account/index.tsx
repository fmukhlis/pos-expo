import React from "react";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TouchableHighlight,
} from "react-native";
import { skipToken } from "@reduxjs/toolkit/query";
import { SafeAreaView } from "react-native-safe-area-context";
import { Redirect, router } from "expo-router";

import CustomActivityIndicator from "@/components/CustomActivityIndicator";

import { Icon } from "@/components/Icon";
import { apiSlice } from "@/components/apiSlice";
import { useSession } from "@/contexts/SessionContext";
import { DangerButtonLG } from "@/components/DangerButton";
import { useGetStoresQuery } from "@/components/services/store";
import { setSelectedStoreId } from "@/components/Store/storeSlice";
import { useAppDispatch, useAppSelector } from "@/components/reduxHooks";

export default function HomeScreen() {
  const { user, session, signOut, signOutLoading } = useSession();

  if (user?.role === "Premium") {
    return <Redirect href={"/account/store-owner"} />;
  }

  const storeId = useAppSelector(({ store }) => store.selectedStoreId);
  const dispatch = useAppDispatch();

  const {
    data: stores,
    isFetching,
    refetch,
  } = useGetStoresQuery(user?.id ? { userId: user.id } : skipToken);

  const handleLogOut = () => {
    signOut(session ?? "").then((isLogoutSuccess) => {
      if (isLogoutSuccess) {
        router.replace("/");
        dispatch({ type: "user/logout" });
        dispatch(apiSlice.util.resetApiState());
      }
    });
  };

  React.useEffect(() => {
    dispatch(
      setSelectedStoreId(stores && stores.length > 0 ? stores[0].id : null)
    );
  }, [stores]);

  return (
    <SafeAreaView className="flex-1 bg-white  px-5 py-2">
      <View className="border-red-300">
        <Text className="text-3xl font-black">Welcome Back</Text>
        <Text className="mt-2 text-base">{user?.fullName} !</Text>
      </View>
      <View className="mt-4 bg-gray-200/75 rounded p-1">
        <View className="mb-1 px-2 h-[40] rounded bg-gray-50 flex-row items-center justify-between">
          <Text className="text-gray-500 text-base font-semibold">Store</Text>
          <TouchableOpacity onPress={refetch}>
            <Icon name="reload-circle" size={25} />
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
                        dispatch(setSelectedStoreId(store.id));
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
                  You don't join any store yet.
                </Text>
              </View>
            )}
          </ScrollView>
        )}
      </View>
      <View className="mt-4 border-t border-gray-300">
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
      <View className="flex-1 border-t py-3 border-gray-300">
        <DangerButtonLG
          isProcessing={signOutLoading}
          onPress={handleLogOut}
          className="h-[45]"
        >
          Log out
        </DangerButtonLG>
        <View className="flex-1 items-center justify-center">
          <Text className="font-bold text-base mb-1 text-gray-500">Moncip</Text>
          <Text className="text-gray-400">Version 1.0</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
