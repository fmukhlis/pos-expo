import { View, Text } from "react-native";
import React from "react";
import { useAppDispatch, useAppSelector } from "../reduxHooks";
import { setData } from "./categorySlice";

export default function useAssignProductsModal({
  visible,
  onClose = () => {},
}: {
  visible: boolean | undefined;
  onClose: () => void;
}) {
  const [modalVisible, setModalVisible] = React.useState(visible);

  const data = useAppSelector((state) => state.productCategory.data);
  const products = useAppSelector((state) => state.product.products);

  const dispatch = useAppDispatch();

  const [assignableProducts, setAssignableProducts] = React.useState(
    products.map((product) => ({
      ...product,
      isChecked: false,
    }))
  );

  const assignProduct = (itemId: number) => {
    setAssignableProducts((prev) =>
      prev.map((p) => (p.id === itemId ? { ...p, isChecked: !p.isChecked } : p))
    );
  };

  const save = () => {
    const products = assignableProducts
      .filter((assignableProduct) => assignableProduct.isChecked)
      .map(({ id, name }) => ({ id, name }));
    dispatch(setData({ products }));
    onClose();
  };

  React.useEffect(() => {
    setModalVisible(visible);
    setAssignableProducts(
      products.map((product) => ({
        ...product,
        isChecked: data.productIds.includes(product.id),
      }))
    );
  }, [visible]);

  return {
    modalVisible,
    assignProduct,
    assignableProducts,
    save,
  };
}
