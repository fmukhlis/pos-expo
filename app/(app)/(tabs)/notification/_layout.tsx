import React from "react";

import { Stack } from "expo-router";
import { useAppSelector } from "@/components/reduxHooks";
import { Redirect } from "expo-router";

const NotificationLayout = () => {
  const storeId = useAppSelector(({ store }) => store.selectedStoreId);

  if (!storeId) {
    return <Redirect href={"/account"} />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    />
  );
};

export default NotificationLayout;
