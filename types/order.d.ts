import { PaymentMethod } from "./payment-method";
import { Product, ProductModifier, ProductVariant } from "./product";
import { User } from "./user";

export interface Item {
  id: number;
  note: string | null;
  customAmount: number | null;
  isCanceled: 0 | 1;
  cancelReason: string | null;
  createdAt: string;
  updatedAt: string;
  quantity: number;
  discount: number | null;

  product: Product | null;
  variantId: number | null;
  selectedModifierIds: number[] | null;
}

export interface Order {
  id: number;
  cashAmount: number;
  orderType: "Dine In" | "Take Away";
  status: "Paid" | "Billed";
  tableNumber: number | null;
  customer: null;
  paymentMethod: PaymentMethod;
  orderedProducts: Item[];
  createdAt: string;
  user: User;
}

export interface TransactionHistory {
  id: number;
  refunds: { refundedAt: string; totalAmount: number }[];
  orderedProducts: {
    id: number;
    productName: string;
    quantity: string;
  }[];
  totalAmount: number;
  createdAt: string;
}

export type ItemPayload = CustomItemPayload | StandardItemPayload;

export interface CustomItemPayload {
  note?: string;
  customAmount: number;
  discount?: number;
  quantity: number;
}

export interface StandardItemPayload
  extends Omit<CustomItemPayload, "customAmount"> {
  variantId: string;
  modifierIds: string[];
}

export interface OrderPayload {
  cashAmount: number;
  orderType: "Dine In" | "Take Away";
  status: "Paid" | "Billed";
  tableNumber?: number;
  customerId?: number;
  paymentMethodId: number;
  orderedProducts: ItemPayload[];
}
