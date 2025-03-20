import React from "react";
import { useAppDispatch, useAppSelector } from "../reduxHooks";
import { setData } from "./categorySlice";
import { useGetProductsQuery } from "../services/product";
import { skipToken } from "@reduxjs/toolkit/query";

export default function useAssignProductsModal({
  visible = false,
  onClose = () => {},
}: {
  visible: boolean | undefined;
  onClose: () => void;
}) {
  const storeId = useAppSelector(({ store }) => store.selectedStoreId)!;

  const data = useAppSelector((state) => state.productCategory.data);

  const { data: products, isFetching } = useGetProductsQuery({ storeId });

  const dispatch = useAppDispatch();

  const [assignableProducts, setAssignableProducts] = React.useState(
    products
      ? products.map((product) => ({
          ...product,
          isChecked: data.productIds.includes(product.id),
        }))
      : []
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
    if (visible) {
      setAssignableProducts(
        products
          ? products.map((product) => ({
              ...product,
              isChecked: data.productIds.includes(product.id),
            }))
          : []
      );
    }
  }, [visible]);

  return {
    assignProduct,
    assignableProducts,
    save,
    isFetching,
  };
}
