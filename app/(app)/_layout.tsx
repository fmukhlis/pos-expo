import { Redirect, Stack } from "expo-router";

import VerifyEmail from "@/components/VerifyEmail";

import { useSession } from "@/contexts/SessionContext";
import LoadingPage from "@/components/LoadingPage";

function AuthLayout() {
  const { session, user, sessionLoading } = useSession();

  if (sessionLoading) {
    return <LoadingPage />;
  }

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
