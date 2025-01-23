import React from "react";

export default function useFilterItemsByString<T extends Record<string, any>>({
  items,
  targetFieldName,
}: {
  items: T[];
  targetFieldName: keyof T;
}) {
  const [filterText, setFilterText] = React.useState("");

  const filteredItems = React.useMemo(() => {
    return items.filter((item) =>
      item[targetFieldName].toLowerCase().includes(filterText.toLowerCase())
    );
  }, [filterText, items]);

  return {
    filterText,
    setFilterText,
    filteredItems,
  };
}
