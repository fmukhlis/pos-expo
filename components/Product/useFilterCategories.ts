import { ProductCategory } from "@/types/product-category";
import React from "react";

export default function useFilterCategories({
  categories,
}: {
  categories: ProductCategory[];
}) {
  const [filterText, setFilterText] = React.useState("");

  const filteredCategories = React.useMemo(() => {
    return categories.filter((category) =>
      category.name.toLowerCase().includes(filterText.toLowerCase())
    );
  }, [filterText, categories]);

  return {
    filterText,
    setFilterText,
    filteredCategories,
  };
}
