import React from "react";
import {
  getCategories,
  resetData,
  setSelectedCategoryId,
} from "./categorySlice";
import { useAppDispatch } from "../reduxHooks";
import { useStore } from "@/contexts/StoreContext";

export default function useCategory() {
  const { selectedStore } = useStore();

  const [modalVisible, setModalVisible] = React.useState(false);

  const showManageCategoryModal = (categoryId: number | null) => {
    dispatch(setSelectedCategoryId(categoryId));
    setModalVisible(true);
  };

  const hideManageCategoryModal = () => {
    setModalVisible(false);
  };

  const dispatch = useAppDispatch();

  const fetchCategories = () => {
    if (selectedStore) {
      const payload = { storeId: selectedStore.id };
      dispatch(getCategories(payload));
    }
  };

  React.useEffect(() => {
    fetchCategories();
  }, []);

  return {
    fetchCategories,
    modalVisible,
    setModalVisible,
    hideManageCategoryModal,
    showManageCategoryModal,
  };
}
