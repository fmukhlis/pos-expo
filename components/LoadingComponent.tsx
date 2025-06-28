import React from "react";
import { View, ActivityIndicator } from "react-native";

import { Colors } from "@/constants/Colors";
import { useTheme } from "@/contexts/ThemeProvider";

const LoadingComponent = ({
  size = "large",
  className = "",
  ...props
}: LoadingComponentProps) => {
  const { colorScheme } = useTheme();

  return (
    <View
      {...props}
      className={`flex-1 justify-center items-center bg-white ${className}`}
    >
      <ActivityIndicator
        size={size}
        color={
          colorScheme === "dark"
            ? Colors.dark.highlightedText
            : Colors.light.highlightedText
        }
      />
    </View>
  );
};

export default LoadingComponent;

interface LoadingComponentProps
  extends React.ComponentPropsWithoutRef<typeof View> {
  size?: number | "small" | "large" | undefined;
}
