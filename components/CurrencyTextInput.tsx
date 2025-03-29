import React from "react";

import { NativeSyntheticEvent, TextInputKeyPressEventData } from "react-native";

import PrimaryInput from "./PrimaryInput";

import { currencyFormat } from "@/utils/defaultFormat";

const CurrencyTextInput = ({
  value = "",
  onValueChange,
  ...props
}: CurrencyTextInput) => {
  const currentValue = React.useMemo(() => {
    const raw = value.replace(/\D/g, "");
    const formatted = currencyFormat.format(Math.min(Number(raw), 999999999));
    return formatted;
  }, [value]);

  // This won't be triggered when we type something because we limit the max length.
  // It's because when we update the input value (and of course this will update the
  // max length) it will use the current state until the next rerender.
  const handleTextChange = (text: string) => {
    if (onValueChange) {
      const newValue = generateFormattedValue(value, text, "set");
      onValueChange(newValue);
    }
  };

  const handleKeyPress = (
    event: NativeSyntheticEvent<TextInputKeyPressEventData>
  ) => {
    const key = event.nativeEvent.key;
    const isNumeric = key >= "0" && key <= "9";

    if (isNumeric && onValueChange) {
      const newValue = generateFormattedValue(value, key, "add");
      onValueChange(newValue);
    }
  };

  return (
    <PrimaryInput
      {...props}
      value={currentValue}
      maxLength={value.length ? currentValue.length : 0}
      onKeyPress={handleKeyPress}
      onChangeText={handleTextChange}
    />
  );
};

export default CurrencyTextInput;

interface CurrencyTextInput
  extends Omit<React.ComponentPropsWithoutRef<typeof PrimaryInput>, "value"> {
  value?: string | undefined;
  onValueChange?:
    | ((value: { raw: string; formatted: string }) => void)
    | undefined;
}

const generateFormattedValue = (
  prevValue: string,
  newValue: string,
  type: "add" | "remove" | "set"
) => {
  switch (type) {
    case "add": {
      let raw = `${prevValue}${newValue}`;
      const formatted = currencyFormat.format(Number(raw));
      return { raw, formatted };
    }
    case "set": {
      let raw = newValue.replace(/\D/g, "");
      const formatted = currencyFormat.format(Number(raw));
      return { raw, formatted };
    }
    default:
      throw new Error();
  }
};
