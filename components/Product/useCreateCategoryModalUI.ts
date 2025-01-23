import { View, Text } from "react-native";
import React from "react";
import { useAppDispatch, useAppSelector } from "../reduxHooks";
import { resetData, setData, setName } from "./categorySlice";

export default function useCreateCategoryModalUI({
  visible,
}: {
  visible: boolean | undefined;
}) {
  const data = useAppSelector((state) => state.productCategory.data);
  const selectedCategory = useAppSelector(
    (state) => state.productCategory.selectedCategory
  );

  const dispatch = useAppDispatch();

  const [modalVisibility, setModalVisibility] = React.useState({
    self: visible,
    assignProducts: false,
  });

  const showAssignProductsModal = () => {
    setModalVisibility((prev) => {
      return {
        ...prev,
        assignProducts: true,
      };
    });
  };

  const hideAssignProductsModal = () => {
    setModalVisibility((prev) => {
      return {
        ...prev,
        assignProducts: false,
      };
    });
  };

  const setCategoryName = (text: string) => {
    dispatch(setName(text));
  };

  React.useEffect(() => {
    setModalVisibility((prev) => {
      return {
        ...prev,
        self: visible,
      };
    });
    if (!visible) {
      dispatch(resetData());
    } else {
      if (selectedCategory) {
        const { name, productsCount } = selectedCategory;
        dispatch(setData({ name }));
      }
    }
  }, [visible]);

  return {
    modalVisibility,
    showAssignProductsModal,
    hideAssignProductsModal,
    setCategoryName,
  };
}
