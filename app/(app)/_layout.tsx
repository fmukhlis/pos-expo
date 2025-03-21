import { Redirect, Stack } from "expo-router";

import { useSession } from "@/contexts/SessionContext";

import VerifyEmail from "@/components/VerifyEmail";

function AuthLayout() {
  const { session, user } = useSession();

  if (!session) {
    return <Redirect href="/welcome" />;
  }

  if (user && !user.emailVerifiedAt) {
    return <VerifyEmail />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
    </>
  );
}

export default AuthLayout;
