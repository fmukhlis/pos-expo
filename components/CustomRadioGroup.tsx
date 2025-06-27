import React from "react";

import { View, Text, TouchableOpacity } from "react-native";

import { Primitive } from "@/types/global";

const CustomRadioGroup = <
  O extends { label: string; value: V },
  V extends Primitive = string
>({
  value,
  options,
  renderItem,
  onValueChange,
  ...props
}: CustomRadioGroupProps<O, V>) => {
  return (
    <View {...props}>
      {options.map((option) => (
        <View className="border-t border-gray-200" key={`${option.value}`}>
          <TouchableOpacity
            className="flex-row items-center py-2"
            onPress={() => {
              if (onValueChange) {
                onValueChange(option);
              }
            }}
          >
            {renderItem(option.label, value === option.value)}
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default CustomRadioGroup;

interface CustomRadioGroupProps<
  O extends { label: string; value: V },
  V extends Primitive
> extends React.ComponentPropsWithoutRef<typeof View> {
  /**
   * Options for the radio group. Each "O[value]" must be unique.
   */
  value?: V | undefined;
  options: O[];
  renderItem: (label: string, isSelected: boolean) => React.JSX.Element;
  onValueChange?: (option: O) => void | undefined;
}
