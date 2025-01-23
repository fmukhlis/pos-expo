export interface ProductProps {
  id: number;
  name: string;
  availableModifiers: ProductModifierCategoryProps &
    { values: ProductModifierProps[] }[];
  availableOptions: ProductOptionCategoryProps &
    { values: ProductOptionProps[] }[];
  availableVariants: ProductVariantProps[];
}

export interface ProductData {
  name: string;
  availableModifiers: {
    categoryName: string;
    values: { name: string }[];
  }[];
  availableOptions: {
    categoryName: string;
    values: { name: string }[];
  }[];
  availableVariants: {
    stock: number;
    price: number;
    sku: string;
    options: string[];
  }[];
}

export interface ProductModifierProps {
  id: number;
  name: string;
  status: "Active" | "Inactive";
}

export interface ProductModifierCategoryProps {
  id: number;
  name: string;
  status: "Active" | "Inactive";
}

export interface ProductOptionProps {
  id: number;
  name: string;
  status: "Active" | "Inactive";
}

export interface ProductOptionCategoryProps {
  id: number;
  name: string;
  status: "Active" | "Inactive";
}

export interface ProductVariantProps {
  id: number;
  price: number;
  stock: number;
  sku: string;
  status: "Active" | "Inactive";
  productOptions: ProductOptionProps[];
}
