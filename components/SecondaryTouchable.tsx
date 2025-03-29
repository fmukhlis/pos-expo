import React, { ElementRef, forwardRef } from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

interface SecondaryTouchable
  extends React.ComponentPropsWithoutRef<typeof TouchableOpacity> {
  isProcessing?: boolean | undefined;
}

const SecondaryTouchableLG = forwardRef<
  ElementRef<typeof TouchableOpacity>,
  SecondaryTouchable
>(
  (
    {
      children,
      className = "",
      disabled = false,
      isProcessing = false,
      ...props
    },
    forwardedRef
  ) => {
    return (
      <TouchableOpacity
        {...props}
        ref={forwardedRef}
        activeOpacity={0.7}
        className={`min-w-[80px] min-h-[40px] border-2 border-r-gray-200 border-t-gray-200 border-b-gray-400 border-l-gray-400 bg-gray-300 justify-center items-center rounded ${className} ${
          disabled || isProcessing ? "opacity-70" : ""
        }`}
        disabled={disabled || isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator size={30} color="#ffffff" />
        ) : (
          children
        )}
      </TouchableOpacity>
    );
  }
);

const SecondaryTouchable = forwardRef<
  ElementRef<typeof TouchableOpacity>,
  SecondaryTouchable
>(
  (
    {
      children,
      className = "",
      disabled = false,
      isProcessing = false,
      ...props
    },
    forwardedRef
  ) => {
    return (
      <TouchableOpacity
        {...props}
        ref={forwardedRef}
        activeOpacity={0.7}
        className={`border-2 border-r-gray-200 border-t-gray-200 border-b-gray-400 border-l-gray-400 bg-gray-300 justify-center items-center rounded ${className} ${
          disabled || isProcessing ? "opacity-70" : ""
        }`}
        disabled={disabled || isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator size={25} color="#ffffff" />
        ) : (
          children
        )}
      </TouchableOpacity>
    );
  }
);

const SecondaryTouchableSM = forwardRef<
  ElementRef<typeof TouchableOpacity>,
  SecondaryTouchable
>(
  (
    {
      children,
      className = "",
      disabled = false,
      isProcessing = false,
      ...props
    },
    forwardedRef
  ) => {
    return (
      <TouchableOpacity
        {...props}
        ref={forwardedRef}
        activeOpacity={0.7}
        className={`min-w-[60px] min-h-[30px] border-2 border-r-gray-200 border-t-gray-200 border-b-gray-400 border-l-gray-400 bg-gray-300 justify-center items-center rounded ${className} ${
          disabled || isProcessing ? "opacity-70" : ""
        }`}
        disabled={disabled || isProcessing}
      >
        {isProcessing ? (
          <ActivityIndicator size={20} color="#ffffff" />
        ) : (
          children
        )}
      </TouchableOpacity>
    );
  }
);
export { SecondaryTouchableLG, SecondaryTouchable, SecondaryTouchableSM };
