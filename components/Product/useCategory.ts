import React from "react";
import { setSelectedCategoryId } from "./categorySlice";
import { useAppDispatch } from "../reduxHooks";

export default function useCategory() {
  const [modalVisible, setModalVisible] = React.useState(false);

  const showManageCategoryModal = (categoryId: number | null) => {
    dispatch(setSelectedCategoryId(categoryId));
    setModalVisible(true);
  };

  const hideManageCategoryModal = () => {
    setModalVisible(false);
  };

  const dispatch = useAppDispatch();

  return {
    modalVisible,
    setModalVisible,
    hideManageCategoryModal,
    showManageCategoryModal,
  };
}
