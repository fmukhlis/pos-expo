import React from "react";
import { useAppDispatch, useAppSelector } from "../reduxHooks";
import { resetData, setData } from "./categorySlice";
import { useStore } from "@/contexts/StoreContext";
import { Alert } from "react-native";
import {
  useDestroyProductCategoryMutation,
  useLazyGetProductCategoryQuery,
  useStoreProductCategoryMutation,
  useUpdateProductCategoryMutation,
} from "../services/productCategory";
import Toast from "react-native-toast-message";

export default function useManageCategoryModal({
  visible,
  onClose = () => {},
}: {
  visible: boolean | undefined;
  onClose: () => void;
}) {
  const selectedCategoryId = useAppSelector(
    ({ productCategory }) => productCategory.selectedCategoryId
  );
  const { name, productIds } = useAppSelector(
    ({ productCategory }) => productCategory.data
  );

  const dispatch = useAppDispatch();

  const { selectedStore } = useStore();

  const [getCategory, getCategoryResult] = useLazyGetProductCategoryQuery();
  const [storeCategory, storeCategoryResult] =
    useStoreProductCategoryMutation();
  const [updateCategory, updateCategoryResult] =
    useUpdateProductCategoryMutation();
  const [destroyCategory, destroyCategoryResult] =
    useDestroyProductCategoryMutation();

  const save = () => {
    if (selectedStore) {
      let payload = {
        storeId: selectedStore.id,
        name,
        productIds,
      };

      if (selectedCategoryId) {
        updateCategory({ ...payload, productCategoryId: selectedCategoryId })
          .unwrap()
          .then(() => {
            onClose();
          })
          .catch((error) => {
            Toast.show({
              type: "error",
              text1: "Error " + error.status,
              text2: error.data.message,
              autoHide: true,
              swipeable: false,
            });
          });
      } else {
        storeCategory(payload)
          .unwrap()
          .then(() => {
            onClose();
          })
          .catch((error) => {
            Toast.show({
              type: "error",
              text1: "Error " + error.status,
              text2: error.data.message,
              autoHide: true,
              swipeable: false,
            });
          });
      }
    }
  };

  const [modalVisible, setModalVisible] = React.useState(false);

  const showAssignProductsModal = () => {
    setModalVisible(true);
  };
  const hideAssignProductsModal = () => {
    setModalVisible(false);
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
              destroyCategory(payload)
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
    if (visible) {
      if (selectedCategoryId && selectedStore) {
        const payload = {
          storeId: selectedStore.id,
          productCategoryId: selectedCategoryId,
        };
        getCategory(payload)
          .unwrap()
          .then(({ name, products }) => {
            dispatch(setData({ name, products }));
          });
      }
    } else {
      dispatch(resetData());
    }
  }, [visible]);

  return {
    confirmDeletion,
    modalVisible,
    showAssignProductsModal,
    hideAssignProductsModal,
    setCategoryName,
    save,
    getCategoryResult,
    storeCategoryResult,
    updateCategoryResult,
    destroyCategoryResult,
  };
}
