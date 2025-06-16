import React from "react";

import { Stack } from "expo-router";
import { Redirect } from "expo-router";

import { useAppSelector } from "@/components/reduxHooks";

const NotificationLayout = () => {
  const storeId = useAppSelector(({ store }) => store.selectedStoreId);

  if (!storeId) {
    return <Redirect href={"/account"} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default NotificationLayout;
