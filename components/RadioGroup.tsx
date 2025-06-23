import React from "react";

import { View, Text, TouchableOpacity } from "react-native";

import { Primitive } from "@/types/global";

const RadioGroup = <
  O extends { label: string; value: V },
  V extends Primitive = string
>({
  options,
  onValueChange,
  value,
  ...props
}: RadioGroupProps<O, V>) => {
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
            <View className="border rounded-full border-gray-300 w-[25] h-[25]">
              {value === option.value && (
                <View className="rounded-full bg-blue-500 w-[18] h-[18] m-auto border border-blue-400" />
              )}
            </View>
            <Text className="ml-2 text-base">{option.label}</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

export default RadioGroup;

interface RadioGroupProps<
  O extends { label: string; value: V },
  V extends Primitive
> extends React.ComponentPropsWithoutRef<typeof View> {
  /**
   * Options for the radio group. Each "O[value]" must be unique.
   */
  options: O[];
  value?: V | undefined;
  onValueChange?: (option: O) => void | undefined;
}
