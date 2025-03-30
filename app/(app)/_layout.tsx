import { Redirect, Stack } from "expo-router";

import VerifyEmail from "@/components/VerifyEmail";

import { useSession } from "@/contexts/SessionContext";

function AuthLayout() {
  const { session, user } = useSession();

  if (!session) {
    return <Redirect href="/welcome" />;
  }

  if (user && !user.emailVerifiedAt) {
    return <VerifyEmail />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default AuthLayout;
