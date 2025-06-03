import React from "react";

import { Redirect, Stack } from "expo-router";
import { useAppSelector } from "@/components/reduxHooks";

const TransactionLayout = () => {
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

export default TransactionLayout;
