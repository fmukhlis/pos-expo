import React from "react";

import { Redirect, Stack } from "expo-router";
import { useAppSelector } from "@/components/reduxHooks";

const CategoryLayout = () => {
  const storeId = useAppSelector(({ store }) => store.selectedStoreId);

  if (!storeId) {
    return <Redirect href={"/account"} />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
};

export default CategoryLayout;
