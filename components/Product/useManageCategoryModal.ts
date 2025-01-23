import React from "react";
import { useAppDispatch, useAppSelector } from "../reduxHooks";
import {
  destroyCategory,
  getCategory,
  resetData,
  setData,
  storeCategory,
  updateCategory,
} from "./categorySlice";
import { useStore } from "@/contexts/StoreContext";
import { Alert } from "react-native";

export default function useManageCategoryModal({
  onClose = () => {},
  visible,
}: {
  visible: boolean | undefined;
  onClose: () => void;
}) {
  const loading = useAppSelector((state) => state.productCategory.loading);
  const selectedCategoryId = useAppSelector(
    (state) => state.productCategory.selectedCategoryId
  );
  const { name, productIds } = useAppSelector(
    (state) => state.productCategory.data
  );

  const dispatch = useAppDispatch();

  const { selectedStore } = useStore();

  const save = () => {
    if (selectedStore) {
      if (selectedCategoryId) {
        const payload = {
          productCategoryId: selectedCategoryId,
          storeId: selectedStore.id,
          name,
          productIds,
        };

        dispatch(updateCategory(payload))
          .unwrap()
          .then(() => {
            onClose();
          });
      } else {
        const payload = {
          storeId: selectedStore.id,
          name,
          productIds,
        };

        dispatch(storeCategory(payload))
          .unwrap()
          .then(() => {
            onClose();
          });
      }
    }
  };

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
    const payload = { name: text };
    dispatch(setData(payload));
  };

  const confirmDeletion = () => {
    Alert.alert(
      "Delete Category",
      "Are you sure you want to delete this category? This action cannot be undone.",
      [
        {
          text: "CANCEL",
        },
        {
          text: "OK",
          onPress: async () => {
            if (selectedCategoryId && selectedStore) {
              const payload = {
                storeId: selectedStore.id,
                productCategoryId: selectedCategoryId,
              };
              dispatch(destroyCategory(payload))
                .unwrap()
                .then(() => {
                  onClose();
                });
            }
          },
        },
      ]
    );
  };

  React.useEffect(() => {
    setModalVisibility((prev) => {
      return {
        ...prev,
        self: visible,
      };
    });
    if (visible) {
      if (selectedCategoryId && selectedStore) {
        const payload = {
          storeId: selectedStore.id,
          productCategoryId: selectedCategoryId,
        };
        dispatch(getCategory(payload));
      }
    } else {
      dispatch(resetData());
    }
  }, [visible]);

  return {
    confirmDeletion,
    modalVisibility,
    showAssignProductsModal,
    hideAssignProductsModal,
    setCategoryName,
    save,
    loading,
  };
}
