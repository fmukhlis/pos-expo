import React from "react";

import { addItem } from "./Order/orderSlice";
import { useAppDispatch } from "./reduxHooks";

export default function useKeypad() {
  const [price, setPrice] = React.useState("");
  const [note, setNote] = React.useState("");

  const updateCustomAmount = (number: string) => {
    setPrice((prev) => {
      if (prev.length >= 8) {
        return prev;
      }
      return prev + number;
    });
  };

  const clearCurrentInput = () => {
    setPrice("");
    setNote("");
  };

  const dispatch = useAppDispatch();

  const addCustomItem = () => {
    if (Number(price) > 0) {
      dispatch(addItem({ price, note, discount: "" }));
      clearCurrentInput();
    }
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
    price,
    hideNoteModal,
    showNoteModal,
    addCustomItem,
    handleModalSave,
    noteModalVisible,
    clearCurrentInput,
    updateCustomAmount,
  };
}
