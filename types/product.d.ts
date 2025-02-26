import { ProductCategory } from "./product-category";

export interface Product {
  id: number;
  name: string;
  availableModifiers: (ProductModifierCategory & {
    values: ProductModifier[];
  })[];
  availableOptions: (ProductOptionCategory & { values: ProductOption[] })[];
  availableVariants: ProductVariant[];
}

export interface DetailedProduct {
  id: number;
  name: string;
  category: ProductCategory;
  availableModifiers: (ProductModifierCategory & {
    values: ProductModifier[];
  })[];
  availableOptions: (ProductOptionCategory & { values: ProductOption[] })[];
  availableVariants: ProductVariant[];
}

export interface ProductPayload {
  name: string;
  availableModifiers:
    | {
        categoryName: string;
        values: { name: string }[];
      }[]
    | null;
  availableOptions:
    | {
        categoryName: string;
        values: { name: string }[];
      }[]
    | null;
  availableVariants: {
    stock: string;
    price: string;
    sku: string;
    options: string[] | null;
  }[];
}

export interface ProductModifier {
  id: number;
  name: string;
  status: "Active" | "Inactive";
}

export interface ProductModifierCategory {
  id: number;
  name: string;
  status: "Active" | "Inactive";
}

export interface ProductOption {
  id: number;
  name: string;
  status: "Active" | "Inactive";
}

export interface ProductOptionCategory {
  id: number;
  name: string;
  status: "Active" | "Inactive";
}

export interface ProductVariant {
  id: number;
  price: number;
  stock: number;
  sku: string;
  status: "Active" | "Inactive";
  productOptions: ProductOption[];
}
