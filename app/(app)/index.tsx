import React from "react";
import { Redirect } from "expo-router";

import LoadingPage from "@/components/LoadingPage";
import { useSession } from "@/contexts/SessionContext";

const LoadingState = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  const { syncUserLoading } = useSession();

  React.useEffect(() => {
    if (!syncUserLoading) {
      setIsLoading(false);
    }
  }, [syncUserLoading]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return <Redirect href={"/(checkout)"} />;
};

export default LoadingState;
