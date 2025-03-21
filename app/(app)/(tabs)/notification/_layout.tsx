import React from "react";
import { Stack } from "expo-router";

const NotificationLayout = () => {
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </>
  );
};

export default NotificationLayout;
