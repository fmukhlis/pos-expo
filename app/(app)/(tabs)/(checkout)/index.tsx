import React from "react";

import { View, Text, TouchableHighlight, TouchableOpacity } from "react-native";

import useKeypad from "@/components/useKeypad";
import ManageNoteModal from "@/components/Order/Checkout/ManageNoteModal";

import { Icon } from "@/components/Icon";
import { currencyFormat } from "@/utils/defaultFormat";

const Keypad = () => {
  const {
    note,
    hideNoteModal,
    showNoteModal,
    customAmount,
    addCustomItem,
    handleModalSave,
    noteModalVisible,
    clearCurrentInput,
    updateCustomAmount,
  } = useKeypad();

  return (
    <>
      <ManageNoteModal
        onSave={handleModalSave}
        visible={noteModalVisible}
        onRequestClose={hideNoteModal}
        customItem={{ note, price: customAmount }}
      />
      <View className="flex-1 pt-16 bg-white">
        <View className="h-[215] items-center justify-center">
          <Text className="text-5xl text-center mb-3">
            {currencyFormat.format(Number(customAmount))}
          </Text>
          {!!note && <Text className="mb-5 text-gray-500">{note}</Text>}
          {!!Number(customAmount) && (
            <TouchableOpacity
              onPress={showNoteModal}
              className="border border-gray-300 rounded w-28 h-9 items-center justify-center bg-gray-50"
            >
              <Text className="text-gray-500 font-bold">
                {!!note ? "Edit" : "Add"} note
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <View className="flex-row flex-wrap">
          <TouchableHighlight
            underlayColor={"#9ca3af55"}
            onPress={() => {
              updateCustomAmount("1");
            }}
            className="w-[33.3%] h-[23%] items-center justify-center border-t border-l border-gray-400"
          >
            <Text className="text-2xl text-gray-700">1</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={"#9ca3af55"}
            onPress={() => {
              updateCustomAmount("2");
            }}
            className="w-[33.3%] h-[23%] items-center justify-center border-t border-x border-gray-400"
          >
            <Text className="text-2xl text-gray-700">2</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={"#9ca3af55"}
            onPress={() => {
              updateCustomAmount("3");
            }}
            className="w-[33.3%] h-[23%] items-center justify-center border-t border-r border-gray-400"
          >
            <Text className="text-2xl text-gray-700">3</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={"#9ca3af55"}
            onPress={() => {
              updateCustomAmount("4");
            }}
            className="w-[33.3%] h-[23%] items-center justify-center border-t border-l border-gray-400"
          >
            <Text className="text-2xl text-gray-700">4</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={"#9ca3af55"}
            onPress={() => {
              updateCustomAmount("5");
            }}
            className="w-[33.3%] h-[23%] items-center justify-center border-t border-x border-gray-400"
          >
            <Text className="text-2xl text-gray-700">5</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={"#9ca3af55"}
            onPress={() => {
              updateCustomAmount("6");
            }}
            className="w-[33.3%] h-[23%] items-center justify-center border-t border-r border-gray-400"
          >
            <Text className="text-2xl text-gray-700">6</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={"#9ca3af55"}
            onPress={() => {
              updateCustomAmount("7");
            }}
            className="w-[33.3%] h-[23%] items-center justify-center border-t border-l border-gray-400"
          >
            <Text className="text-2xl text-gray-700">7</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={"#9ca3af55"}
            onPress={() => {
              updateCustomAmount("8");
            }}
            className="w-[33.3%] h-[23%] items-center justify-center border-t border-x border-gray-400"
          >
            <Text className="text-2xl text-gray-700">8</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={"#9ca3af55"}
            onPress={() => {
              updateCustomAmount("9");
            }}
            className="w-[33.3%] h-[23%] items-center justify-center border-t border-r border-gray-400"
          >
            <Text className="text-2xl text-gray-700">9</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={"#9ca3af55"}
            onPress={() => {
              clearCurrentInput();
            }}
            className="w-[33.3%] h-[23%] items-center justify-center border-t border-l border-b border-gray-400"
          >
            <Text className="text-2xl text-gray-700">C</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={"#9ca3af55"}
            onPress={() => {
              updateCustomAmount("0");
            }}
            className="w-[33.3%] h-[23%] items-center justify-center border-t border-x border-b border-gray-400"
          >
            <Text className="text-2xl text-gray-700">0</Text>
          </TouchableHighlight>
          <TouchableHighlight
            underlayColor={"#9ca3af55"}
            onPress={addCustomItem}
            className="w-[33.3%] h-[23%] items-center justify-center border-t border-r border-b border-gray-400"
          >
            <Icon name="add" />
          </TouchableHighlight>
        </View>
      </View>
    </>
  );
};

export default Keypad;
