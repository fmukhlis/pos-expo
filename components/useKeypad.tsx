import React from "react";

import { addItem } from "./Order/orderSlice";
import { useAppDispatch } from "./reduxHooks";

export default function useKeypad() {
  const [customAmount, setCustomAmount] = React.useState("");
  const [note, setNote] = React.useState("");

  const updateCustomAmount = (number: string) => {
    setCustomAmount((prev) => {
      if (prev.length >= 8) {
        return prev;
      }
      return prev + number;
    });
  };

  const clearCurrentInput = () => {
    setCustomAmount("");
    setNote("");
  };

  const dispatch = useAppDispatch();

  const addCustomItem = () => {
    dispatch(addItem({ customAmount, note }));
    clearCurrentInput();
  };

  const [noteModalVisible, setNoteModalVisible] = React.useState(false);

  const hideNoteModal = () => {
    setNoteModalVisible(false);
  };

  const showNoteModal = () => {
    setNoteModalVisible(true);
  };

  const handleModalSave = (value: string) => {
    setNote(value);
    hideNoteModal();
  };

  return {
    note,
    hideNoteModal,
    showNoteModal,
    customAmount,
    addCustomItem,
    handleModalSave,
    noteModalVisible,
    clearCurrentInput,
    updateCustomAmount,
  };
}
